/**
 * Modo claro / oscuro.
 *
 * El atributo `data-tema` en `<html>` es la fuente de verdad del CSS
 * (`:root[data-tema='oscuro']` en src/app.css). El script inline de
 * src/app.html lo setea antes del primer pintado (sin flash) y acá se lee.
 */

const CLAVE = 'tema';

/**
 * @returns {'claro' | 'oscuro'}
 */
function leerTema() {
  if (typeof document === 'undefined') return 'claro';
  const atributo = document.documentElement.dataset.tema;
  return atributo === 'oscuro' ? 'oscuro' : 'claro';
}

/** Estado reactivo que lee el botón del navbar. */
export const tema = $state({ actual: leerTema() });

/** Alterna entre modo claro y oscuro y lo guarda en localStorage. */
export function alternarTema() {
  tema.actual = tema.actual === 'oscuro' ? 'claro' : 'oscuro';
  document.documentElement.dataset.tema = tema.actual;
  try {
    localStorage.setItem(CLAVE, tema.actual);
  } catch {
    // sin storage: el tema se aplica igual durante esta sesión
  }
}
