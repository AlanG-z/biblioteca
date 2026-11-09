<script>
  let {
    inicial = {},          // valores de partida: { titulo, autor, isbn, categoriaId, portada, ejemplares }
    categorias = [],
    prestados = 0,         // ejemplares prestados hoy (solo al editar)
    textoBoton = 'Guardar',
    onGuardar = async () => {}
  } = $props();

  // el formulario solo toma los valores iniciales una vez, a propósito
  // svelte-ignore state_referenced_locally
  let campos = $state({
    titulo: inicial.titulo ?? '',
    autor: inicial.autor ?? '',
    isbn: inicial.isbn ?? '',
    categoriaId: inicial.categoriaId ?? '',
    portada: inicial.portada ?? '',
    ejemplares: inicial.ejemplares ?? 1
  });

  let errores = $state({});
  let enviando = $state(false);
  let portadaFalla = $state(false);

  function validar() {
    const e = {};

    if (!campos.titulo.trim()) e.titulo = 'El título es obligatorio';
    if (!campos.autor.trim()) e.autor = 'El autor es obligatorio';

    const isbnLimpio = campos.isbn.replace(/[\s-]/g, '');
    if (isbnLimpio && !/^(\d{9}[\dXx]|\d{13})$/.test(isbnLimpio)) {
      e.isbn = 'El ISBN debe tener 10 o 13 dígitos';
    }

    if (!Number.isInteger(campos.ejemplares) || campos.ejemplares < 1) {
      e.ejemplares = 'Ingresá al menos 1 ejemplar';
    } else if (campos.ejemplares < prestados) {
      e.ejemplares = `No puede ser menor a los ejemplares prestados (${prestados})`;
    }

    if (campos.portada.trim()) {
      try {
        const url = new URL(campos.portada.trim());
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        e.portada = 'Ingresá una URL válida que empiece con http o https';
      }
    }

    errores = e;
    return Object.keys(e).length === 0;
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    enviando = true;
    try {
      await onGuardar({
        titulo: campos.titulo.trim(),
        autor: campos.autor.trim(),
        isbn: campos.isbn.replace(/[\s-]/g, ''),
        categoriaId: campos.categoriaId,
        portada: campos.portada.trim(),
        ejemplares: campos.ejemplares
      });
    } finally {
      enviando = false;
    }
  }
</script>

<form onsubmit={enviar} novalidate>
  <label class="campo">
    Título *
    <input type="text" bind:value={campos.titulo} aria-invalid={!!errores.titulo} />
    {#if errores.titulo}<span class="campo-error">{errores.titulo}</span>{/if}
  </label>

  <label class="campo">
    Autor *
    <input type="text" bind:value={campos.autor} aria-invalid={!!errores.autor} />
    {#if errores.autor}<span class="campo-error">{errores.autor}</span>{/if}
  </label>

  <div class="fila">
    <label class="campo">
      Categoría
      <select bind:value={campos.categoriaId}>
        <option value="">Sin categoría</option>
        {#each categorias as categoria (categoria.id)}
          <option value={categoria.id}>{categoria.nombre}</option>
        {/each}
      </select>
    </label>

    <label class="campo">
      Ejemplares *
      <input
        type="number"
        min={Math.max(1, prestados)}
        step="1"
        bind:value={campos.ejemplares}
        aria-invalid={!!errores.ejemplares}
      />
      {#if errores.ejemplares}<span class="campo-error">{errores.ejemplares}</span>{/if}
      {#if prestados > 0}<small class="ayuda">Hay {prestados} prestados ahora.</small>{/if}
    </label>
  </div>

  <label class="campo">
    ISBN (opcional)
    <input type="text" bind:value={campos.isbn} placeholder="978-0-307-47472-8" aria-invalid={!!errores.isbn} />
    {#if errores.isbn}<span class="campo-error">{errores.isbn}</span>{/if}
  </label>

  <label class="campo">
    URL de la portada (opcional)
    <input
      type="url"
      bind:value={campos.portada}
      oninput={() => (portadaFalla = false)}
      placeholder="https://..."
      aria-invalid={!!errores.portada}
    />
    {#if errores.portada}<span class="campo-error">{errores.portada}</span>{/if}
  </label>

  {#if campos.portada.trim() && !errores.portada && !portadaFalla}
    <img
      class="vista-previa"
      src={campos.portada}
      alt="Vista previa de la portada"
      onerror={() => (portadaFalla = true)}
    />
  {:else if portadaFalla}
    <p class="campo-error">No se pudo cargar la imagen de esa URL.</p>
  {/if}

  <button class="btn btn-primario btn-block" type="submit" disabled={enviando}>
    {#if enviando}<span class="spinner" aria-hidden="true"></span>{/if}
    {enviando ? 'Guardando...' : textoBoton}
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .campo {
    font-size: 0.875rem;
  }

  .fila {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 600px) {
    .fila {
      grid-template-columns: 2fr 1fr;
    }
  }

  .campo-error {
    color: var(--color-error);
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }

  .ayuda {
    color: var(--texto-tenue);
    font-size: 0.875rem;
  }

  .vista-previa {
    width: 120px;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: var(--radio);
    border: 1px solid var(--borde);
    box-shadow: var(--sombra);
  }
</style>
