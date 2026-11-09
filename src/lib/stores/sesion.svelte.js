import { supabase } from '#lib/supabase.js';

/**
 * @typedef {object} Perfil
 * @property {string} [nombre]  Nombre visible del usuario
 * @property {string} [rol]     'admin' | 'cliente'
 */

/**
 * Estado global de la sesión (reactivo con runes).
 *
 * @type {{ usuario: import('@supabase/supabase-js').User | null, perfil: Perfil | null, cargando: boolean }}
 */
export const sesion = $state({
  usuario: null,   // usuario de Supabase Auth
  perfil: null,    // fila de la tabla perfiles (nombre, rol...)
  cargando: true   // true hasta saber si hay sesión guardada
});

/** @param {string} userId */
export async function cargarPerfil(userId) {
  const { data } = await supabase.from('perfiles').select('*').eq('id', userId).single();
  sesion.perfil = data ?? null;
}

/** Se llama una sola vez al arrancar la app */
export async function iniciarSesionStore() {
  const { data } = await supabase.auth.getSession();
  sesion.usuario = data.session?.user ?? null;
  if (sesion.usuario) await cargarPerfil(sesion.usuario.id);
  sesion.cargando = false;

  // Se dispara al ingresar, salir o vencer la sesión
  supabase.auth.onAuthStateChange((_evento, session) => {
    sesion.usuario = session?.user ?? null;
    if (session?.user) {
      // setTimeout evita bloquear el callback con otra llamada a Supabase
      setTimeout(() => cargarPerfil(session.user.id), 0);
    } else {
      sesion.perfil = null;
    }
  });
}