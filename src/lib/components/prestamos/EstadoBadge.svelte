<script>
  let { estado } = $props();

  const etiquetas = {
    activo: 'Activo',
    atrasado: 'Atrasado',
    devuelto: 'Devuelto'
  };
</script>

<span class="badge {estado}">{etiquetas[estado] ?? estado}</span>

<style>
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }
  .activo { background: var(--color-primario); }
  .atrasado { background: var(--color-error); }
  .devuelto { background: #6b7280; }
</style>