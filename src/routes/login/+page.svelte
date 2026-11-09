<script>
  import { goto } from '$app/navigation';
  import { ingresar } from '#lib/api/auth.js';
  import { sesion, cargarPerfil } from '#lib/stores/sesion.svelte.js';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let enviando = $state(false);

  async function enviar(e) {
    e.preventDefault();
    error = '';
    enviando = true;

    const { usuario, error: err } = await ingresar(email, password);

    if (err) {
      error = err;
      enviando = false;
      return;
    }

    // esperamos el perfil para saber el rol antes de redirigir
    await cargarPerfil(usuario.id);
    enviando = false;
    goto(sesion.perfil?.rol === 'admin' ? '/admin' : '/catalogo');
  }
</script>

<section class="auth card">
  <div class="cabecera">
    <span class="icono" aria-hidden="true">🔐</span>
    <h1>Ingresar</h1>
    <p>Accedé para pedir libros en préstamo.</p>
  </div>

  <form onsubmit={enviar}>
    <label class="campo">
      Email
      <input type="email" bind:value={email} required autocomplete="email" placeholder="tu@email.com" />
    </label>

    <label class="campo">
      Contraseña
      <input
        type="password"
        bind:value={password}
        required
        autocomplete="current-password"
        placeholder="••••••••"
      />
    </label>

    {#if error}
      <p class="mensaje error" role="alert">{error}</p>
    {/if}

    <button class="btn btn-primario btn-block" type="submit" disabled={enviando}>
      {#if enviando}<span class="spinner" aria-hidden="true"></span>{/if}
      {enviando ? 'Ingresando...' : 'Ingresar'}
    </button>
  </form>

  <p class="pie-form">¿No tenés cuenta? <a href="/registro">Registrate</a></p>
</section>

<style>
  .auth {
    max-width: 420px;
    margin: 3.5rem auto;
    padding: 2.25rem;
    box-shadow: var(--sombra-lg);
  }

  .cabecera {
    text-align: center;
    margin-bottom: 1.75rem;
  }

  .icono {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    margin: 0 auto 0.75rem;
    border-radius: var(--radio);
    background: var(--color-primario-suave);
    font-size: 1.4rem;
  }

  h1 {
    font-size: 2rem; /* H1: 2rem bold (guía §3) */
    font-weight: 700;
    color: var(--color-titulos);
  }

  .cabecera p {
    margin-top: 0.3rem;
    color: var(--texto-suave);
    font-size: 0.875rem; /* textos pequeños: 14px */
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pie-form {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--texto-suave);
  }
</style>
