<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getLibros, getCategorias } from '#lib/api/libros.js';
  import { sesion } from '#lib/stores/sesion.svelte.js';
  import LibroCard from '#lib/components/libros/LibroCard.svelte';

  let libros = $state(/** @type {any[]} */ ([]));
  let destacados = $state(/** @type {any[]} */ ([]));
  let totalCategorias = $state(0);
  let cargando = $state(true);

  const DIAS_PRESTAMO = 7;

  let totalLibros = $derived(libros.length);
  let totalDisponibles = $derived(libros.reduce((suma, l) => suma + l.ejemplares, 0));

  onMount(async () => {
    try {
      const [lista, categorias] = await Promise.all([getLibros(), getCategorias()]);
      libros = lista;
      destacados = lista.slice(0, 4);
      totalCategorias = categorias.length;
    } catch {
      // si la API falla, la sección de destacados simplemente no se muestra
    } finally {
      cargando = false;
    }
  });

  /** @param {any} libro */
  function verDetalle(libro) {
    goto(`/catalogo/${libro.id}`);
  }

  /** @param {any} libro */
  function pedir(libro) {
    goto(sesion.usuario ? `/catalogo/${libro.id}` : '/login');
  }

  
</script>

<svelte:head>
  <title>Biblioteca · Inicio</title>
</svelte:head>

<!-- ============================ Hero ============================ -->
<section class="hero">
  <div class="contenedor hero-interior">
    <div class="hero-texto">
      <span class="badge-demo">Sistema de préstamos · SvelteKit + Supabase</span>

      <h1>
        La biblioteca,<br />
        a un clic de distancia.
      </h1>

      <p class="bajada">
        Explorá el catálogo, solicitá préstamos y consultá tus devoluciones. Los administradores
        gestionan el stock, las multas y los vencimientos desde un panel dedicado.
      </p>

      <div class="cta">
        <a class="btn btn-primario btn-grande" href="/catalogo">Explorar catálogo</a>
        <a class="btn btn-secundario btn-grande" href={sesion.usuario ? '/mis-prestamos' : '/login'}>
          {sesion.usuario ? 'Mis préstamos' : 'Ingresar'}
        </a>
      </div>
    </div>

    <!-- ilustración: tarjetas de libros apiladas -->
    <div class="ilustracion" aria-hidden="true">
      <span class="carta carta-naranja"></span>
      <span class="carta carta-azul"></span>
      <span class="carta carta-verde">
        <span class="libro-icono">📚</span>
        <strong>Biblioteca</strong>
        <small>Préstamo de libros</small>
      </span>
    </div>
  </div>

  <!-- ============================ Stats ============================ -->
  <div class="contenedor">
    <dl class="stats">
      <div class="stat card">
        <dt>{cargando ? '—' : totalLibros}</dt>
        <dd>títulos en el catálogo</dd>
      </div>
      <div class="stat card">
        <dt>{cargando ? '—' : totalDisponibles}</dt>
        <dd>títulos disponibles</dd>
      </div>
      <div class="stat card">
        <dt>{cargando ? '—' : totalCategorias}</dt>
        <dd>categorías</dd>
      </div>
      <div class="stat card">
        <dt>{DIAS_PRESTAMO}</dt>
        <dd>días de préstamo</dd>
      </div>
    </dl>
  </div>
</section>

