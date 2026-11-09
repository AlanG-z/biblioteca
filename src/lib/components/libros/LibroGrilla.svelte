<script>
  import LibroCard from './LibroCard.svelte';

  let {
    libros = [],
    cargando = false,
    onVerDetalle = () => {},
    onPrestar = () => {},
    onLimpiar = null // opcional: acción sugerida en el estado vacío
  } = $props();
</script>

{#if cargando && libros.length === 0}
  <p class="estado">
    <span class="spinner" aria-hidden="true"></span>
    Buscando libros...
  </p>
{:else if libros.length === 0}
  <div class="estado-vacio">
    <span class="vacio-icono" aria-hidden="true">📚</span>
    <p>No encontramos libros con esa búsqueda o esos filtros. Probá con otros términos.</p>
    {#if onLimpiar}
      <button class="btn btn-acento" type="button" onclick={onLimpiar}>
        Limpiar búsqueda y filtros
      </button>
    {/if}
  </div>
{:else}
  {#if cargando}
    <p class="actualizando" role="status">
      <span class="spinner" aria-hidden="true"></span>
      Actualizando resultados...
    </p>
  {/if}
  <div class="grilla" class:opacita={cargando}>
    {#each libros as libro (libro.id)}
      <LibroCard {libro} {onVerDetalle} {onPrestar} />
    {/each}
  </div>
{/if}

<style>
  .grilla {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 1.25rem;
    transition: opacity var(--transicion);
  }

  .opacita {
    opacity: 0.55;
  }

  /* indicador de carga para búsquedas en tiempo real (guía §5) */
  .actualizando {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    margin-bottom: 0.85rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-enlace);
  }

  .estado {
    color: var(--texto-suave);
  }

  .estado .spinner {
    margin-right: 0.4rem;
    vertical-align: -0.15em;
  }
</style>
