<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getLibros, getCategorias } from '#lib/api/libros.js';
  import { pedirPrestamo } from '#lib/api/prestamos.js';
  import { sesion } from '#lib/stores/sesion.svelte.js';
  import Buscador from '#lib/components/libros/Buscador.svelte';
  import Filtros from '#lib/components/libros/Filtros.svelte';
  import LibroGrilla from '#lib/components/libros/LibroGrilla.svelte';

  let busqueda = $state('');
  let categoriaId = $state('');
  let soloDisponibles = $state(false);
  let recarga = $state(0); // se incrementa para volver a consultar

  let libros = $state([]);
  let categorias = $state([]);
  let cargando = $state(true);
  let error = $state('');
  let mensaje = $state(null); // { tipo: 'ok' | 'error', texto }

  let peticion = 0; // evita que una respuesta lenta pise a una más nueva

  onMount(async () => {
    try {
      categorias = await getCategorias();
    } catch {
      // si falla, el filtro simplemente queda con "Todas"
    }
  });

  // Se ejecuta al cambiar la búsqueda, los filtros o "recarga"
  $effect(() => {
    const filtros = {
      busqueda,
      categoriaId: categoriaId || null,
      soloDisponibles,
      recarga
    };

    cargando = true;
    error = '';

    // esperamos 300 ms sin escribir antes de consultar (debounce)
    const temporizador = setTimeout(async () => {
      const miPeticion = ++peticion;
      try {
        const resultado = await getLibros(filtros);
        if (miPeticion === peticion) libros = resultado;
      } catch (e) {
        if (miPeticion === peticion) error = 'No se pudo cargar el catálogo. ' + e.message;
      } finally {
        if (miPeticion === peticion) cargando = false;
      }
    }, 300);

    return () => clearTimeout(temporizador);
  });

  async function prestar(libro) {
    mensaje = null;

    if (!sesion.usuario) {
      goto('/login');
      return;
    }
    if (!confirm(`¿Solicitar en préstamo "${libro.titulo}"?`)) return;

    const { error: err } = await pedirPrestamo(libro.id);

    if (err) {
      mensaje = { tipo: 'error', texto: err };
    } else {
      mensaje = { tipo: 'ok', texto: `Solicitaste "${libro.titulo}". Lo vas a ver en "Mis préstamos".` };
      recarga++; // actualiza los ejemplares disponibles
    }
  }

  function limpiar() {
    busqueda = '';
    categoriaId = '';
    soloDisponibles = false;
  }
</script>

<svelte:head>
  <title>Catálogo · Biblioteca</title>
</svelte:head>

<section class="catalogo contenedor">
  <div class="cabecera">
    <h1 class="titulo-seccion">Catálogo</h1>
    <p class="subtitulo-seccion">Buscá, filtrá y pedí en préstamo los libros que quieras leer.</p>
  </div>

  <div class="barra card">
    <Buscador bind:valor={busqueda} />
    <Filtros {categorias} bind:categoriaId bind:soloDisponibles />
  </div>

  {#if mensaje}
    <p class="mensaje {mensaje.tipo}" role="status">{mensaje.texto}</p>
  {/if}

  {#if error}
    <p class="mensaje error" role="alert">{error}</p>
  {:else}
    <LibroGrilla
      {libros}
      {cargando}
      onVerDetalle={(libro) => goto(`/catalogo/${libro.id}`)}
      onPrestar={prestar}
      onLimpiar={limpiar}
    />
  {/if}
</section>

<style>
  .catalogo {
    padding-top: 2.5rem;
  }

  .cabecera {
    margin-bottom: 1.5rem;
  }

  .cabecera p {
    margin-top: 0.35rem;
  }

  .barra {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--sombra-sm);
  }

  .mensaje {
    margin-bottom: 1.25rem;
  }

  @media (min-width: 760px) {
    .barra {
      flex-direction: row;
      align-items: center;
      padding: 0.85rem 1rem;
    }
  }
</style>
