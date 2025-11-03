import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Products = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Array de iconos para rotar
  const rotatingIcons = ['🍪', '🍰', '🎂', '🍞', '🥧', '🧁'];

  // Efecto para rotar iconos cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => 
        prevIndex === rotatingIcons.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Obtener icono actual
  const getCurrentIcon = () => {
    return rotatingIcons[currentIconIndex];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Leer filtro inicial desde la URL
  useEffect(() => {
    const urlFilter = (searchParams.get('filter') || '').toLowerCase();
    if (['all', 'cookies', 'postres', 'tortas', 'budines'].includes(urlFilter)) {
      setFilter(urlFilter);
    }
  }, [searchParams]);

  // Escribir filtro en la URL cuando cambie
  useEffect(() => {
    const current = Object.fromEntries([...searchParams.entries()]);
    if (filter && current.filter !== filter) {
      setSearchParams({ ...current, filter });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Funciones de filtro mejoradas
  const isCookie = (name = '', description = '') => {
    const text = `${name} ${description}`.toLowerCase();
    return text.includes('cookie') || text.includes('galleta');
  };

  const isPostre = (name = '', description = '') => {
    const text = `${name} ${description}`.toLowerCase();
    return text.includes('postre') || text.includes('dessert') || 
           text.includes('dulce') || text.includes('postrecito');
  };

  const isTorta = (name = '', description = '') => {
    const text = `${name} ${description}`.toLowerCase();
    return text.includes('torta') || text.includes('cake') || 
           text.includes('tortita') || text.includes('pastel');
  };

  const isBudin = (name = '', description = '') => {
    const text = `${name} ${description}`.toLowerCase();
    return text.includes('budín') || text.includes('budin') || 
           text.includes('pudin') || text.includes('pudín');
  };

  const getProductCategory = (product) => {
    if (isCookie(product.name, product.description)) return 'cookies';
    if (isPostre(product.name, product.description)) return 'postres';
    if (isTorta(product.name, product.description)) return 'tortas';
    if (isBudin(product.name, product.description)) return 'budines';
    return 'otros';
  };

  const matchesFilter = (product) => {
    if (filter === 'cookies') return isCookie(product.name, product.description);
    if (filter === 'postres') return isPostre(product.name, product.description);
    if (filter === 'tortas') return isTorta(product.name, product.description);
    if (filter === 'budines') return isBudin(product.name, product.description);
    return true; // all
  };

  // Organizar productos por categorías cuando el filtro es "all"
  const organizeProductsByCategory = (products) => {
    const categories = {
      cookies: [],
      postres: [],
      tortas: [],
      budines: [],
      otros: []
    };

    products.forEach(product => {
      const category = getProductCategory(product);
      categories[category].push(product);
    });

    // Eliminar categorías vacías
    Object.keys(categories).forEach(category => {
      if (categories[category].length === 0) {
        delete categories[category];
      }
    });

    return categories;
  };

  const filteredProducts = products
    .filter(p => p.isActive !== false) // Solo productos activos
    .filter(p => matchesFilter(p))
    .filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const productsByCategory = organizeProductsByCategory(filteredProducts);

  const categoryLabels = {
    cookies: '🍪 Cookies',
    postres: '🍰 Postres',
    tortas: '🎂 Tortas',
    budines: '🍞 Budines',
    otros: '📦 Otros Productos'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="font-poppins text-gray-600">Cargando nuestros productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Verifica tu conexión a internet y que Firebase esté configurado correctamente.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="font-praise text-5xl md:text-6xl text-black mb-6">
            Nuestros Productos
          </h1>
          <p className="font-poppins text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Conocé nuestra selección de productos artesanales. 
            Cada uno elaborado con buenos ingredientes y dedicación.
          </p>
          
        {/* Filtros + Búsqueda */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
          {/* Toggle Mobile */}
          <button 
            className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm"
            onClick={() => setMobileFiltersOpen(v => !v)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" /></svg>
            <span className="font-poppins font-medium">Filtros</span>
          </button>

          {/* Switch de filtros */}
          <div className={`inline-flex p-1 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-x-auto w-full md:w-auto ${mobileFiltersOpen ? 'flex' : 'hidden'} md:flex`}>
              {[
                { key: 'all', label: 'Todos' },
                { key: 'cookies', label: 'Cookies' },
                { key: 'postres', label: 'Postres' },
                { key: 'tortas', label: 'Tortas' },
                { key: 'budines', label: 'Budines' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilter(opt.key)}
                  className={`px-4 py-2 rounded-xl font-poppins text-sm transition-all duration-200 whitespace-nowrap ${
                    filter === opt.key
                      ? 'bg-black text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
          <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-poppins"
              />
              <svg 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 fade-in">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIconIndex}
                  className="absolute text-4xl"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {rotatingIcons[currentIconIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <h3 className="font-poppins font-semibold text-gray-600 text-xl mb-4">
              {searchTerm 
                ? `No encontramos ${filter === 'all' ? 'productos' : filter} con ese nombre`
                : products.length === 0 
                  ? 'Aún no hay productos' 
                  : `No hay ${filter === 'all' ? 'productos activos' : filter} disponibles`
              }
            </h3>
            <p className="font-poppins text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? 'Intenta con otro nombre o explora todos nuestros productos disponibles.'
                : products.length === 0
                  ? 'Agrega productos desde el panel de administración.'
                  : `Prueba con otra categoría o revisa nuestros ${filter === 'all' ? 'productos' : 'otros productos'} disponibles.`
              }
            </p>
            {(searchTerm || (products.length > 0 && filteredProducts.length === 0)) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  if (products.length > 0) setFilter('all');
                }}
                className="btn-primary mt-6"
              >
                {products.length > 0 ? 'Ver Todos los Productos' : 'Recargar'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cuando el filtro es "all", mostrar por categorías */}
            {filter === 'all' ? (
              Object.keys(productsByCategory).map(category => (
                <div key={category} className="fade-in">
                  <h2 className="font-poppins font-semibold text-2xl text-gray-800 mb-6 border-b pb-2">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productsByCategory[category].map((product, index) => (
                      <div key={product.id} className="animate-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                        <ProductCard 
                          product={product} 
                          onAddToCart={addToCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Cuando hay un filtro específico, mostrar todos juntos */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={addToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA Bottom */}
        {products.length > 0 && (
          <div className="text-center mt-16 fade-in">
            <div className="bg-gray-50 rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="font-praise text-3xl text-black mb-4">¿No encontraste lo que buscabas?</h3>
              <p className="font-poppins text-gray-600 mb-6">
                Siempre estamos creando nuevos sabores. ¡Seguinos en Instagram para conocer las novedades!
              </p>
              <a 
                href="https://www.instagram.com/thecookiebox.sf/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>Seguinos en Instagram</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;