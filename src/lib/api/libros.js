import { supabase } from '#lib/supabase.js';

const COLUMNAS =
  'id, titulo, autor, isbn, portada, categoria_id, ejemplares_total, ejemplares_disponibles, categorias(nombre)';

/** Convierte la fila de la base al formato que usan los componentes */
function normalizar(fila) {
  return {
    id: fila.id,
    titulo: fila.titulo,
    autor: fila.autor,
    isbn: fila.isbn,
    portada: fila.portada,
    categoriaId: fila.categoria_id,
    categoria: fila.categorias?.nombre ?? 'Sin categoría',
    ejemplares: fila.ejemplares_disponibles,
    ejemplaresTotal: fila.ejemplares_total,
    disponible: fila.ejemplares_disponibles > 0
  };
}

export async function getLibros({ busqueda = '', categoriaId = null, soloDisponibles = false } = {}) {
  let consulta = supabase.from('libros').select(COLUMNAS).order('titulo');

  if (categoriaId) consulta = consulta.eq('categoria_id', categoriaId);
  if (soloDisponibles) consulta = consulta.gt('ejemplares_disponibles', 0);

  // quitamos caracteres que rompen la sintaxis del filtro "or"
  const texto = busqueda.trim().replace(/[%,()*]/g, ' ');
  if (texto) consulta = consulta.or(`titulo.ilike.%${texto}%,autor.ilike.%${texto}%`);

  const { data, error } = await consulta;
  if (error) throw new Error(error.message);
  return data.map(normalizar);
}

export async function getLibro(id) {
  const { data, error } = await supabase
    .from('libros')
    .select(COLUMNAS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? normalizar(data) : null;
}

export async function getCategorias() {
  const { data, error } = await supabase.from('categorias').select('id, nombre').order('nombre');
  if (error) throw new Error(error.message);
  return data;
}