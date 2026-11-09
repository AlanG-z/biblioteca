<script>
  import { goto } from '$app/navigation';
  import { registrar } from '#lib/api/auth.js';

  let nombre = $state('');
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let aviso = $state('');
  let enviando = $state(false);

  async function enviar(e) {
    e.preventDefault();
    error = '';
    aviso = '';
    enviando = true;

    const { requiereConfirmacion, error: err } = await registrar(nombre, email, password);
    enviando = false;

    if (err) {
      error = err;
    } else if (requiereConfirmacion) {
      aviso = 'Te enviamos un correo para confirmar tu cuenta.';
    } else {
      goto('/catalogo'); // ya quedó con la sesión iniciada
    }
  }
</script>

<section class="auth card">
  <div class="cabecera">
    <span class="icono" aria-hidden="true">✨</span>
    <h1>Crear cuenta</h1>
    <p>Registrate y empezá a pedir libros en préstamo.</p>
  </div>

  <form onsubmit={enviar}>
    <label class="campo">
      Nombre
      <input type="text" bind:value={nombre} required autocomplete="name" placeholder="Tu nombre" />
    </label>

    <label class="campo">
      Email
      <input type="email" bind:value={email} required autocomplete="email" placeholder="tu@email.com" />
    </label>

    <label class="campo">
      Contraseña (mínimo 6 caracteres)
      <input
        type="password"
        bind:value={password}
        minlength="6"
        required
        autocomplete="new-password"
        placeholder="••••••••"
      />
    </label>

    {#if error}<p class="mensaje error" role="alert">{error}</p>{/if}
    {#if aviso}<p class="mensaje ok" role="status">{aviso}</p>{/if}

    <button class="btn btn-primario btn-block" type="submit" disabled={enviando}>
      {#if enviando}<span class="spinner" aria-hidden="true"></span>{/if}
      {enviando ? 'Creando...' : 'Crear cuenta'}
    </button>
  </form>

  <p class="pie-form">¿Ya tenés cuenta? <a href="/login">Ingresá</a></p>
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
