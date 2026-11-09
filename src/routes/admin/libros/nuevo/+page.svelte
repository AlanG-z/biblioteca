<script>
  import { onMount } from 'svelte';
  import { getCategorias, crearLibro } from '#lib/api/libros.js';
  import LibroForm from '#lib/components/libros/LibroForm.svelte';

  let categorias = $state([]);
  let mensaje = $state(null);        // { tipo, texto, id? }
  let categoriaPrevia = $state('');  // para cargar varios libros de la misma categoría
  let claveForm = $state(0);         // al cambiar, el formulario se vacía

  onMount(async () => {
    try {
      categorias = await getCategorias();
    } catch {
      // queda solo "Sin categoría"
    }
  });

  async function guardar(datos) {
    mensaje = null;
    const { libro, error } = await crearLibro(datos);

    if (error) {
      mensaje = { tipo: 'error', texto: error };
      return;
    }

    mensaje = { tipo: 'ok', texto: `Se agregó "${datos.titulo}".`, id: libro.id };
    categoriaPrevia = datos.categoriaId;
    claveForm++;
  }
</script>

<svelte:head>
  <title>Agregar libro · Admin · Biblioteca</title>
</svelte:head>

<section class="pagina">
  <a href="/admin/libros" class="volver">← Volver a los libros</a>

  <div class="cabecera">
    <h1 class="titulo-seccion">Agregar libro</h1>
    <p class="subtitulo-seccion">Cargá un título nuevo para el catálogo.</p>
  </div>

  {#if mensaje}
    <p class="mensaje {mensaje.tipo}" role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      {mensaje.texto}
      {#if mensaje.id}<a href={`/catalogo/${mensaje.id}`}>Verlo en el catálogo</a>{/if}
    </p>
  {/if}

  <div class="card formulario">
    {#key claveForm}
      <LibroForm
        inicial={{ categoriaId: categoriaPrevia }}
        {categorias}
        textoBoton="Agregar libro"
        onGuardar={guardar}
      />
    {/key}
  </div>
</section>

<style>
  .pagina {
    max-width: 680px;
    margin: 0 auto;
    padding-top: 2rem;
  }

  .volver {
    display: inline-block;
    margin-bottom: 1rem;
  }

  .cabecera {
    margin-bottom: 1.25rem;
  }

  .cabecera p {
    margin-top: 0.35rem;
  }

  .mensaje {
    margin-bottom: 1.25rem;
  }

  .mensaje a {
    margin-left: 0.5rem;
    font-weight: 600;
  }

  .formulario {
    padding: 1.75rem;
    box-shadow: var(--sombra);
  }
</style>