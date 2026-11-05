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

<section class="auth">
  <h1>Ingresar</h1>

  <form onsubmit={enviar}>
    <label>
      Email
      <input type="email" bind:value={email} required autocomplete="email" />
    </label>

    <label>
      Contraseña
      <input type="password" bind:value={password} required autocomplete="current-password" />
    </label>

    {#if error}
      <p class="error" role="alert">{error}</p>
    {/if}

    <button type="submit" disabled={enviando}>
      {enviando ? 'Ingresando...' : 'Ingresar'}
    </button>
  </form>

  <p>¿No tenés cuenta? <a href="/registro">Registrate</a></p>
</section>