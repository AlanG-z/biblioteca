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

<section class="auth">
  <h1>Crear cuenta</h1>

  <form onsubmit={enviar}>
    <label>
      Nombre
      <input type="text" bind:value={nombre} required autocomplete="name" />
    </label>

    <label>
      Email
      <input type="email" bind:value={email} required autocomplete="email" />
    </label>

    <label>
      Contraseña (mínimo 6 caracteres)
      <input type="password" bind:value={password} minlength="6" required autocomplete="new-password" />
    </label>

    {#if error}<p class="error" role="alert">{error}</p>{/if}
    {#if aviso}<p class="aviso">{aviso}</p>{/if}

    <button type="submit" disabled={enviando}>
      {enviando ? 'Creando...' : 'Crear cuenta'}
    </button>
  </form>

  <p>¿Ya tenés cuenta? <a href="/login">Ingresá</a></p>
</section>