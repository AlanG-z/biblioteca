<script>
  let { valor = $bindable('') } = $props();
</script>

<input
  type="search"
  placeholder="Buscar por título o autor..."
  aria-label="Buscar libros"
  bind:value={valor}
/>

<style>
  input {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--color-borde);
    border-radius: 8px;
    font-size: 1rem;
  }
</style>