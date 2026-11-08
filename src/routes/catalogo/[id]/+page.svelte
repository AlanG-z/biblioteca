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

<section class="detalle">
  <a href="/catalogo" class="volver">← Volver al catálogo</a>

  <div class="contenido">
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
        <dd>{libro.ejemplares} disponibles de {libro.ejemplaresTotal}</dd>
      </dl>

      {#if mensaje}
        <p class="mensaje {mensaje.tipo}" role="status">{mensaje.texto}</p>
      {/if}

      <button onclick={prestar} disabled={!libro.disponible || enviando}>
        {#if enviando}
          Procesando...
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
  .detalle { max-width: 900px; margin: 0 auto; padding: 1rem; }
  .volver { display: inline-block; margin-bottom: 1rem; }
  .contenido { display: grid; gap: 1.5rem; }
  .portada { aspect-ratio: 2 / 3; max-width: 260px; background: #eef0f3; border-radius: 12px; overflow: hidden; }
  .portada img { width: 100%; height: 100%; object-fit: cover; }
  .sin-portada { display: grid; place-items: center; height: 100%; font-size: 4rem; }
  .categoria { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
  h1 { margin: 0.3rem 0; }
  .autor { margin: 0 0 1rem; color: #4b5563; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 0.4rem 1rem; margin-bottom: 1.2rem; }
  dt { font-weight: 600; }
  dd { margin: 0; }
  .mensaje { padding: 0.7rem 1rem; border-radius: 8px; }
  .ok { background: #e8f6ee; color: var(--color-exito); }
  .error { background: #fdecea; color: var(--color-error); }
  button {
    padding: 0.7rem 1.4rem;
    border: none;
    border-radius: 8px;
    background: var(--color-primario);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
  }
  button:disabled { background: #cbd5e1; cursor: not-allowed; }

  @media (min-width: 700px) {
    .contenido { grid-template-columns: 260px 1fr; }
  }
</style>