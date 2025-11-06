# 🍪 The Cookie Box – sitio de e‑commerce artesanal

Experiencia web para The Cookie Box (Santa Fe, Argentina) enfocada en mostrar el catálogo, tomar pedidos y facilitar el contacto por redes y WhatsApp. El sitio prioriza performance, estética y claridad del contenido en español de Argentina.

## ✨ Qué incluye
- Catálogo por categorías con filtros y buscador
- Carrito con animaciones (apertura/cierre, overlay, panel fijo de totales)
- Contacto directo: mensaje prearmado (portapapeles) + apertura de Instagram/WhatsApp
- Apartado para compras por mayoristas/panaderías con CTA específico
- Dashboard de administración con edición, alta/baja y previsualización
- Subida de imágenes con conversión automática a WebP (calidad alta, sin downscale)
- Efectos visuales (hero con “lluvia” de cookies, tipografías personalizadas, micro‑interacciones)

## 🧱 Stack y librerías
- **Frontend**: React 18 + Vite 5
- **Ruteo**: React Router v6
- **Estilos**: Tailwind CSS 3 (utilidades + clases personalizadas)
- **Estado de carrito y toasts**: Context API (`CartContext`) + contenedor de toasts propio
- **Animaciones**: transiciones CSS + Framer Motion para apariciones sutiles
- **Backend as a Service**: Firebase (Auth, Firestore, Storage)
- **Calidad**: ESLint (reglas para React + Hooks)

## 🧭 Arquitectura (alto nivel)
- `src/pages/*`: vistas principales (`Home`, `Products`, `AdminDashboard`, etc.)
- `src/components/*`: UI reusables (Navbar, Footer, Cart, ProductCard, etc.)
- `src/context/CartContext`: estado global del carrito (items, add/update/remove, toasts)
- `src/firebase/*`: configuración del SDK de Firebase
- `index.html`: base del documento; `main.jsx` monta la app

## 🛒 Carrito y flujo de contacto
- Los botones de acciones del carrito y cards usan `type="button"` y manejadores que previenen cualquier submit/navegación accidental (comportamiento robusto incluso dentro de contenedores inesperados).
- Envío por Instagram: no se pueden abrir DMs con texto prellenado por limitaciones de Instagram. Se implementó un flujo “copiar y abrir”: se copia un mensaje con el pedido y se abre el perfil `@thecookiebox.sf` para pegarlo manualmente. En el carrito se agrega un modal previo que guía al usuario.
- Envío por WhatsApp: se arma un `wa.me` con el texto preformateado (cuando corresponde).

## 🖼️ Imágenes y performance
- Conversión automática del archivo subido a **WebP** en el navegador (sin cambiar dimensiones). Calidad por defecto: **1.00** (máxima) para preservar el aspecto; el peso suele bajar respecto a JPG/PNG.
- Subida a Firebase Storage con `contentType: image/webp` para servir correctamente.
- Se contemplan efectos y fondos animados con cuidado por `prefers-reduced-motion`.

## 🧩 UX y lenguaje
- Todo el contenido está en **español de Argentina** (voseo, “Seguinos”, etc.)
- Se evitó un tono de marketing excesivo: mensajes concisos y claros sobre producto y proceso.
- Modal previo a Instagram que explica “copiamos el texto, abrí Instagram y pegalo”.

## 🔐 Seguridad y privacidad
- Dashboard protegido con Firebase Auth (rutas privadas).
- Operaciones CRUD a Firestore bajo credenciales del proyecto.
- Subidas a Storage con nombres únicos (`timestamp_nombre.webp`).

## ♿ Accesibilidad y responsividad
- Layouts fluidos, breakpoints para mobile/desktop.
- Contraste y tamaños de toque razonables en CTAs.
- Respeto por `prefers-reduced-motion` para animaciones.

## 🚀 Rendimiento
- Imágenes WebP, animaciones eficientes, CSS utilitario, Vite para builds rápidas.
- Carga progresiva de vistas y animaciones sutiles para mantener FPS estable.

## 🔭 Roadmap sugerido
- Selector de sucursal/entrega y costos dinámicos.
- Galería de producto con zoom y miniaturas.
- Métricas (Analytics) y eventos de conversión.
- Soporte multimoneda / multiregión (si aplica).
- Job de conversión server‑side como alternativa al cliente.

## 📜 Licencia
Proyecto privado para The Cookie Box. Todos los derechos reservados.
