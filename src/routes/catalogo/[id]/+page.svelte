<script>
  import { goto, invalidateAll } from '$app/navigation';
  import { pedirPrestamo } from '#lib/api/prestamos.js';
  import { sesion } from '#lib/stores/sesion.svelte.js';

  let { data } = $props();
  let libro = $derived(data.libro);

  let mensaje = $state(null);
  let enviando = $state(false);

  async function prestar() {
    mensaje = null;

    if (!sesion.usuario) {
      goto('/login');
      return;
    }

    enviando = true;
    const { error: err } = await pedirPrestamo(libro.id);
    enviando = false;

    if (err) {
      mensaje = { tipo: 'error', texto: err };
    } else {
      mensaje = { tipo: 'ok', texto: 'Préstamo registrado. Lo ves en "Mis préstamos".' };
      await invalidateAll(); // vuelve a cargar el libro con el stock actualizado
    }
  }
</script>

<svelte:head>
  <title>{libro.titulo} · Biblioteca</title>
</svelte:head>

<section class="detalle contenedor">
  <a href="/catalogo" class="volver">← Volver al catálogo</a>

  <div class="contenido card">
    <div class="portada">
      {#if libro.portada}
        <img src={libro.portada} alt={`Portada de ${libro.titulo}`} />
      {:else}
        <div class="sin-portada">📚</div>
      {/if}
    </div>

    <div class="info">
      <span class="categoria">{libro.categoria}</span>
      <h1>{libro.titulo}</h1>
      <p class="autor">{libro.autor}</p>

      <dl>
        <dt>ISBN</dt>
        <dd>{libro.isbn ?? '—'}</dd>
        <dt>Ejemplares</dt>
        <dd>
          <strong>{libro.ejemplares}</strong> disponibles de {libro.ejemplaresTotal}
        </dd>
      </dl>

      {#if mensaje}
        <p class="mensaje {mensaje.tipo}" role="status">{mensaje.texto}</p>
      {/if}

      <button
        class="btn btn-primario btn-grande"
        onclick={prestar}
        disabled={!libro.disponible || enviando}
      >
        {#if enviando}
          <span class="spinner" aria-hidden="true"></span> Procesando...
        {:else if libro.disponible}
          Pedir préstamo
        {:else}
          No disponible
        {/if}
      </button>
    </div>
  </div>
</section>

<style>
  .detalle {
    padding-top: 2rem;
    max-width: 920px;
  }

  .volver {
    display: inline-block;
    margin-bottom: 1.25rem;
  }

  .contenido {
    display: grid;
    gap: 1.75rem;
    padding: 1.75rem;
    box-shadow: var(--sombra);
  }

  .portada {
    aspect-ratio: 2 / 3;
    max-width: 280px;
    margin-inline: auto;
    background: var(--superficie-2);
    border-radius: var(--radio);
    overflow: hidden;
    box-shadow: var(--sombra-lg);
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
    font-size: 4rem;
    opacity: 0.7;
  }

  .categoria {
    display: inline-block;
    padding: 0.25rem 0.7rem;
    border-radius: var(--radio-pill);
    background: var(--naranja-suave);
    border: 1px solid var(--naranja-borde);
    color: var(--texto-enfasis);
    font-family: var(--fuente);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  h1 {
    margin: 0.75rem 0 0.35rem;
    color: var(--color-titulos);
    font-weight: 700;
  }

  .autor {
    margin: 0 0 1.25rem;
    color: var(--texto-suave);
    font-size: 1rem;
    font-style: italic;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem 1.25rem;
    margin: 0 0 1.5rem;
    padding: 1rem 0;
    border-block: 1px solid var(--borde);
    font-size: 1rem;
  }

  dt {
    color: var(--texto-tenue);
    font-size: 0.875rem;
    font-weight: 500;
  }

  dd {
    margin: 0;
  }

  .mensaje {
    margin-bottom: 1rem;
  }

  .btn-grande {
    padding: 0.85rem 2rem;
  }

  @media (min-width: 720px) {
    .contenido {
      grid-template-columns: 280px 1fr;
      padding: 2rem;
    }

    .portada {
      margin-inline: 0;
    }
  }
</style>
