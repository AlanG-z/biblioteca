import { supabase } from '#lib/supabase.js';
import { hoyISO, diasEntre } from '#lib/utils/fechas.js';

/** Llama a la función SQL que descuenta stock, valida multas y crea el préstamo */
export async function pedirPrestamo(libroId) {
  const { data, error } = await supabase.rpc('pedir_prestamo', { p_libro_id: libroId });
  return { prestamo: data ?? null, error: error ? error.message : null };
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