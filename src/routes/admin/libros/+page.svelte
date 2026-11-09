<script>
  import { onMount } from 'svelte';
  import { getLibros, getCategorias, eliminarLibro } from '#lib/api/libros.js';
  import Buscador from '#lib/components/libros/Buscador.svelte';
  import Filtros from '#lib/components/libros/Filtros.svelte';

  let busqueda = $state('');
  let categoriaId = $state('');
  let soloDisponibles = $state(false);
  let recarga = $state(0);

  let libros = $state([]);
  let categorias = $state([]);
  let cargando = $state(true);
  let error = $state('');
  let mensaje = $state(null);

  let peticion = 0;

  onMount(async () => {
    try {
      categorias = await getCategorias();
    } catch {
      // el filtro queda en "Todas"
    }
  });

  $effect(() => {
    const filtros = { busqueda, categoriaId: categoriaId || null, soloDisponibles, recarga };

    cargando = true;
    error = '';

    const temporizador = setTimeout(async () => {
      const miPeticion = ++peticion;
      try {
        const resultado = await getLibros(filtros);
        if (miPeticion === peticion) libros = resultado;
      } catch (e) {
        if (miPeticion === peticion) error = 'No se pudieron cargar los libros. ' + e.message;
      } finally {
        if (miPeticion === peticion) cargando = false;
      }
    }, 300);

    return () => clearTimeout(temporizador);
  });

  async function eliminar(libro) {
    mensaje = null;
    if (!confirm(`¿Eliminar "${libro.titulo}"? Esta acción no se puede deshacer.`)) return;

    const { error: err } = await eliminarLibro(libro.id);

    if (err) {
      mensaje = { tipo: 'error', texto: err };
    } else {
      mensaje = { tipo: 'ok', texto: `Se eliminó "${libro.titulo}".` };
      recarga++;
    }
  }
</script>

<svelte:head>
  <title>Libros · Admin · Biblioteca</title>
</svelte:head>

<section class="pagina contenedor">
  <div class="encabezado">
    <div>
      <h1 class="titulo-seccion">Libros</h1>
      <p class="subtitulo-seccion">Administrá los títulos del catálogo.</p>
    </div>
    <a class="btn btn-primario" href="/admin/libros/nuevo">➕ Agregar libro</a>
  </div>

  <div class="barra">
    <Buscador bind:valor={busqueda} />
    <Filtros {categorias} bind:categoriaId bind:soloDisponibles />
  </div>

  {#if mensaje}
    <p class="mensaje {mensaje.tipo}" role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      {mensaje.texto}
    </p>
  {/if}

  {#if error}
    <p class="estado error" role="alert">{error}</p>
  {:else if cargando && libros.length === 0}
    <p class="estado"><span class="spinner" aria-hidden="true"></span> Cargando libros...</p>
  {:else if libros.length === 0}
    <div class="estado-vacio">
      <span class="vacio-icono" aria-hidden="true">📚</span>
      <p>No se encontraron libros con esa búsqueda o esos filtros.</p>
      <a class="btn btn-acento" href="/admin/libros/nuevo">Agregar un libro</a>
    </div>
  {:else}
    <p class="conteo">{libros.length} {libros.length === 1 ? 'libro' : 'libros'}</p>

    <div class="tabla-contenedor card" class:actualizando={cargando}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Título</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>Disponibles / total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each libros as libro (libro.id)}
            <tr>
              <td class="miniatura">
                {#if libro.portada}
                  <img src={libro.portada} alt="" loading="lazy" />
                {:else}
                  📚
                {/if}
              </td>
              <td class="titulo">{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>
                <span class="chip">{libro.categoria}</span>
              </td>
              <td class="num">{libro.ejemplares} / {libro.ejemplaresTotal}</td>
              <td class="acciones">
                <a
                  class="btn btn-secundario btn-chico"
                  href={`/admin/libros/${libro.id}/editar`}
                  title={`Editar los datos de "${libro.titulo}"`}
                >
                  ✏️ Editar
                </a>
                <button
                  class="btn btn-peligro btn-chico"
                  title={`Eliminar "${libro.titulo}" del catálogo`}
                  onclick={() => eliminar(libro)}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<style>
  .pagina {
    max-width: 1040px;
    padding-top: 2.5rem;
  }

  .encabezado {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .encabezado p {
    margin-top: 0.35rem;
  }

  .barra {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1rem;
    margin-bottom: 1.25rem;
    background: var(--superficie);
    border: 1px solid var(--borde);
    border-radius: var(--radio); /* tarjetas: 8px (guía §4.1) */
    box-shadow: var(--sombra-sm);
  }

  @media (min-width: 760px) {
    .barra {
      flex-direction: row;
      align-items: center;
      padding: 0.85rem 1rem;
    }
  }

  .mensaje {
    margin-bottom: 1.25rem;
  }

  .estado .spinner {
    margin-right: 0.4rem;
    vertical-align: -0.15em;
  }

  .estado.error {
    background: none;
    color: var(--color-error);
  }

  .conteo {
    margin: 0 0 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--texto-tenue);
  }

  .tabla-contenedor {
    overflow-x: auto;
    transition: opacity var(--transicion);
  }

  .actualizando {
    opacity: 0.5;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem; /* texto base / tablas: 16px (guía §3) */
  }

  th,
  td {
    padding: 0.75rem 0.9rem;
    text-align: left;
    border-bottom: 1px solid var(--borde);
    vertical-align: middle;
  }

  /* Encabezado: azul institucional, texto blanco en negrita (guía §4.2) */
  thead th {
    background: var(--color-primario);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: none;
  }

  th:first-child {
    border-top-left-radius: var(--radio);
  }

  th:last-child {
    border-top-right-radius: var(--radio);
  }

  /* Filas alternadas (efecto cebra) blanco / gris muy claro (guía §4.2) */
  tbody tr:nth-child(even) {
    background: var(--superficie-2);
  }

  tbody tr {
    transition: background var(--transicion);
  }

  tbody tr:hover {
    background: var(--color-primario-suave);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .miniatura {
    width: 52px;
    text-align: center;
  }

  .miniatura img {
    width: 36px;
    height: 54px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: var(--sombra-xs);
  }

  .titulo {
    font-weight: 600;
    color: var(--color-titulos);
    max-width: 260px;
  }

  .chip {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radio-pill);
    background: var(--naranja-suave);
    color: var(--texto-enfasis);
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .num {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .acciones {
    white-space: nowrap;
    display: flex;
    gap: 0.4rem;
  }
</style>