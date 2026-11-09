<script>
  let { estado, porVencer = false } = $props();

  const etiquetas = {
    activo: 'Activo',
    atrasado: 'Atrasado',
    devuelto: 'Devuelto'
  };
</script>

{#if porVencer}
  <span class="badge advertencia">Por vencer</span>
{:else}
  <span class="badge {estado}">{etiquetas[estado] ?? estado}</span>
{/if}

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 3px 10px;
    border: 1px solid transparent;
    border-radius: var(--radio-pill);
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .badge::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.9;
  }

  .activo {
    background: var(--color-exito-suave);
    border-color: var(--color-exito-borde);
    color: var(--color-exito); /* préstamo activo: verde éxito */
  }

  .advertencia {
    background: var(--color-advertencia-suave);
    border-color: var(--color-advertencia-borde);
    color: #92400e; /* próximo a vencer: amarillo/naranja advertencia */
  }

  .atrasado {
    background: var(--color-error-suave);
    border-color: var(--color-error-borde);
    color: #b91c1c; /* retrasado: rojo alerta */
  }

  .devuelto {
    background: var(--color-exito-suave);
    border-color: var(--color-exito-borde);
    color: var(--color-exito); /* devolución completada a tiempo: verde */
  }

  .devuelto::before {
    content: '✓';
    width: auto;
    height: auto;
    background: none;
    font-size: 0.8em;
  }
</style>
