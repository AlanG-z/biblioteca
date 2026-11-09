<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { iniciarSesionStore, sesion } from '#lib/stores/sesion.svelte.js';
  import Navbar from '#lib/components/layout/Navbar.svelte';

  let { children } = $props();

  onMount(iniciarSesionStore);

  const anio = new Date().getFullYear();
</script>

<Navbar />

<main>
  {@render children()}
</main>

<footer class="pie">
  <div class="contenedor">
    <div class="pie-grid">
      <div class="pie-marca">
        <h2>Biblioteca</h2>
        <p>
          Sistema de préstamos de libros construido con SvelteKit y Supabase. Buscá, pedí en
          préstamo y seguí tus lecturas en línea.
        </p>
      </div>

      <div class="pie-col">
        <h3>Explorar</h3>
        <ul>
          <li><a href="/catalogo">Catálogo</a></li>
          <li><a href="/mis-prestamos">Mis préstamos</a></li>
          <li><a href="/login">Ingresar</a></li>
        </ul>
      </div>

      {#if sesion.perfil?.rol === 'admin'}
        <div class="pie-col">
          <h3>Administración</h3>
          <ul>
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="/admin/libros">Libros</a></li>
            <li><a href="/admin/libros/nuevo">Agregar libro</a></li>
          </ul>
        </div>
      {/if}
    </div>

    <div class="pie-base">
      © {anio} Biblioteca · Sistema de préstamos con SvelteKit y Supabase.
    </div>
  </div>
</footer>

<style>
  .pie {
    background: var(--pie-fondo);
    color: var(--pie-texto);
    padding: 3rem 0 0;
    margin-top: 2rem;
  }

  .pie-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-bottom: 2.5rem;
  }

  @media (min-width: 720px) {
    .pie-grid {
      grid-template-columns: 2fr 1fr 1fr;
      gap: 3rem;
    }
  }

  .pie-marca h2 {
    margin-bottom: 0.6rem;
    font-size: 1.35rem;
    color: #fff;
  }

  .pie-marca p {
    max-width: 38ch;
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--pie-texto);
  }

  .pie-col h3 {
    margin-bottom: 0.9rem;
    font-family: var(--fuente);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #fff;
  }

  .pie-col ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .pie-col a {
    font-size: 0.9rem;
    color: var(--pie-enlace);
    text-decoration: none;
  }

  .pie-col a:hover {
    color: #fff;
    text-decoration: underline;
  }

  .pie-base {
    padding: 1.25rem 0;
    border-top: 1px solid rgb(255 255 255 / 0.12);
    font-size: 0.8rem;
    color: var(--pie-texto);
  }
</style>
