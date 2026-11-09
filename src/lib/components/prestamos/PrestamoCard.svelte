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

  // próximo a vencer: advertencia amarilla/naranja (guía §2)
  let porVencer = $derived(
    prestamo.estado === 'activo' && prestamo.diasRestantes > 0 && prestamo.diasRestantes <= 3
  );
</script>

<article
  class="card prestamo"
  class:atrasado={prestamo.estado === 'atrasado'}
  class:por-vencer={porVencer}
>
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
      <EstadoBadge estado={prestamo.estado} {porVencer} />
    </div>

    <p class="autor">{prestamo.libro.autor}</p>

    <dl>
      <dt>Prestado</dt>
      <dd>{formatearFecha(prestamo.fechaPrestamo)}</dd>
      <dt>Devolver antes del</dt>
      <dd>{formatearFecha(prestamo.fechaPrevista)}</dd>
    </dl>

    <p
      class="detalle"
      class:alerta={prestamo.estado === 'atrasado'}
      class:aviso={porVencer}
    >
      {#if porVencer}<span aria-hidden="true">⏳</span> {/if}{detalle}
    </p>

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
    padding: 1rem 1.1rem;
    border-left: 4px solid transparent;
    transition: box-shadow var(--transicion), transform var(--transicion);
  }

  .prestamo:hover {
    box-shadow: var(--sombra);
    transform: translateY(-2px);
  }

  .prestamo.atrasado {
    border-left-color: var(--color-error); /* retraso: rojo alerta */
  }

  .prestamo.por-vencer {
    border-left-color: var(--color-advertencia); /* próximo a vencer: advertencia */
  }

  .portada {
    flex: none;
    width: 64px;
    height: 96px;
    display: grid;
    place-items: center;
    background: var(--superficie-2);
    border-radius: var(--radio-sm);
    overflow: hidden;
    font-size: 1.8rem;
  }

  .portada img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cuerpo {
    flex: 1;
    min-width: 0;
  }

  .cabecera {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  h3 {
    margin: 0;
    font-family: var(--fuente); /* títulos de tarjeta en sans */
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  h3 a {
    color: var(--color-titulos); /* título del libro: azul institucional */
    text-decoration: none;
  }

  h3 a:hover {
    color: var(--color-enlace);
    text-decoration: none;
  }

  .autor {
    margin: 0.2rem 0 0.6rem;
    color: var(--texto-suave);
    font-size: 0.875rem;
    font-style: italic;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.2rem 0.8rem;
    margin: 0 0 0.6rem;
    font-size: 0.875rem;
  }

  dt {
    color: var(--texto-tenue);
  }

  dd {
    margin: 0;
  }

  .detalle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--texto-suave);
  }

  .detalle.alerta {
    color: var(--color-error);
    font-weight: 600;
  }

  .detalle.aviso {
    color: #92400e;
    font-weight: 600;
  }

  .multa {
    margin: 0.6rem 0 0;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-error-borde);
    border-radius: var(--radio-sm);
    background: var(--color-error-suave);
    color: var(--color-error);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .multa.pagada {
    background: var(--color-exito-suave);
    border-color: var(--color-exito-borde);
    color: var(--color-exito);
  }
</style>
