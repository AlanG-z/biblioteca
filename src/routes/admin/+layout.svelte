<script>
  import { goto } from '$app/navigation';
  import { sesion } from '#lib/stores/sesion.svelte.js';

  let { children } = $props();

  $effect(() => {
    if (sesion.cargando) return;
    if (sesion.perfil?.rol !== 'admin') goto('/login');
  });
</script>

{#if sesion.perfil?.rol === 'admin'}
  {@render children()}
{:else}
  <p>Verificando permisos...</p>
{/if}