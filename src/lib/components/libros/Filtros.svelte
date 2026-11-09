<script>
  let {
    categorias = [],
    categoriaId = $bindable(''),
    soloDisponibles = $bindable(false)
  } = $props();
</script>

<div class="filtros">
  <select bind:value={categoriaId} aria-label="Filtrar por categoría">
    <option value="">Todas las categorías</option>
    {#each categorias as categoria (categoria.id)}
      <option value={categoria.id}>{categoria.nombre}</option>
    {/each}
  </select>

  <label class="check">
    <input type="checkbox" bind:checked={soloDisponibles} />
    <span>Solo disponibles</span>
  </label>
</div>

<style>
  .filtros {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  select {
    min-height: 44px;
    padding: 0.65rem 2rem 0.65rem 0.85rem;
    border: 1px solid var(--borde);
    border-radius: var(--radio-input); /* bordes sutiles: 6px (guía §4.3) */
    background: var(--superficie);
    color: var(--texto);
    font-size: 1rem;
    cursor: pointer;
    box-shadow: var(--sombra-xs);
    transition: border-color var(--transicion), box-shadow var(--transicion);
  }

  select:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 3px rgb(27 67 50 / 0.15);
  }

  .check {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--texto);
    cursor: pointer;
    user-select: none;
  }

  .check input {
    width: 1.05rem;
    height: 1.05rem;
    accent-color: var(--color-primario);
    cursor: pointer;
  }
</style>
