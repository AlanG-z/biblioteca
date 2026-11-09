<script>
  import { invalidateAll } from '$app/navigation';
  import { actualizarLibro } from '#lib/api/libros.js';
  import LibroForm from '#lib/components/libros/LibroForm.svelte';

  let { data } = $props();
  let libro = $derived(data.libro);

  let mensaje = $state(null);

  let inicial = $derived({
    titulo: libro.titulo,
    autor: libro.autor,
    isbn: libro.isbn,
    categoriaId: libro.categoriaId,
    portada: libro.portada,
    ejemplares: libro.ejemplaresTotal
  });
  let prestados = $derived(libro.ejemplaresTotal - libro.ejemplares);

  async function guardar(datos) {
    mensaje = null;
    const { error } = await actualizarLibro(libro.id, datos);

    if (error) {
      mensaje = { tipo: 'error', texto: error };
      return;
    }

    mensaje = { tipo: 'ok', texto: 'Cambios guardados.' };
    await invalidateAll(); // recarga el libro con el stock recalculado
  }
</script>

<svelte:head>
  <title>Editar libro · Admin · Biblioteca</title>
</svelte:head>

<section class="pagina">
  <a href="/admin/libros" class="volver">← Volver a los libros</a>

  <div class="cabecera">
    <h1 class="titulo-seccion">Editar libro</h1>
    <p class="subtitulo-seccion">{libro.titulo}</p>
  </div>

  {#if mensaje}
    <p class="mensaje {mensaje.tipo}" role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      {mensaje.texto}
    </p>
  {/if}

  <div class="card formulario">
    <LibroForm {inicial} categorias={data.categorias} {prestados} textoBoton="Guardar cambios" onGuardar={guardar} />
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
    color: var(--texto-suave);
  }

  .mensaje {
    margin-bottom: 1.25rem;
  }

  .formulario {
    padding: 1.75rem;
    box-shadow: var(--sombra);
  }
</style>