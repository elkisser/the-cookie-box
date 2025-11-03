import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-5 z-0"></div>
        {/* Decorative cookie background */}
        <div className="cookie-bg" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="cookie-piece"
              style={{
                left: `${(i * 8 + (i % 3) * 3) % 100}%`,
                animationDuration: `${8 + (i % 2)}s`,
                animationDelay: `${(i % 7) * 0.7}s`,
              }}
            >
              🍪
            </span>
          ))}
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
                  En <span className="font-semibold text-black">The Cookie Box</span> creamos las cookies más deliciosas y únicas de Santa Fe Capital. 
                  Cada cookie es elaborada artesanalmente con ingredientes de la más alta calidad 
                  y mucho amor, garantizando una experiencia única en cada bocado.
                </p>
                <p className="font-poppins text-gray-700 text-lg leading-relaxed">
                  Nuestra especialidad son las <span className="font-semibold text-black">Crumble Cookies</span>, pero siempre estamos innovando 
                  con nuevos sabores y texturas que sorprenden a nuestros clientes más exigentes.
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
            
            <div className="grid grid-cols-2 gap-6 fade-in">
              <div className="space-y-6">
                <img 
                  src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Cookies artesanales"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Proceso artesanal"
                  className="w-full h-60 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-6 pt-12">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Ingredientes premium"
                  className="w-full h-60 object-cover rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Cookie Box especial"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
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
              <h3 className="font-poppins font-bold text-black text-xl mb-4">Ingredientes Premium</h3>
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
              <h3 className="font-poppins font-bold text-black text-xl mb-4">Frescas Siempre</h3>
              <p className="font-poppins text-gray-600 leading-relaxed">
                Todas nuestras cookies se hornean el mismo día de la entrega para garantizar 
                máxima frescura y ese sabor recién horneado que amas.
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
                    href={`https://wa.me/543425000000?text=${encodeURIComponent('¡Hola! Me interesa comprar por cantidad/por mayor de The Cookie Box.\n\nContame por favor precios mayoristas, cantidades mínimas y tiempos de entrega.\n\n¡Gracias!')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Consultar por WhatsApp
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
                <div className="w-56 h-56 rounded-2xl bg-white text-black flex items-center justify-center text-7xl shadow-2xl">
                  🍪
                </div>
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
            Descubre por qué somos las cookies más famosas de Santa Fe. 
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

export default Home;