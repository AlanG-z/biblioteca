import { error } from '@sveltejs/kit';
import { getLibro, getCategorias } from '#lib/api/libros.js';

export async function load({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) error(404, 'Libro no encontrado');

  const [libro, categorias] = await Promise.all([getLibro(id), getCategorias()]);
  if (!libro) error(404, 'Libro no encontrado');

  return { libro, categorias };
}