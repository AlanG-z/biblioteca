<script>
  import EstadoBadge from './EstadoBadge.svelte';
  import { formatearFecha, formatearMonto } from '#lib/utils/formato.js';

  let { prestamo } = $props();

  let detalle = $derived.by(() => {
    if (prestamo.estado === 'devuelto') {
      return `Devuelto el ${formatearFecha(prestamo.fechaReal)}`;
    }
    if (prestamo.estado === 'atrasado') {
      const dias = prestamo.diasAtraso;
      return `${dias} ${dias === 1 ? 'día' : 'días'} de atraso. La multa se calcula al devolver el libro.`;
    }
    if (prestamo.diasRestantes === 0) return 'Vence hoy';
    if (prestamo.diasRestantes === 1) return 'Vence mañana';
    return `Te quedan ${prestamo.diasRestantes} días`;
  });
</script>

<article class="prestamo" class:atrasado={prestamo.estado === 'atrasado'}>
  <div class="portada">
    {#if prestamo.libro.portada}
      <img src={prestamo.libro.portada} alt="" loading="lazy" />
    {:else}
      <span>📚</span>
    {/if}
  </div>

  <div class="cuerpo">
    <div class="cabecera">
      <h3><a href={`/catalogo/${prestamo.libro.id}`}>{prestamo.libro.titulo}</a></h3>
      <EstadoBadge estado={prestamo.estado} />
    </div>

    <p class="autor">{prestamo.libro.autor}</p>

    <dl>
      <dt>Prestado</dt>
      <dd>{formatearFecha(prestamo.fechaPrestamo)}</dd>
      <dt>Devolver antes del</dt>
      <dd>{formatearFecha(prestamo.fechaPrevista)}</dd>
    </dl>

    <p class="detalle" class:alerta={prestamo.estado === 'atrasado'}>{detalle}</p>

    {#if prestamo.multa}
      <p class="multa" class:pagada={prestamo.multa.pagada}>
        Multa: {formatearMonto(prestamo.multa.monto)}
        ({prestamo.multa.diasAtraso} {prestamo.multa.diasAtraso === 1 ? 'día' : 'días'}) ·
        {prestamo.multa.pagada ? 'Pagada' : 'Pendiente de pago'}
      </p>
    {/if}
  </div>
</article>

<style>
  .prestamo {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-left: 4px solid transparent;
  }
  .prestamo.atrasado { border-left-color: var(--color-error); }

  .portada {
    flex: none;
    width: 64px;
    height: 96px;
    display: grid;
    place-items: center;
    background: #eef0f3;
    border-radius: 6px;
    overflow: hidden;
    font-size: 1.8rem;
  }
  .portada img { width: 100%; height: 100%; object-fit: cover; }

  .cuerpo { flex: 1; min-width: 0; }
  .cabecera {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }
  h3 { margin: 0; font-size: 1.05rem; line-height: 1.3; }
  h3 a { color: inherit; text-decoration: none; }
  h3 a:hover { text-decoration: underline; }
  .autor { margin: 0.2rem 0 0.6rem; color: #4b5563; font-size: 0.9rem; }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.2rem 0.8rem;
    margin: 0 0 0.6rem;
    font-size: 0.85rem;
  }
  dt { color: #6b7280; }
  dd { margin: 0; }

  .detalle { margin: 0; font-size: 0.9rem; }
  .detalle.alerta { color: var(--color-error); font-weight: 600; }

  .multa {
    margin: 0.6rem 0 0;
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    background: #fdecea;
    color: var(--color-error);
    font-size: 0.85rem;
    font-weight: 600;
  }
  .multa.pagada { background: #e8f6ee; color: var(--color-exito); }
</style>