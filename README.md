## ECHH Servicios Eléctricos

Sitio web estático para **ECHH Servicios Eléctricos – Eric Chocano**, técnico eléctrico SEC Clase B en Chile.

### Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla)
- Leaflet (mapa de cobertura)
- PWA básica (manifest + service worker)

### Estructura principal

- `index.html` – Página principal, secciones de servicios, galería, testimonios, contacto.
- `styles.css` – Estilos generales, diseño responsivo y animaciones.
- `script.js` – Lógica de UI (carruseles, modales, formulario → WhatsApp, mapa Leaflet, PWA).
- `manifest.json` y `sw.js` – Configuración PWA (ícono, nombre de la app, cache básico).
- `assets/` – Imágenes (logo, héroe, servicios, galería y favicon).

### Despliegue

El sitio está pensado para alojarse como **sitio estático** (por ejemplo en HostGator):

- Subir el contenido de la carpeta del proyecto a la raíz del dominio (por ejemplo `public_html/`).
- Asegurarse de incluir `index.html`, `styles.css`, `script.js`, `manifest.json`, `sw.js`, `sitemap.xml`, `robots.txt` y la carpeta `assets/`.

### Optimizaciones de rendimiento

- **CSS crítico inline** – Nav y hero en el HTML para evitar FOUC y acortar la cadena de dependencias.
- **CSS minificado** – `styles.css` reducido (~29 KiB).
- **Preload LCP** – Logo y hero priorizados con `fetchpriority="high"`.
- **Fuentes async** – Google Fonts sin bloquear el render.
- **Caché largo** – Imágenes, CSS y JS con `max-age=1 year, immutable`.
- **Accesibilidad** – Objetivos táctiles ≥48px, contraste WCAG en botones WhatsApp.

### Desarrollo local

Puedes abrir directamente `index.html` en el navegador, o servirlo con un servidor estático simple (por ejemplo `npx serve .`) para probar mejor el service worker.

