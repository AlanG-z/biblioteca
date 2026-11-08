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

<section class="mis-prestamos">
  <h1>Mis préstamos</h1>

  {#if multasImpagas.length > 0}
    <p class="aviso" role="alert">
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
    <p class="estado">Cargando tus préstamos...</p>
  {:else if error}
    <p class="estado error" role="alert">{error}</p>
  {:else if prestamos.length === 0}
    <p class="estado">
      Todavía no pediste ningún libro. <a href="/catalogo">Ir al catálogo</a>
    </p>
  {:else if visibles.length === 0}
    <p class="estado">No tenés préstamos en esta categoría.</p>
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
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  .aviso {
    padding: 0.8rem 1rem;
    border-radius: 8px;
    background: #fdecea;
    color: var(--color-error);
    font-weight: 600;
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .tabs button {
    padding: 0.4rem 0.9rem;
    border: 1px solid var(--color-borde);
    border-radius: 999px;
    background: #fff;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .tabs button.activa {
    background: var(--color-primario);
    border-color: var(--color-primario);
    color: #fff;
  }
  .lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .estado {
    text-align: center;
    padding: 2rem 0;
    color: #6b7280;
  }
  .estado.error { color: var(--color-error); }
  .nota {
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: #6b7280;
  }
</style>