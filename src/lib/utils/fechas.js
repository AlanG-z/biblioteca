const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Fecha de hoy en formato YYYY-MM-DD (hora local) */
export function hoyISO() {
  return new Date().toLocaleDateString('en-CA');
}

function aUTC(iso) {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return Date.UTC(anio, mes - 1, dia);
}

/** Días entre dos fechas YYYY-MM-DD (positivo si "hasta" es posterior a "desde") */
export function diasEntre(desde, hasta) {
  return Math.round((aUTC(hasta) - aUTC(desde)) / MS_POR_DIA);
}