import { supabase } from '#lib/supabase.js';

/** Llama a la función SQL que descuenta stock, valida multas y crea el préstamo */
export async function pedirPrestamo(libroId) {
  const { data, error } = await supabase.rpc('pedir_prestamo', { p_libro_id: libroId });
  return { prestamo: data ?? null, error: error ? error.message : null };
}