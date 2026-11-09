# 📚 Biblioteca · Frontend

Aplicación web para la gestión de una biblioteca: catálogo de libros, préstamos para lectores y panel de administración.

Desarrollada con **SvelteKit 5** (runes) y **Supabase** (autenticación, base de datos y funciones RPC), con **CSS moderno propio**: design system global con variables, estilos *serif* tipo libro e interfaz responsive.

---

## ✨ Características

### Visitantes / lectores
- **Inicio** con hero e ilustración, estadísticas, libros destacados, sección de roles (cliente / admin) y CTA.
- **Catálogo** con búsqueda por título o autor (con *debounce*), filtro por categoría y filtro de sólo disponibles.
- **Detalle del libro** con ISBN, stock disponible y pedido de préstamo.
- **Registro e ingreso** (Supabase Auth, con confirmación de email si está activada).
- **Mis préstamos**: filtros por estado (activos / atrasados / devueltos), días restantes de devolución y aviso de multas impagas.

### Administradores (`/admin`)
- Panel de accesos rápidos.
- **ABM de libros**: alta con vista previa de portada, edición con validación (título, autor, ISBN de 10/13 dígitos, URL de portada, ejemplares ≥ prestados) y baja con confirmación.
- Tabla con búsqueda, filtros, stock disponible/total y estados de carga.

