# The Cookie Box — Cookies artesanales en Santa Fe

Sitio web de The Cookie Box, emprendimiento de cookies artesanales en Santa Fe Capital. Construido con React + Vite y estilado con Tailwind CSS. Incluye catálogo de productos, carrito, autenticación para panel de administración y contenido optimizado para SEO básico.

## Tabla de contenidos
- [Tecnologías](#tecnologías)
- [Demo local](#demo-local)
- [Scripts disponibles](#scripts-disponibles)
- [Variables de entorno (Firebase)](#variables-de-entorno-firebase)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Guía de despliegue](#guía-de-despliegue)
- [Buenas prácticas y convenciones](#buenas-prácticas-y-convenciones)
- [Licencia](#licencia)

## Tecnologías
- React 18 + Vite 5
- React Router v6
- Tailwind CSS 3
- Firebase (Auth, Firestore, Storage)
- ESLint (React + Hooks)

## Demo local
Requisitos: Node.js 18+ y npm.

```bash
npm install
npm run dev
```

La app quedará disponible en `http://localhost:5173` (por defecto de Vite).

## Scripts disponibles
- `npm run dev`: Levanta el servidor de desarrollo con HMR.
- `npm run build`: Genera la build de producción en `dist/`.
- `npm run preview`: Sirve localmente la build de producción.
- `npm run lint`: Ejecuta ESLint sobre el proyecto.

## Variables de entorno (Firebase)
Crea un archivo `.env` en la raíz con tus credenciales de Firebase (o `.env.local` si preferís mantenerlo fuera del control de versiones):

```bash
VITE_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxxxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxxxxxxxxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxxxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
VITE_FIREBASE_APP_ID=1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx
```

Estas variables son consumidas en `src/firebase/config.js`.

## Estructura del proyecto
```text
the-cookie-box/
├─ public/
│  ├─ cookiebox.svg            # Favicon/icono del sitio
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ Navbar.jsx
│  │  └─ Footer.jsx            # Footer reutilizable
│  ├─ firebase/
│  │  └─ config.js             # Inicialización de Firebase
│  ├─ hooks/
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Products.jsx
│  │  ├─ AdminLogin.jsx
│  │  └─ AdminDashboard.jsx
│  ├─ services/
│  ├─ App.jsx                  # Rutas y layout
│  └─ main.jsx
├─ index.html                  # Metadatos, título y favicon
├─ tailwind.config.js          # Config Tailwind (fuentes Praise y Poppins)
├─ postcss.config.cjs
├─ package.json
└─ README.md
```

## Licencia
Este proyecto es de uso privado para The Cookie Box. Todos los derechos reservados.
