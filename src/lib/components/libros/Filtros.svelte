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
    Solo disponibles
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
    padding: 0.6rem;
    border: 1px solid var(--color-borde);
    border-radius: 8px;
    font-size: 1rem;
  }
  .check {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.95rem;
  }
</style>