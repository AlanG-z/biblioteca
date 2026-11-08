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

<section class="pagina">
  <div class="encabezado">
    <h1>Libros</h1>
    <a class="boton" href="/admin/libros/nuevo">➕ Agregar libro</a>
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
    <p class="estado">Cargando libros...</p>
  {:else if libros.length === 0}
    <p class="estado">No se encontraron libros.</p>
  {:else}
    <p class="conteo">{libros.length} {libros.length === 1 ? 'libro' : 'libros'}</p>

    <div class="tabla-contenedor" class:actualizando={cargando}>
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
              <td>{libro.categoria}</td>
              <td class="num">{libro.ejemplares} / {libro.ejemplaresTotal}</td>
              <td class="acciones">
                <a class="editar" href={`/admin/libros/${libro.id}/editar`}>Editar</a>
                <button class="eliminar" onclick={() => eliminar(libro)}>Eliminar</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<style>
  .pagina { max-width: 1000px; margin: 0 auto; padding: 1rem; }

  .encabezado {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .boton {
    padding: 0.6rem 1rem;
    border-radius: 8px;
    background: var(--color-primario);
    color: #fff;
    text-decoration: none;
  }

  .barra {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin: 1rem 0;
  }
  @media (min-width: 700px) {
    .barra { flex-direction: row; align-items: center; }
    .barra :global(input[type='search']) { min-width: 320px; }
  }

  .mensaje { padding: 0.7rem 1rem; border-radius: 8px; margin-bottom: 1rem; }
  .ok { background: #e8f6ee; color: var(--color-exito); }
  .error { background: #fdecea; color: var(--color-error); }
  .estado { text-align: center; padding: 2rem 0; color: #6b7280; }
  .estado.error { background: none; color: var(--color-error); }
  .conteo { margin: 0 0 0.5rem; font-size: 0.85rem; color: #6b7280; }

  .tabla-contenedor {
    overflow-x: auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: opacity 0.2s;
  }
  .actualizando { opacity: 0.5; }

  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  th, td { padding: 0.6rem 0.8rem; text-align: left; border-bottom: 1px solid var(--color-borde); }
  th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: #6b7280; }
  tbody tr:last-child td { border-bottom: none; }

  .miniatura { width: 48px; text-align: center; }
  .miniatura img { width: 36px; height: 54px; object-fit: cover; border-radius: 4px; }
  .titulo { font-weight: 600; }
  .num { white-space: nowrap; }

  .acciones { white-space: nowrap; }
  .editar {
    display: inline-block;
    padding: 0.35rem 0.7rem;
    border-radius: 6px;
    background: #e5e7eb;
    color: #111827;
    text-decoration: none;
    font-size: 0.85rem;
  }
  .eliminar {
    margin-left: 0.4rem;
    padding: 0.35rem 0.7rem;
    border: none;
    border-radius: 6px;
    background: var(--color-error);
    color: #fff;
    font-size: 0.85rem;
    cursor: pointer;
  }
</style>