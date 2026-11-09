<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { sesion } from '#lib/stores/sesion.svelte.js';
  import { salir } from '#lib/api/auth.js';

  let abierto = $state(false);

  const rutas = $derived([
    { href: '/', texto: 'Inicio' },
    { href: '/catalogo', texto: 'Catálogo' },
    ...(sesion.usuario ? [{ href: '/mis-prestamos', texto: 'Mis préstamos' }] : []),
    ...(sesion.perfil?.rol === 'admin' ? [{ href: '/admin', texto: 'Administración' }] : [])
  ]);

  /** @param {string} href */
  function activa(href) {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  async function cerrar() {
    abierto = false;
    await salir();
    goto('/login');
  }
</script>

<header class="navbar">
  <nav class="barra contenedor" aria-label="Principal">
    <a class="logo" href="/">
      <span class="logo-caja" aria-hidden="true">B</span>
      <span class="logo-textos">
        <strong>Biblioteca</strong>
        <small>Préstamo de libros</small>
      </span>
    </a>

    <button
      class="hamburguesa"
      type="button"
      aria-label="Abrir menú"
      aria-expanded={abierto}
      onclick={() => (abierto = !abierto)}
    >
      <span></span><span></span><span></span>
    </button>

    <div class="menu" class:abierto>
      <div class="enlaces">
        {#each rutas as r (r.href)}
          <a href={r.href} class:activa={activa(r.href)} onclick={() => (abierto = false)}>
            {r.texto}
          </a>
        {/each}
      </div>

      <div class="sesion">
        {#if sesion.usuario}
          <span class="usuario">
            <span class="avatar">{(sesion.perfil?.nombre ?? '?').charAt(0).toUpperCase()}</span>
            {sesion.perfil?.nombre ?? '...'}
          </span>
          <button class="btn btn-secundario btn-chico" type="button" onclick={cerrar}>Salir</button>
        {:else if !sesion.cargando}
          <a class="btn btn-fantasma btn-chico" href="/login" onclick={() => (abierto = false)}>
            Ingresar
          </a>
          <a class="btn btn-primario btn-chico" href="/registro" onclick={() => (abierto = false)}>
            Crear cuenta
          </a>
        {/if}
      </div>
    </div>
  </nav>
</header>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--superficie);
    border-bottom: 1px solid var(--borde);
  }

  .barra {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    min-height: 64px;
    padding-block: 0.5rem;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    color: var(--texto);
    text-decoration: none;
  }

  .logo:hover {
    color: var(--texto);
    text-decoration: none;
  }

  .logo-caja {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radio-sm);
    background: var(--color-primario);
    color: #fff;
    font-family: var(--fuente-titulos);
    font-size: 1.2rem;
    font-weight: 700;
  }

  .logo-textos {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }

  .logo-textos strong {
    font-family: var(--fuente-titulos);
    font-size: 1.1rem;
    font-weight: 700;
  }

  .logo-textos small {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--texto-tenue);
  }

  .hamburguesa {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 44px;
    height: 44px;
    margin-left: auto;
    padding: 10px;
    border: 1px solid var(--borde);
    border-radius: var(--radio-input);
    background: var(--superficie);
    cursor: pointer;
  }

  .hamburguesa span {
    display: block;
    height: 2px;
    width: 100%;
    border-radius: 2px;
    background: var(--texto);
    transition:
      transform var(--transicion),
      opacity var(--transicion);
  }

  .menu {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 1.25rem;
  }

  .enlaces {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-left: auto;
  }

  .enlaces a {
    padding: 0.45rem 0.85rem;
    border-radius: var(--radio-pill);
    color: var(--texto-cuerpo);
    font-size: 0.9375rem;
    font-weight: 500;
    text-decoration: none;
    transition: background var(--transicion), color var(--transicion);
  }

  .enlaces a:hover {
    background: var(--superficie-2);
    color: var(--texto);
    text-decoration: none;
  }

  .enlaces a.activa {
    background: var(--color-primario-suave); /* píldora verde suave */
    color: var(--color-primario);
    font-weight: 600;
  }

  .sesion {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding-left: 1.25rem;
    border-left: 1px solid var(--borde);
  }

  .usuario {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--texto-cuerpo);
  }

  .avatar {
    display: grid;
    place-items: center;
    width: 1.875rem;
    height: 1.875rem;
    border-radius: 50%;
    background: var(--color-primario);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
  }

  @media (max-width: 860px) {
    .hamburguesa {
      display: flex;
    }

    .menu {
      display: none;
      flex-basis: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
      padding-top: 0.75rem;
      margin-top: 0.25rem;
      border-top: 1px solid var(--borde);
    }

    .menu.abierto {
      display: flex;
    }

    .enlaces {
      flex-direction: column;
      align-items: stretch;
      gap: 0.15rem;
      margin-left: 0;
    }

    .enlaces a {
      padding: 0.65rem 0.75rem;
      min-height: 44px;
      display: flex;
      align-items: center;
      border-radius: var(--radio-sm);
    }

    .sesion {
      margin-left: 0;
      padding-left: 0;
      border-left: none;
      flex-wrap: wrap;
    }
  }
</style>
