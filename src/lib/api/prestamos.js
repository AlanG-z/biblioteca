import { supabase } from '#lib/supabase.js';
import { hoyISO, diasEntre } from '#lib/utils/fechas.js';

/** Llama a la función SQL que descuenta stock, valida multas y crea el préstamo */
export async function pedirPrestamo(libroId) {
  const { data, error } = await supabase.rpc('pedir_prestamo', { p_libro_id: libroId });
  return { prestamo: data ?? null, error: error ? error.message : null };
}

/**
 * ¿Tiene el usuario al menos una multa impaga?
 * @param {string} usuarioId
 */
export async function tieneMultasImpagas(usuarioId) {
  const { data, error } = await supabase
    .from('prestamos')
    .select('id, multas!inner(id, pagada)')
    .eq('usuario_id', usuarioId)
    .eq('multas.pagada', false)
    .limit(1);

  if (error) throw new Error(error.message);
  return data.length > 0;
}

/**
 * ¿Tiene el usuario un préstamo atrasado? (sin devolver y con la fecha prevista vencida)
 * @param {string} usuarioId
 */
export async function tienePrestamoAtrasado(usuarioId) {
  const { data, error } = await supabase
    .from('prestamos')
    .select('id')
    .eq('usuario_id', usuarioId)
    .is('fecha_devolucion_real', null)
    .lt('fecha_devolucion_prevista', hoyISO())
    .limit(1);

  if (error) throw new Error(error.message);
  return data.length > 0;
}

/**
 * Motivo por el que el usuario no puede pedir un préstamo nuevo, o null si puede.
 * Nunca lanza: si falla la consulta deja pasar y la RPC vuelve a validar en el servidor.
 * @param {string} usuarioId
 * @returns {Promise<string | null>}
 */
export async function motivoBloqueoPrestamo(usuarioId) {
  try {
    const [multaImpaga, atrasado] = await Promise.all([
      tieneMultasImpagas(usuarioId),
      tienePrestamoAtrasado(usuarioId)
    ]);

    if (multaImpaga) {
      return 'Tenés una multa impaga. Hasta que no la pagues no vas a poder pedir libros nuevos.';
    }
    if (atrasado) {
      return 'Tenés un libro atrasado. Devuélvelo antes de pedir un préstamo nuevo.';
    }
  } catch {
    // sin red o sin permisos no bloqueamos: en el servidor la RPC valida igual
  }
  return null;
}

/** Convierte la fila de la base al formato que usan los componentes */
function normalizarPrestamo(fila) {
  // multas es una relación 1 a 1: puede venir como objeto, arreglo o null
  const multa = Array.isArray(fila.multas) ? fila.multas[0] : fila.multas;
  const hoy = hoyISO();

  let estado = fila.estado;
  let diasAtraso = 0;
  let diasRestantes = 0;

  if (fila.fecha_devolucion_real === null) {
    // el estado "atrasado" se calcula acá, así no depende de ejecutar marcar_atrasados()
    diasAtraso = Math.max(0, diasEntre(fila.fecha_devolucion_prevista, hoy));
    diasRestantes = Math.max(0, diasEntre(hoy, fila.fecha_devolucion_prevista));
    if (diasAtraso > 0) estado = 'atrasado';
  }

  return {
    id: fila.id,
    libro: fila.libros,
    fechaPrestamo: fila.fecha_prestamo,
    fechaPrevista: fila.fecha_devolucion_prevista,
    fechaReal: fila.fecha_devolucion_real,
    estado,
    diasAtraso,
    diasRestantes,
    multa: multa
      ? { diasAtraso: multa.dias_atraso, monto: Number(multa.monto), pagada: multa.pagada }
      : null
  };
}

/** Préstamos de un usuario, del más reciente al más antiguo */
export async function getMisPrestamos(usuarioId) {
  const { data, error } = await supabase
    .from('prestamos')
    .select(
      'id, fecha_prestamo, fecha_devolucion_prevista, fecha_devolucion_real, estado, ' +
        'libros(id, titulo, autor, portada), multas(id, dias_atraso, monto, pagada)'
    )
    .eq('usuario_id', usuarioId)
    .order('fecha_prestamo', { ascending: false })
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(normalizarPrestamo);
}