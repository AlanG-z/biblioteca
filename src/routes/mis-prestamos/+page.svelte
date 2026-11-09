<script>
  import { goto } from '$app/navigation';
  import { sesion } from '#lib/stores/sesion.svelte.js';
  import { getMisPrestamos } from '#lib/api/prestamos.js';
  import { formatearMonto } from '#lib/utils/formato.js';
  import PrestamoCard from '#lib/components/prestamos/PrestamoCard.svelte';

  let prestamos = $state([]);
  let cargando = $state(true);
  let error = $state('');
  let filtro = $state('todos');

  // $derived solo cambia si cambia el valor, así no recarga cuando Supabase renueva el token
  let usuarioId = $derived(sesion.usuario?.id ?? null);

  const filtros = [
    { valor: 'todos', etiqueta: 'Todos' },
    { valor: 'activo', etiqueta: 'Activos' },
    { valor: 'atrasado', etiqueta: 'Atrasados' },
    { valor: 'devuelto', etiqueta: 'Devueltos' }
  ];

  let visibles = $derived(
    filtro === 'todos' ? prestamos : prestamos.filter((p) => p.estado === filtro)
  );
  let multasImpagas = $derived(prestamos.filter((p) => p.multa && !p.multa.pagada));
  let totalImpago = $derived(multasImpagas.reduce((suma, p) => suma + p.multa.monto, 0));

  async function cargar(id) {
    cargando = true;
    error = '';
    try {
      prestamos = await getMisPrestamos(id);
    } catch (e) {
      error = 'No se pudieron cargar tus préstamos. ' + e.message;
    } finally {
      cargando = false;
    }
  }

  $effect(() => {
    if (sesion.cargando) return;   // todavía no sabemos si hay sesión
    if (!usuarioId) {
      goto('/login');
      return;
    }
    cargar(usuarioId);
  });
</script>

<svelte:head>
  <title>Mis préstamos · Biblioteca</title>
</svelte:head>

<section class="mis-prestamos contenedor">
  <div class="cabecera">
    <h1 class="titulo-seccion">Mis préstamos</h1>
    <p class="subtitulo-seccion">Seguí el estado de los libros que tenés y los que ya devolviste.</p>
  </div>

  {#if multasImpagas.length > 0}
    <p class="mensaje error aviso-multas" role="alert">
      Tenés {multasImpagas.length} {multasImpagas.length === 1 ? 'multa impaga' : 'multas impagas'}
      por {formatearMonto(totalImpago)}. Mientras no la pagues no vas a poder pedir nuevos libros.
    </p>
  {/if}

  <div class="tabs" role="tablist" aria-label="Filtrar préstamos">
    {#each filtros as f (f.valor)}
      <button
        role="tab"
        aria-selected={filtro === f.valor}
        class:activa={filtro === f.valor}
        onclick={() => (filtro = f.valor)}
      >
        {f.etiqueta}
      </button>
    {/each}
  </div>

  {#if cargando}
    <p class="estado"><span class="spinner" aria-hidden="true"></span> Cargando tus préstamos...</p>
  {:else if error}
    <p class="estado error" role="alert">{error}</p>
  {:else if prestamos.length === 0}
    <div class="estado-vacio">
      <span class="vacio-icono" aria-hidden="true">📖</span>
      <p>Todavía no tenés libros prestados. ¡Explorá el catálogo!</p>
      <a class="btn btn-acento" href="/catalogo">Explorar catálogo</a>
    </div>
  {:else if visibles.length === 0}
    <div class="estado-vacio">
      <span class="vacio-icono" aria-hidden="true">🗂️</span>
      <p>No tenés préstamos en esta categoría.</p>
    </div>
  {:else}
    <div class="lista">
      {#each visibles as prestamo (prestamo.id)}
        <PrestamoCard {prestamo} />
      {/each}
    </div>
  {/if}

  <p class="nota">Para devolver un libro, acercalo a la biblioteca: la devolución la registra el administrador.</p>
</section>

<style>
  .mis-prestamos {
    max-width: 860px;
    padding-top: 2.5rem;
  }

  .cabecera {
    margin-bottom: 1.5rem;
  }

  .cabecera p {
    margin-top: 0.35rem;
  }

  .aviso-multas {
    margin-bottom: 1.25rem;
    font-weight: 600;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
    padding: 0.3rem;
    width: fit-content;
    background: var(--superficie-2);
    border: 1px solid var(--borde);
    border-radius: var(--radio-pill);
  }

  .tabs button {
    min-height: 36px;
    padding: 0.4rem 1rem;
    border: none;
    border-radius: var(--radio-pill);
    background: transparent;
    color: var(--texto-suave);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--transicion), color var(--transicion), box-shadow var(--transicion);
  }

  .tabs button:hover {
    color: var(--texto);
  }

  .tabs button.activa {
    background: var(--color-primario); /* píldora verde */
    color: #fff;
    box-shadow: var(--sombra-sm);
  }

  .lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .estado .spinner {
    margin-right: 0.4rem;
    vertical-align: -0.15em;
  }

  .nota {
    margin-top: 2rem;
    padding: 0.85rem 1rem;
    border-radius: var(--radio);
    background: var(--superficie-2);
    font-size: 0.875rem;
    color: var(--texto-suave);
  }
</style>
