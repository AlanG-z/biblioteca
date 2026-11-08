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

<section class="pagina">
  <a href="/admin/libros" class="volver">← Volver a los libros</a>
  <h1>Editar libro</h1>

  {#if mensaje}
    <p class="mensaje {mensaje.tipo}" role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      {mensaje.texto}
    </p>
  {/if}

  <LibroForm {inicial} categorias={data.categorias} {prestados} textoBoton="Guardar cambios" onGuardar={guardar} />
</section>

<style>
  .pagina { max-width: 640px; margin: 0 auto; padding: 1rem; }
  .volver { display: inline-block; margin-bottom: 0.5rem; }
  .mensaje { padding: 0.7rem 1rem; border-radius: 8px; margin: 1rem 0; }
  .ok { background: #e8f6ee; color: var(--color-exito); }
  .error { background: #fdecea; color: var(--color-error); }
</style>