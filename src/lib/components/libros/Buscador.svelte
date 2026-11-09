<script>
  let { valor = $bindable('') } = $props();
</script>

<div class="buscador">
  <span class="lupa" aria-hidden="true">🔍</span>
  <input
    type="search"
    placeholder="Buscar por título o autor..."
    aria-label="Buscar libros"
    bind:value={valor}
  />
</div>

<style>
  .buscador {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .lupa {
    position: absolute;
    left: 0.8rem;
    font-size: 0.9rem;
    opacity: 0.6;
    pointer-events: none;
  }

  input {
    width: 100%;
    min-height: 44px;
    padding: 0.65rem 0.9rem 0.65rem 2.4rem;
    border: 1px solid var(--borde);
    border-radius: var(--radio-input); /* bordes redondeados sutiles: 6px (guía §4.3) */
    background: var(--superficie);
    color: var(--texto);
    font-size: 1rem;
    box-shadow: var(--sombra-xs);
    transition:
      border-color var(--transicion),
      box-shadow var(--transicion);
  }

  input:focus {
    outline: none;
    border-color: var(--color-primario); /* verde bosque al hacer foco */
    box-shadow: 0 0 0 3px rgb(27 67 50 / 0.15);
  }
</style>
