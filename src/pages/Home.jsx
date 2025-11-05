import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-5 z-0"></div>
        {/* Decorative cookie background using images from public/cookies */}
        <div className="cookie-bg remove-bg" aria-hidden="true">
          {(() => {
            // Lista de archivos en public/cookies (generada desde el folder del proyecto)
            const cookieFileNames = [
              "BLOCK.jpg",
              "CHOCO NUTELLA.jpg",
              "COCO CON DULCE .jpg",
              "COOKIE MANTECOL.jpg",
              "DUBAI.jpg",
              "DULCE DE LECHE .jpg",
              "FRANUÍ .jpg",
              "FRUTOS ROJOS.jpg",
              "KÍNDER.jpg",
              "MANTECOL.jpg",
              "MILKA OREO.jpg",
              "NUTELLA.jpg",
              "OREO .jpg",
              "ROCKLETS .jpg",
            ];

            const assetPath = (name) => `/cookies/${encodeURIComponent(name)}`;

            // Renderizamos N piezas que caerán; cada una elige imagen, tamaño y timings aleatoriamente
            return Array.from({ length: 22 }).map((_, i) => {
              const img = assetPath(cookieFileNames[Math.floor(Math.random() * cookieFileNames.length)]);
              const left = `${Math.random() * 100}%`;
              const size = 24 + Math.floor(Math.random() * 36); // entre 24px y 60px
              const duration = (5 + Math.random() * 7).toFixed(2) + 's'; // entre 5s y 12s
              const delay = (Math.random() * -8).toFixed(2) + 's'; // delays negativos para distribuir

              return (
                <img
                  key={i}
                  src={img}
                  alt="cookie"
                  className="cookie-piece remove-bg"
                  style={{
                    left,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDuration: duration,
                    animationDelay: delay,
                    opacity: 0.95,
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              );
            });
          })()}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in" style={{ zIndex: 10 }}>
          <h1 className="font-praise text-6xl md:text-8xl lg:text-9xl text-black mb-6 text-shadow">
            The Cookie Box
          </h1>
          <p className="font-poppins text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Las mejores cookies artesanales de Santa Fe 🍪✨
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-4"
            >
              Ver Nuestras Cookies
            </Link>
            <a 
              href="https://www.instagram.com/thecookiebox.sf/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4"
            >
              Seguinos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
<section className="py-20 lg:py-28 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="fade-in">
        <h2 className="font-praise text-5xl lg:text-6xl text-black mb-8">Quiénes Somos</h2>
        <div className="space-y-6">
          <p className="font-poppins text-gray-700 text-lg leading-relaxed">
            En <span className="font-semibold text-black">The Cookie Box</span> hacemos cookies artesanales en Santa Fe Capital. 
            Cada cookie se elabora con ingredientes de calidad y dedicación, para disfrutar en cada bocado.
          </p>
          <p className="font-poppins text-gray-700 text-lg leading-relaxed">
            Nuestra especialidad son las <span className="font-semibold text-black">Crumble Cookies</span>, y siempre estamos probando 
            nuevos sabores y texturas.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                  <path d="M12 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                </svg>
              </div>
              <span className="font-poppins font-semibold text-black">Santa Fe Capital</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3.75 6.75h16.5A1.75 1.75 0 0122 8.5v7a1.75 1.75 0 01-1.75 1.75H3.75A1.75 1.75 0 012 15.5v-7A1.75 1.75 0 013.75 6.75z" />
                  <path d="M3 8l9 6 9-6" />
                </svg>
              </div>
              <span className="font-poppins font-semibold text-black">Pedidos con anticipación</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Montón compacto de cookies - sin espacios */}
      <div className="relative h-80 lg:h-96 top-10 flex items-center justify-center fade-in">
        {/* Fondo sólido para cubrir espacios */}
        
        
        {/* Base del montón - cookies grandes abajo */}
        <div className="relative z-20 flex items-end justify-center">
          {/* Cookie trasera izquierda */}
          <div className="relative -mr-8 -mb-4 transform rotate-6 hover:scale-105 transition-transform duration-300">
            <img 
              src="/cookies/DULCE DE LECHE .jpg"
              alt="Cookie Dulce de Leche"
              className="w-40 h-40 lg:w-44 lg:h-44 object-cover rounded-full shadow-lg remove-bg"
            />
          </div>
          
          {/* Cookie central base */}
          <div className="relative z-10 transform -rotate-3 hover:scale-105 transition-transform duration-300">
            <img 
              src="/cookies/NUTELLA.jpg"
              alt="Cookie Nutella"
              className="w-44 h-44 lg:w-48 lg:h-48 object-cover rounded-full shadow-lg remove-bg"
            />
          </div>
          
          {/* Cookie trasera derecha */}
          <div className="relative -ml-8 -mb-4 transform -rotate-8 hover:scale-105 transition-transform duration-300">
            <img 
              src="/cookies/OREO .jpg"
              alt="Cookie Oreo"
              className="w-40 h-40 lg:w-44 lg:h-44 object-cover rounded-full shadow-lg remove-bg"
            />
          </div>
        </div>
        
        {/* Segunda capa - cookies medianas */}
        <div className="absolute z-30 top-8 flex items-center justify-center space-x-4">
          {/* Cookie izquierda segunda capa */}
          <div className="relative transform rotate-12 hover:scale-105 transition-transform duration-300">
            <img 
              src="/cookies/FRUTOS ROJOS.jpg"
              alt="Cookie Frutos Rojos"
              className="w-36 h-36 lg:w-40 lg:h-40 object-cover rounded-full shadow-lg remove-bg"
            />
          </div>
          
          {/* Cookie derecha segunda capa */}
          <div className="relative transform -rotate-10 hover:scale-105 transition-transform duration-300">
            <img 
              src="/cookies/KÍNDER.jpg"
              alt="Cookie Kinder"
              className="w-36 h-36 lg:w-40 lg:h-40 object-cover rounded-full shadow-lg remove-bg"
            />
          </div>
        </div>
        
        {/* Tercera capa - cookie superior */}
        <div className="absolute z-40 top-4 transform rotate-5 hover:scale-110 transition-transform duration-300">
          <img 
            src="/cookies/MILKA OREO.jpg"
            alt="Cookie Milka Oreo"
            className="w-32 h-32 lg:w-36 lg:h-36 object-cover rounded-full shadow-lg remove-bg"
          />
        </div>
        
        {/* Sombra del conjunto */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-72 h-6 bg-black/10 rounded-full blur-md -z-10"></div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-praise text-5xl lg:text-6xl text-black text-center mb-16">¿Por Qué Elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-black text-xl mb-4">Ingredientes de calidad</h3>
              <p className="font-poppins text-gray-600 leading-relaxed">
                Utilizamos solo los mejores ingredientes importados y locales para garantizar 
                el sabor y calidad excepcional en cada bocado.
              </p>
            </div>
            
            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-black text-xl mb-4">Recién hechas</h3>
              <p className="font-poppins text-gray-600 leading-relaxed">
                Horneamos el mismo día de la entrega para mantener la frescura y el toque recién horneado.
              </p>
            </div>
            
            <div className="text-center fade-in">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-black text-xl mb-4">Hecho con Amor</h3>
              <p className="font-poppins text-gray-600 leading-relaxed">
                Cada cookie es elaborada artesanalmente con dedicación, pasión y mucho cariño. 
                Puedes sentir la diferencia en cada mordisco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale / Bulk Purchase Section (refined) */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-gray-900 text-white p-10 md:p-14 shadow-xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" aria-hidden="true"></div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <h2 className="font-praise text-5xl lg:text-6xl mb-4">¿Compras por Cantidad?</h2>
                <p className="font-poppins text-gray-200 text-lg md:text-xl mb-8">
                  Si sos una panadería, cafetería o querés comprar por mayor, escribinos y
                  te armamos una propuesta a medida con precios mayoristas.
                </p>
                <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
                  <a
                    href={`https://instagram.com/thecookiebox.sf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Contactar por Instagram
                  </a>
                  <a
                    href={`mailto:thecookiebox.sf@gmail.com?subject=${encodeURIComponent('Consulta compras por mayor - The Cookie Box')}&body=${encodeURIComponent('Hola, me gustaría recibir info de compras por mayor (cantidades, precios y tiempos). ¡Gracias!')}`}
                    className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    Escribir por Email
                  </a>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                {/* Ciclo de imágenes (muestra cada imagen del folder con transición) */}
                <ImageRotator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-praise text-5xl lg:text-6xl mb-6">¿Listo para probarlas?</h2>
          <p className="font-poppins text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Conocé nuestras cookies en Santa Fe. 
            Tu momento dulce está a un click de distancia.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-black px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Ordenar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

// Small rotator component that cycles through every image in public/cookies
function ImageRotator() {
  const cookieFileNames = [
    "BLOCK.jpg",
    "CHOCO NUTELLA.jpg",
    "COCO CON DULCE .jpg",
    "COOKIE MANTECOL.jpg",
    "DUBAI.jpg",
    "DULCE DE LECHE .jpg",
    "FRANUÍ .jpg",
    "FRUTOS ROJOS.jpg",
    "KÍNDER.jpg",
    "MANTECOL.jpg",
    "MILKA OREO.jpg",
    "NUTELLA.jpg",
    "OREO .jpg",
    "ROCKLETS .jpg",
  ];

  const assetPath = (name) => `/cookies/${encodeURIComponent(name)}`;
  const imgs = cookieFileNames.map(assetPath);
  const [index, setIndex] = useState(0);

  // Preload images
  useEffect(() => {
    imgs.forEach((s) => {
      const img = new Image();
      img.src = s;
    });
  }, [imgs]);

  // Cycle with timeout for rotation
  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % imgs.length);
    }, 3000); // Ajustado a 3 segundos para coincidir con otros rotadores
    return () => clearTimeout(t);
  }, [index, imgs.length]);

  return (
    <div className="w-56 h-56 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={imgs[index]}
          alt="cookie preview"
          className="absolute inset-0 w-full h-full object-cover remove-bg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </AnimatePresence>
    </div>
  );
}

export default Home;