import { supabase } from '#lib/supabase.js';

/** Traduce los errores más comunes de Supabase */
function traducirError(error) {
  const mensajes = {
    'Invalid login credentials': 'Email o contraseña incorrectos',
    'Email not confirmed': 'Tenés que confirmar tu email antes de ingresar',
    'User already registered': 'Ya existe una cuenta con ese email',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres'
  };
  return mensajes[error.message] ?? error.message;
}

export async function ingresar(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { usuario: data?.user ?? null, error: error ? traducirError(error) : null };
}

export async function registrar(nombre, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } } // el trigger lo copia a la tabla perfiles
  });
  return {
    // si la confirmación de email está activa, no hay sesión todavía
    requiereConfirmacion: !error && !data.session,
    error: error ? traducirError(error) : null
  };
}

export async function salir() {
  await supabase.auth.signOut();
}