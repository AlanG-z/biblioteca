<script>
  let { libro, onVerDetalle = () => {}, onPrestar = () => {} } = $props();
  // libro: { id, titulo, autor, categoria, portada, disponible, ejemplares }
</script>

<article class="card tarjeta">
  <div class="portada">
    {#if libro.portada}
      <img src={libro.portada} alt={`Portada de ${libro.titulo}`} loading="lazy" />
    {:else}
      <div class="sin-portada">📚</div>
    {/if}
    <span class="disponibilidad" class:disponible={libro.disponible}>
      {libro.disponible ? 'Disponible' : 'Prestado'}
    </span>
  </div>

  <div class="info">
    <span class="categoria">{libro.categoria}</span>
    <h3>{libro.titulo}</h3>
    <p class="autor">{libro.autor}</p>
    <p class="ejemplares">
      {libro.ejemplares} {libro.ejemplares === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}
    </p>
  </div>

  <div class="acciones">
    <button class="btn btn-secundario btn-chico" onclick={() => onVerDetalle(libro)}>
      Ver detalle
    </button>
    <button
      class="btn btn-primario btn-chico"
      disabled={!libro.disponible}
      onclick={() => onPrestar(libro)}
    >
      Pedir préstamo
    </button>
  </div>
</article>

<style>
  .tarjeta {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition:
      transform var(--transicion),
      box-shadow var(--transicion),
      border-color var(--transicion);
  }

  .tarjeta:hover {
    transform: translateY(-4px);
    box-shadow: var(--sombra-lg);
    border-color: var(--color-primario-borde);
  }

  .portada {
    position: relative;
    aspect-ratio: 2 / 3;
    background: var(--superficie-2);
    overflow: hidden;
  }

  .portada img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  .tarjeta:hover .portada img {
    transform: scale(1.04);
  }

  .sin-portada {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 3rem;
    opacity: 0.7;
  }

  .disponibilidad {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 10px;
    border-radius: var(--radio-pill);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: #fff;
    background: var(--color-error); /* "Prestado": rojo alerta */
    box-shadow: var(--sombra-sm);
  }

  .disponibilidad.disponible {
    background: var(--color-exito); /* "Disponible": verde éxito */
  }

  .info {
    padding: 0.9rem 1rem 0.4rem;
    flex: 1;
  }

  .categoria {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--texto-enfasis);
  }

  h3 {
    margin: 0.35rem 0 0;
    font-family: var(--fuente); /* títulos de tarjeta en sans */
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-titulos);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .autor {
    margin: 0.2rem 0 0;
    color: var(--texto-suave);
    font-size: 0.875rem;
    font-style: italic; /* autor en itálica (guía §4.1) */
  }

  .ejemplares {
    margin: 0.55rem 0 0;
    font-size: 0.875rem;
    color: var(--texto-tenue);
  }

  .acciones {
    display: flex;
    gap: 0.5rem;
    padding: 0.85rem 1rem 1rem;
  }

  .acciones button {
    flex: 1;
  }
</style>
