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

<section class="pagina">
  <a href="/admin/libros" class="volver">← Volver a los libros</a>
  <h1>Agregar libro</h1>

  {#if mensaje}
    <p class="mensaje {mensaje.tipo}" role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
      {mensaje.texto}
      {#if mensaje.id}<a href={`/catalogo/${mensaje.id}`}>Verlo en el catálogo</a>{/if}
    </p>
  {/if}

  {#key claveForm}
    <LibroForm
      inicial={{ categoriaId: categoriaPrevia }}
      {categorias}
      textoBoton="Agregar libro"
      onGuardar={guardar}
    />
  {/key}
</section>

<style>
  .pagina { max-width: 640px; margin: 0 auto; padding: 1rem; }
  .volver { display: inline-block; margin-bottom: 0.5rem; }
  .mensaje { padding: 0.7rem 1rem; border-radius: 8px; margin: 1rem 0; }
  .ok { background: #e8f6ee; color: var(--color-exito); }
  .error { background: #fdecea; color: var(--color-error); }
</style>