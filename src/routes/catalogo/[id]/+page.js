import { error } from '@sveltejs/kit';
import { getLibro } from '#lib/api/libros.js';

export async function load({ params }) {
  const libro = await getLibro(Number(params.id));
  if (!libro) error(404, 'Libro no encontrado');
  return { libro };
}