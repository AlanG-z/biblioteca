<script>
  import { goto } from '$app/navigation';
  import { sesion } from '#lib/stores/sesion.svelte.js';
  import { salir } from '#lib/api/auth.js';

  async function cerrar() {
    await salir();
    goto('/login');
  }
</script>

<nav>
  <a href="/">Biblioteca</a>
  <a href="/catalogo">Catálogo</a>

  {#if sesion.usuario}
    <a href="/mis-prestamos">Mis préstamos</a>
    {#if sesion.perfil?.rol === 'admin'}
      <a href="/admin">Administración</a>
    {/if}
    <span>Hola, {sesion.perfil?.nombre ?? '...'}</span>
    <button onclick={cerrar}>Salir</button>
  {:else if !sesion.cargando}
    <a href="/login">Ingresar</a>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-borde);
  }
  span { margin-left: auto; }
</style>