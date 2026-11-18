<script>
  import { goto } from '$app/navigation';
  import { registrar } from '#lib/api/auth.js';

  let nombre = $state('');
  let email = $state('');
  let password = $state('');
  let repetir = $state('');
  let error = $state('');
  let aviso = $state('');
  let enviando = $state(false);

  /** @type {Record<string, string>} */
  let errores = $state({});

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validar() {
    /** @type {Record<string, string>} */
    const e = {};

    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 2) e.nombre = 'Ingresá tu nombre (mínimo 2 caracteres)';
    else if (nombreLimpio.length > 60) e.nombre = 'El nombre no puede superar los 60 caracteres';

    if (!EMAIL_RE.test(email.trim())) e.email = 'Ingresá un email válido';

    if (password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres';
    else if (password.length > 72) e.password = 'La contraseña no puede superar los 72 caracteres';

    if (password !== repetir) e.repetir = 'Las contraseñas no coinciden';

    errores = e;
    return Object.keys(e).length === 0;
  }

  async function enviar(e) {
    e.preventDefault();
    error = '';
    aviso = '';
    if (!validar()) return;

    enviando = true;
    const { requiereConfirmacion, error: err } = await registrar(
      nombre.trim(),
      email.trim(),
      password
    );
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

  <form onsubmit={enviar} novalidate>
    <label class="campo">
      Nombre
      <input
        type="text"
        bind:value={nombre}
        maxlength="60"
        required
        autocomplete="name"
        placeholder="Tu nombre"
        aria-invalid={!!errores.nombre}
      />
      {#if errores.nombre}<span class="campo-error">{errores.nombre}</span>{/if}
    </label>

    <label class="campo">
      Email
      <input
        type="email"
        bind:value={email}
        maxlength="254"
        required
        autocomplete="email"
        placeholder="tu@email.com"
        aria-invalid={!!errores.email}
      />
      {#if errores.email}<span class="campo-error">{errores.email}</span>{/if}
    </label>

    <label class="campo">
      Contraseña (mínimo 6 caracteres)
      <input
        type="password"
        bind:value={password}
        minlength="6"
        maxlength="72"
        required
        autocomplete="new-password"
        placeholder="••••••••"
        aria-invalid={!!errores.password}
      />
      {#if errores.password}<span class="campo-error">{errores.password}</span>{/if}
    </label>

    <label class="campo">
      Repetir contraseña
      <input
        type="password"
        bind:value={repetir}
        maxlength="72"
        required
        autocomplete="new-password"
        placeholder="••••••••"
        aria-invalid={!!errores.repetir}
      />
      {#if errores.repetir}<span class="campo-error">{errores.repetir}</span>{/if}
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

  .campo-error {
    color: var(--color-error-texto);
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }

  .pie-form {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--texto-suave);
  }
</style>
