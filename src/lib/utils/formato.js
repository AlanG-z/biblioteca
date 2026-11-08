/** '2026-11-08' → '08/11/2026' */
export function formatearFecha(iso) {
  if (!iso) return '—';
  const [anio, mes, dia] = iso.split('-').map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/** 300 → '$ 300,00' */
export function formatearMonto(monto) {
  return Number(monto).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}