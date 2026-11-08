<section class="panel">
    <h1>Administración</h1>

    <div class="accesos">
        <a class="acceso" href="/admin/libros">
            <span class="icono">📚</span>
            <strong>Libros</strong>
            <small>Ver, editar y eliminar libros</small>
        </a>
    </div>
</section>

<style>
    .panel {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }
    .accesos {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    .acceso {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        padding: 1.2rem;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        color: inherit;
        text-decoration: none;
        transition: transform 0.2s;
    }
    .acceso:hover {
        transform: translateY(-3px);
    }
    .icono {
        font-size: 1.6rem;
    }
    small {
        color: #6b7280;
    }
</style>
