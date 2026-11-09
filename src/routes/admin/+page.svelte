<section class="panel contenedor">
    <div class="cabecera">
        <h1 class="titulo-seccion">Administración</h1>
        <p class="subtitulo-seccion">Gestioná los libros del catálogo y su disponibilidad.</p>
    </div>

    <div class="accesos">
        <a class="card acceso" href="/admin/libros">
            <span class="icono">📚</span>
            <strong>Libros</strong>
            <small>Ver, editar y eliminar libros del catálogo</small>
            <span class="flecha">→</span>
        </a>

        <a class="card acceso" href="/admin/libros/nuevo">
            <span class="icono">➕</span>
            <strong>Agregar libro</strong>
            <small>Cargá un título nuevo con sus ejemplares</small>
            <span class="flecha">→</span>
        </a>
    </div>
</section>

<style>
    .panel {
        max-width: 900px;
        padding-top: 2.5rem;
    }

    .cabecera {
        margin-bottom: 1.5rem;
    }

    .cabecera p {
        margin-top: 0.35rem;
    }

    .accesos {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.25rem;
    }

    .acceso {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 1.5rem;
        color: inherit;
        text-decoration: none;
        position: relative;
        transition: transform var(--transicion), box-shadow var(--transicion), border-color var(--transicion);
    }

    .acceso:hover {
        transform: translateY(-4px);
        box-shadow: var(--sombra-lg);
        border-color: var(--color-primario-borde);
        color: inherit;
        text-decoration: none;
    }

    .icono {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        margin-bottom: 0.5rem;
        border-radius: var(--radio);
        background: var(--color-primario-suave);
        font-size: 1.5rem;
    }

    .acceso strong {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--color-titulos);
        letter-spacing: -0.01em;
    }

    .acceso small {
        color: var(--texto-suave);
        font-size: 0.875rem;
    }

    .flecha {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        color: var(--texto-tenue);
        font-size: 1.1rem;
        transition: transform var(--transicion), color var(--transicion);
    }

    .acceso:hover .flecha {
        transform: translateX(4px);
        color: var(--color-primario);
    }
</style>
