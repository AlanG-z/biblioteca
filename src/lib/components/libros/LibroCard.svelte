<script>
  let { libro, onVerDetalle = () => {}, onPrestar = () => {} } = $props();
  // libro: { id, titulo, autor, categoria, portada, disponible, ejemplares }
</script>

<article class="card">
  <div class="portada">
    {#if libro.portada}
      <img src={libro.portada} alt={`Portada de ${libro.titulo}`} loading="lazy" />
    {:else}
      <div class="sin-portada">📚</div>
    {/if}
    <span class="estado" class:disponible={libro.disponible}>
      {libro.disponible ? 'Disponible' : 'Prestado'}
    </span>
  </div>

  <div class="info">
    <span class="categoria">{libro.categoria}</span>
    <h3>{libro.titulo}</h3>
    <p class="autor">{libro.autor}</p>
    <p class="ejemplares">
      {libro.ejemplares} {libro.ejemplares === 1 ? 'disponible' : 'disponibles'}
    </p>
  </div>

  <div class="acciones">
    <button class="secundario" onclick={() => onVerDetalle(libro)}>
      Ver detalle
    </button>
    <button
      class="primario"
      disabled={!libro.disponible}
      onclick={() => onPrestar(libro)}
    >
      Pedir préstamo
    </button>
  </div>
</article>

<style>
  .card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .portada {
    position: relative;
    aspect-ratio: 2 / 3;
    background: #eef0f3;
  }
  .portada img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .sin-portada {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 3rem;
  }

  .estado {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    background: var(--color-error);
  }
  .estado.disponible {
    background: var(--color-exito);
  }

  .info {
    padding: 12px 14px 4px;
    flex: 1;
  }
  .categoria {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
  }
  h3 {
    margin: 4px 0;
    font-size: 1rem;
    line-height: 1.3;
  }
  .autor {
    margin: 0;
    color: #4b5563;
    font-size: 0.9rem;
  }
  .ejemplares {
    margin: 6px 0 0;
    font-size: 0.8rem;
    color: #6b7280;
  }

  .acciones {
    display: flex;
    gap: 8px;
    padding: 12px 14px 14px;
  }
  button {
    flex: 1;
    padding: 8px 10px;
    border-radius: 8px;
    border: none;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .primario {
    background: var(--color-primario);
    color: #fff;
  }
  .primario:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
  .secundario {
    background: #e5e7eb;
    color: #111827;
  }
</style>