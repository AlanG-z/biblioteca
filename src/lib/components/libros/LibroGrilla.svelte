<script>
  import LibroCard from './LibroCard.svelte';

  let { libros = [], cargando = false, onVerDetalle = () => {}, onPrestar = () => {} } = $props();
</script>

{#if cargando && libros.length === 0}
  <p class="estado">Cargando libros...</p>
{:else if libros.length === 0}
  <p class="estado">No se encontraron libros con esos filtros.</p>
{:else}
  <div class="grilla" class:actualizando={cargando}>
    {#each libros as libro (libro.id)}
      <LibroCard {libro} {onVerDetalle} {onPrestar} />
    {/each}
  </div>
{/if}

<style>
  .grilla {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    transition: opacity 0.2s;
  }
  .actualizando { opacity: 0.5; }
  .estado {
    text-align: center;
    padding: 2rem 0;
    color: #6b7280;
  }
</style>