<!-- ============================ Destacados ============================ -->
{#if destacados.length > 0}
  <section class="seccion">
    <div class="contenedor">
      <div class="seccion-cabecera">
        <div>
          <span class="eyebrow">Catálogo</span>
          <h2 class="titulo-seccion">Libros destacados</h2>
        </div>
        <a class="ver-todos" href="/catalogo">Ver todos →</a>
      </div>

      <div class="grilla">
        {#each destacados as libro (libro.id)}
          <LibroCard {libro} onVerDetalle={verDetalle} onPrestar={pedir} />
        {/each}
      </div>
    </div>
  </section>
{/if}


<!-- ============================ CTA final ============================ -->
<section class="seccion">
  <div class="contenedor">
    <div class="cta-final">
      <div>
        <h2 class="titulo-seccion">¿Empezamos con una lectura?</h2>
        <p>Explorá el catálogo y pedí tu primer préstamo en segundos.</p>
      </div>
      <a class="btn btn-primario btn-grande" href="/catalogo">Ver catálogo completo</a>
    </div>
  </div>
</section>

<style>
  /* ---------------- hero ---------------- */
  .hero {
    padding: 4rem 0 3.5rem;
  }

  .hero-interior {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    gap: 3rem;
  }

  @media (min-width: 900px) {
    .hero-interior {
      grid-template-columns: 1.1fr 0.9fr;
    }
  }

  .badge-demo {
    display: inline-block;
    margin-bottom: 1.25rem;
    padding: 0.4rem 0.85rem;
    border-radius: var(--radio-pill);
    background: var(--color-advertencia-suave);
    border: 1px solid var(--color-advertencia-borde);
    color: #92400e;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .hero h1 {
    font-size: clamp(2.4rem, 5.5vw, 3.6rem);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--color-titulos);
  }

  .bajada {
    max-width: 54ch;
    margin-top: 1.25rem;
    color: var(--texto-suave);
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.75rem;
  }

  .btn-grande {
    padding: 0.75rem 1.6rem;
    font-size: 0.975rem;
  }

  /* ---------------- ilustración ---------------- */
  .ilustracion {
    position: relative;
    display: none;
    height: 330px;
  }

  @media (min-width: 900px) {
    .ilustracion {
      display: block;
    }
  }

  .carta {
    position: absolute;
    width: 220px;
    height: 290px;
    border-radius: 14px;
    box-shadow: var(--sombra-lg);
  }

  .carta-naranja {
    left: 0;
    top: 10px;
    background: linear-gradient(160deg, #d9600f, #b03a08);
    transform: rotate(-8deg);
  }

  .carta-azul {
    right: 0;
    top: 0;
    background: linear-gradient(160deg, #3b82f6, #1d4ed8);
    transform: rotate(7deg);
  }

  .carta-verde {
    left: 50%;
    top: 30px;
    transform: translateX(-52%) rotate(-1.5deg);
    background: linear-gradient(160deg, #1b4332, #143426);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid rgb(255 255 255 / 0.15);
  }

  .libro-icono {
    font-size: 2.6rem;
    line-height: 1;
  }

  .carta-verde strong {
    font-family: var(--fuente-titulos);
    font-size: 1.5rem;
    color: #fff;
  }

  .carta-verde small {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 0.7);
  }

  /* ---------------- stats ---------------- */
  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 3.25rem 0 0;
  }

  @media (min-width: 760px) {
    .stats {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .stat {
    margin: 0;
    padding: 1.25rem 1rem;
    text-align: center;
  }

  .stat dt {
    font-family: var(--fuente-titulos);
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
    color: var(--color-primario);
  }

  .stat dd {
    margin: 0.35rem 0 0;
    font-size: 0.8rem;
    color: var(--texto-tenue);
  }

  /* ---------------- secciones ---------------- */
  .seccion {
    padding: 3.5rem 0;
  }

  .seccion-cabecera {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }

  .ver-todos {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--color-primario);
  }

  .grilla {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
    gap: 1.25rem;
  }

  /* ---------------- roles (sección verde) ---------------- */
  .seccion-roles {
    background: var(--verde-seccion);
    padding: 4rem 0;
  }

  .eyebrow.claro {
    color: var(--verde-enlace);
  }

  .titulo-roles {
    font-size: clamp(1.75rem, 3.5vw, 2.4rem);
    color: #fff;
    margin-bottom: 2rem;
  }

  .roles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 760px) {
    .roles {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .rol {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.75rem;
    border: 1px solid var(--verde-seccion-borde);
    border-radius: var(--radio-lg);
    background: rgb(255 255 255 / 0.04);
  }

  .rol-icono {
    font-size: 1.6rem;
    line-height: 1;
  }

  .rol h3 {
    font-size: 1.35rem;
    color: #fff;
  }

  .rol p {
    color: rgb(255 255 255 / 0.75);
    font-size: 0.95rem;
    line-height: 1.65;
  }

  .rol ul {
    list-style: none;
    margin: 0.25rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .rol li {
    font-size: 0.9rem;
    color: rgb(255 255 255 / 0.85);
  }

  .rol li span {
    color: var(--verde-enlace);
    font-weight: 700;
    margin-right: 0.35rem;
  }

  .rol-enlace {
    margin-top: auto;
    padding-top: 0.75rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--verde-enlace);
    text-decoration: none;
  }

  .rol-enlace:hover {
    color: #fff;
    text-decoration: underline;
  }

  /* ---------------- cta final ---------------- */
  .cta-final {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 2.5rem;
    background: linear-gradient(135deg, #fef9c3, #fefce8);
    border: 1px solid #fde68a;
    border-radius: var(--radio-lg);
  }

  .cta-final h2 {
    color: var(--color-titulos);
  }

  .cta-final p {
    margin-top: 0.5rem;
    max-width: 46ch;
    color: var(--texto-suave);
  }
</style>
