<script>
  import { confirmacion, responderConfirmacion } from '#lib/stores/confirmacion.svelte.js';

  /** @type {HTMLButtonElement | null} */
  let botonCancelar = $state(null);
  /** @type {HTMLButtonElement | null} */
  let botonConfirmar = $state(null);

  // al abrir: guarda el foco anterior, enfoca el botón y bloquea el scroll de la página
  $effect(() => {
    if (!confirmacion.abierta) return;

    const focoAnterior =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (confirmacion.peligro ? botonCancelar : botonConfirmar)?.focus();

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflowAnterior;
      focoAnterior?.focus(); // devuelve el foco a donde estaba (como el confirm nativo)
    };
  });

  // Escape cancela (el nativo también se cierra con Escape)
  $effect(() => {
    if (!confirmacion.abierta) return;
    /** @param {KeyboardEvent} e */
    const alTeclear = (e) => {
      if (e.key === 'Escape') responderConfirmacion(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  });

  /**
   * El Tab no sale del diálogo: con dos botones, cicla de uno al otro.
   * @param {KeyboardEvent} e
   */
  function trampaTab(e) {
    if (e.key !== 'Tab') return;
    const primero = botonCancelar;
    const ultimo = botonConfirmar;
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo?.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero?.focus();
    }
  }
</script>

{#if confirmacion.abierta}
  <button
    type="button"
    class="fondo"
    aria-label="Cerrar diálogo"
    onclick={() => responderConfirmacion(false)}
  ></button>

  <div
    class="dialogo"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="confirmacion-titulo"
    aria-describedby="confirmacion-mensaje"
  >
    <span class="icono" class:peligro={confirmacion.peligro} aria-hidden="true">
      {confirmacion.icono}
    </span>
    <h2 id="confirmacion-titulo">{confirmacion.titulo}</h2>
    <p id="confirmacion-mensaje">{confirmacion.mensaje}</p>

    <div class="acciones">
      <button
        type="button"
        class="btn btn-secundario"
        bind:this={botonCancelar}
        onkeydown={trampaTab}
        onclick={() => responderConfirmacion(false)}
      >
        {confirmacion.textoCancelar}
      </button>
      <button
        type="button"
        class="btn {confirmacion.peligro ? 'btn-peligro' : 'btn-primario'}"
        bind:this={botonConfirmar}
        onkeydown={trampaTab}
        onclick={() => responderConfirmacion(true)}
      >
        {confirmacion.textoOk}
      </button>
    </div>
  </div>
{/if}

<style>
  .fondo {
    position: fixed;
    inset: 0;
    z-index: 1000; /* por encima del navbar (z-index: 50) */
    padding: 0;
    border: 0;
    background: rgb(15 23 42 / 0.55);
    backdrop-filter: blur(2px);
    cursor: default;
    animation: fondo-entra 0.15s ease-out;
  }

  .dialogo {
    position: fixed;
    inset: 0;
    z-index: 1001;
    margin: auto; /* centra la caja (que tiene height/width fit) */
    height: fit-content;
    width: min(440px, calc(100% - 2rem));
    padding: 1.6rem 1.5rem 1.5rem;
    background: var(--superficie);
    border-radius: var(--radio-lg);
    box-shadow: var(--sombra-lg);
    text-align: center;
    animation: dialogo-entra 0.2s cubic-bezier(0.34, 1.4, 0.64, 1);
  }

  .icono {
    display: inline-grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--color-primario-suave);
    color: var(--color-primario-texto);
    font-size: 1.35rem;
    line-height: 1;
  }

  .icono.peligro {
    background: var(--color-error-suave);
    color: var(--color-error-texto);
  }

  h2 {
    margin-top: 0.85rem;
    font-family: var(--fuente-titulos);
    font-size: 1.3rem;
    color: var(--color-titulos);
  }

  p {
    margin-top: 0.5rem;
    color: var(--texto-cuerpo);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .acciones {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 1.35rem;
  }

  .acciones .btn {
    width: 100%;
  }

  @media (min-width: 480px) {
    .acciones {
      flex-direction: row;
      justify-content: flex-end;
    }

    .acciones .btn {
      width: auto;
    }
  }

  @keyframes fondo-entra {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes dialogo-entra {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
</style>