### Transversal
- Navbar *sticky* clara con logo, menú móvil y píldora verde en la sección activa.
- Títulos *serif* (`Source Serif 4`) sobre fondo crema e interfaz en **Inter**.
- Footer oscuro de 3 columnas con enlaces según el rol.
- Accesibilidad: `aria-label`, `role`, `aria-invalid`, foco visible y `prefers-reduced-motion`.
- UI corregida para desplazarse sin JS: `ssr = false` (SPA client-side).

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | [SvelteKit 3](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev/docs/svelte/overview) (runes: `$state`, `$derived`, `$effect`, `$props`) |
| Lenguaje | JavaScript con JSDoc y type-checking estricto (`svelte-check`) |
| Backend | [Supabase](https://supabase.com): Auth, Postgres con RLS y funciones RPC |
| Estilos | CSS puro con design system global (`src/app.css`) |
| Bundler | Vite 8 |

---

## 🚀 Puesta en marcha

**Requisitos:** Node.js 18+ y un proyecto Supabase configurado.

### 1. Instalar dependencias

```sh
npm install
```

### 2. Configurar variables de entorno

Creá un archivo `.env` en la raíz:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

> Ambas claves son **públicas** (van prefijadas con `PUBLIC_` porque se usan en el navegador). La seguridad la aportan las políticas **RLS** configuradas en Supabase.

### 3. Levantar el servidor de desarrollo

```sh
npm run dev
# o para abrir el navegador automáticamente
npm run dev -- --open
```

La app queda en `http://localhost:5173`.

### 4. Build de producción

```sh
npm run build
npm run preview
```

> `@sveltejs/adapter-auto` detecta el entorno de despliegue (Vercel, Netlify, Cloudflare…). Para otro destino, instalá el adapter correspondiente.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run check` | Type-check con `svelte-check` |
| `npm run check:watch` | `check` en modo *watch* |

---

## 📁 Estructura del proyecto

```
src/
├── app.css                  # Design system global (tokens, botones, formularios, tipografía)
├── app.html                 # HTML base: fuentes, meta, theme-color
├── env.js                   # Definición de variables de entorno
├── lib/
│   ├── supabase.js          # Cliente de Supabase
│   ├── api/
│   │   ├── auth.js          # ingresar / registrar / salir (errores traducidos al español)
│   │   ├── libros.js        # CRUD de libros y categorías (RPC actualizar_libro)
│   │   └── prestamos.js     # pedir_prestamo (RPC) y consulta de préstamos
│   ├── stores/
│   │   └── sesion.svelte.js # Estado global de sesión (usuario, perfil, cargando)
│   ├── utils/
│   │   ├── fechas.js        # fechas ISO y diferencia en días
│   │   └── formato.js       # formato de fechas y montos (multas)
│   └── components/
│       ├── layout/Navbar.svelte
│       ├── libros/          # Buscador, Filtros, LibroCard, LibroGrilla, LibroForm
│       └── prestamos/       # PrestamoCard, EstadoBadge
└── routes/
    ├── +layout.svelte       # Navbar + main + footer
    ├── +page.svelte         # Inicio (hero, cómo funciona, destacados, CTA)
    ├── login/  registro/    # Autenticación
    ├── catalogo/  [id]/     # Catálogo y detalle del libro
    ├── mis-prestamos/       # Préstamos del usuario
    └── admin/
        ├── +layout.svelte   # Guardia de rol administrador
        ├── +page.svelte     # Panel de administración
        └── libros/          # Listado (ABM), nuevo/, [id]/editar/
```

---

## 🗄️ Modelo de datos esperado (Supabase)

**Tablas**

| Tabla | Columnas relevantes |
|-------|---------------------|
| `perfiles` | `id` (FK auth), `nombre`, `rol` (`admin` / `cliente`) — se crea con un *trigger* al registrarse |
| `categorias` | `id`, `nombre` |
| `libros` | `id`, `titulo`, `autor`, `isbn` (único), `portada`, `categoria_id`, `ejemplares_total`, `ejemplares_disponibles` |
| `prestamos` | `id`, `usuario_id`, `libro_id`, `fecha_prestamo`, `fecha_devolucion_prevista`, `fecha_devolucion_real`, `estado` |
| `multas` | `id`, `prestamo_id`, `dias_atraso`, `monto`, `pagada` (relación 1-1 con `prestamos`) |

**Funciones RPC**

- `pedir_prestamo(p_libro_id)` — valida multas impagas, descuenta stock y crea el préstamo.
- `actualizar_libro(...)` — edita el libro recalculando el stock.
- `marcar_atrasados()` — marca los préstamos vencidos (puede ejecutarse con un *cron*).

Toda la escritura está protegida con **RLS**: sólo los administradores pueden modificar libros y registrar devoluciones; cada usuario ve sus propios préstamos.

---

## 🎨 Diseño

Identidad visual tipo **biblioteca digital**: verde bosque + naranja, títulos *serif* tipo libro
y fondo crema, inspirada en la maqueta de referencia del proyecto.

### Paleta

| Uso | Color |
|-----|-------|
| Verde bosque — botones, logo, enlaces, cabeceras de tabla | `#1B4332` |
| Verde sección — fondo de la sección "Un sistema para cada rol" | `#1B5E37` |
| Verde suave — píldoras de navegación activa, chips, checkmarks | `#DCFCE7` / `#A7F3D0` |
| Naranja — eyebrows (`CATÁLOGO`, `DOS EXPERIENCIAS`) y categorías | `#C2410C` |
| Fondo crema con degradado verde superior | `#FAFAF7` → `#F0FDF4` |
| Verde éxito — disponible / préstamo activo | `#15803D` |
| Ámbar advertencia — próximo a vencer / badge del hero | `#F59E0B` |
| Rojo alerta — prestado / atrasado / multa | `#DC2626` |
| Footer oscuro | `#1E293B` |

### Tipografía

- **Títulos**: `Source Serif 4` (serif, respaldo Georgia) — hero, secciones, footer y logo.
- **Interfaz y cuerpo**: `Inter`.
- Escala: `H1 2rem/700`, `H2 1.5rem/700`, base `1rem`, metadatos `0.875rem`;
  el hero usa `clamp(2.4rem, 5.5vw, 3.6rem)`.

### Componentes

- **Navbar clara**: caja verde con la "B", dos líneas de marca (*Biblioteca* /
  PRÉSTAMO DE LIBROS), píldora verde suave en la sección activa y botón *Crear cuenta*.
- **Hero**: badge ámbar, título serif a dos líneas, doble CTA y **ilustración de tarjetas
  apiladas** (naranja / azul / verde) construida en CSS.
- **Stats**: tarjetas blancas con número *serif* verde y etiqueta gris.
- **Tarjetas de libro**: fondo blanco, borde claro, radio `8px`, badge *Disponible* /
  *Prestado*, categoría en naranja, título en negrita y botones *Ver detalle* + *Pedir préstamo*.
- **Sección de roles**: fondo verde a todo el ancho con dos tarjetas translúcidas,
  checklist con ✓ y enlace final en verde claro.
- **CTA final**: tarjeta crema/amarilla con título serif y botón verde.
- **Footer**: fondo pizarra oscuro en 3 columnas (marca, Explorar, Administración) con
  línea de copyright.

### Patrones de interacción

- Búsqueda en tiempo real con *debounce* e indicador de carga ("Actualizando resultados…").
- **Estados vacíos** con ilustración, texto descriptivo y acción sugerida.
- Tablas con cabecera verde, filas cebra y acciones con icono + tooltip.
- Formularios con inputs de `44px`, radio `6px`, foco verde y errores en rojo bajo el campo.

Todos los valores viven como tokens en `src/app.css` (`:root`): cambiar un color allí
actualiza toda la app.
