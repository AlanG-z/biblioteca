<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { iniciarSesionStore } from '#lib/stores/sesion.svelte.js';
  import Navbar from '#lib/components/layout/Navbar.svelte';

  let { children } = $props();

  onMount(iniciarSesionStore);
</script>

<Navbar />
<main>
  {@render children()}
</main>