/**
 * Confirmación modal — reemplaza al `confirm()` nativo, que no se puede estilizar.
 *
 * Uso desde cualquier página:
 *   const ok = await confirmar({ titulo: '...', mensaje: '...' });
 *   if (!ok) return;
 *
 * El componente que renderiza el modal es `#lib/components/ui/Confirmacion.svelte`
 * y está montado una sola vez en `src/routes/+layout.svelte`.
 */

/**
 * @typedef {object} OpcionesConfirmacion
 * @property {string} titulo         Título del diálogo
 * @property {string} mensaje        Pregunta o advertencia
 * @property {string} [textoOk]      Texto del botón de confirmación (default 'Aceptar')
 * @property {string} [textoCancelar] Texto del botón cancelar (default 'Cancelar')
 * @property {boolean} [peligro]     true → botón rojo e icono de advertencia (acciones destructivas)
 * @property {string} [icono]        Emoji del círculo superior (default: '⚠' si peligro, si no 'ℹ')
 */

/** Estado que lee el modal (reactivo con runes). */
export const confirmacion = $state({
  abierta: false,
  titulo: '',
  mensaje: '',
  textoOk: 'Aceptar',
  textoCancelar: 'Cancelar',
  peligro: false,
  icono: 'ℹ'
});

/** @type {((valor: boolean) => void) | null} */
let resolver = null;

/**
 * Abre el modal y devuelve una promesa que se resuelve con la respuesta del usuario.
 * Si ya había otro modal abierto, ese se resuelve con `false` (como un Escape).
 *
 * @param {OpcionesConfirmacion} opciones
 * @returns {Promise<boolean>}
 */
export function confirmar(opciones) {
  resolver?.(false);

  confirmacion.titulo = opciones.titulo;
  confirmacion.mensaje = opciones.mensaje;
  confirmacion.textoOk = opciones.textoOk ?? 'Aceptar';
  confirmacion.textoCancelar = opciones.textoCancelar ?? 'Cancelar';
  confirmacion.peligro = opciones.peligro ?? false;
  confirmacion.icono = opciones.icono ?? (confirmacion.peligro ? '⚠' : 'ℹ');
  confirmacion.abierta = true;

  return new Promise((resolve) => {
    resolver = resolve;
  });
}

/**
 * Cierra el modal y resuelve la promesa de `confirmar`.
 * @param {boolean} valor true si el usuario aceptó
 */
export function responderConfirmacion(valor) {
  if (!confirmacion.abierta) return;
  confirmacion.abierta = false;
  resolver?.(valor);
  resolver = null;
}



