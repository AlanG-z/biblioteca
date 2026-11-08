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

/** Inserta un libro nuevo. Al crearlo, todos los ejemplares están disponibles. */
export async function crearLibro({ titulo, autor, isbn, categoriaId, portada, ejemplares }) {
  const { data, error } = await supabase
    .from('libros')
    .insert({
      titulo: titulo.trim(),
      autor: autor.trim(),
      isbn: isbn.trim() || null,
      categoria_id: categoriaId || null,
      portada: portada.trim() || null,
      ejemplares_total: ejemplares,
      ejemplares_disponibles: ejemplares
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') return { libro: null, error: 'Ya existe un libro con ese ISBN' };
    if (error.code === '42501') return { libro: null, error: 'No tenés permisos para agregar libros' };
    return { libro: null, error: error.message };
  }
  return { libro: data, error: null };
}

/** Edita un libro. El ajuste de stock lo hace la función SQL. */
export async function actualizarLibro(id, { titulo, autor, isbn, categoriaId, portada, ejemplares }) {
  const { error } = await supabase.rpc('actualizar_libro', {
    p_id: id,
    p_titulo: titulo.trim(),
    p_autor: autor.trim(),
    p_isbn: isbn.trim() || null,
    p_categoria_id: categoriaId || null,
    p_portada: portada.trim() || null,
    p_ejemplares_total: ejemplares
  });

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe otro libro con ese ISBN' };
    return { error: error.message };
  }
  return { error: null };
}

/** Elimina un libro. Falla si tiene préstamos registrados. */
export async function eliminarLibro(id) {
  const { data, error } = await supabase.from('libros').delete().eq('id', id).select('id');

  if (error) {
    if (error.code === '23503') {
      return { error: 'No se puede eliminar: el libro tiene préstamos registrados' };
    }
    return { error: error.message };
  }
  // RLS no da error cuando bloquea: simplemente no borra ninguna fila
  if (!data || data.length === 0) {
    return { error: 'No se pudo eliminar el libro. ¿Tenés permisos de administrador?' };
  }
  return { error: null };
}