import React, { useState, useRef, useEffect } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [typedRemainingText, setTypedRemainingText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleText, setVisibleText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const descriptionRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (descriptionRef.current && !isMobile) {
      const lineHeight = parseInt(getComputedStyle(descriptionRef.current).lineHeight);
      const maxHeight = lineHeight * 2; // 2 líneas
      const actualHeight = descriptionRef.current.scrollHeight;
      
      setNeedsExpansion(actualHeight > maxHeight);
      
      // Calcular cuánto texto es visible en 2 líneas
      if (actualHeight > maxHeight) {
        const tempElement = document.createElement('div');
        tempElement.style.cssText = `
          position: absolute;
          visibility: hidden;
          width: ${descriptionRef.current.offsetWidth}px;
          font: getComputedStyle(descriptionRef.current).font;
          line-height: ${lineHeight}px;
          white-space: pre-wrap;
          word-wrap: break-word;
        `;
        tempElement.textContent = product.description;
        document.body.appendChild(tempElement);
        
        // Encontrar el punto de corte aproximado
        let cutIndex = product.description.length;
        for (let i = 1; i <= product.description.length; i++) {
          tempElement.textContent = product.description.substring(0, i);
          if (tempElement.offsetHeight > maxHeight) {
            cutIndex = i - 1;
            break;
          }
        }
        
        // Ajustar para no cortar palabras a la mitad
        const lastSpaceIndex = product.description.lastIndexOf(' ', cutIndex);
        if (lastSpaceIndex > cutIndex * 0.8) { // Si hay un espacio cercano
          setVisibleText(product.description.substring(0, lastSpaceIndex));
        } else {
          setVisibleText(product.description.substring(0, cutIndex));
        }
        
        document.body.removeChild(tempElement);
      } else {
        setVisibleText(product.description);
      }
    } else if (isMobile) {
      // En mobile, mostrar texto completo siempre
      setVisibleText(product.description);
      setNeedsExpansion(false);
    }
  }, [product.description, isMobile]);

  // Efecto para el tipeo de la parte faltante
  useEffect(() => {
    if (isExpanded && needsExpansion && !isMobile) {
      const remainingText = product.description.substring(visibleText.length);
      
      // Resetear el texto tipeado
      setTypedRemainingText('');
      setCurrentIndex(0);
      
      // Limpiar intervalo anterior si existe
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      // Crear efecto de tipeo solo para el texto faltante
      typingIntervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= remainingText.length) {
            clearInterval(typingIntervalRef.current);
            return prevIndex;
          }
          
          setTypedRemainingText(remainingText.substring(0, prevIndex + 1));
          return prevIndex + 1;
        });
      }, 20); // Velocidad de tipeo (ms por caracter)
      
      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      };
    } else {
      // Si no está expandido, limpiar el intervalo
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      setTypedRemainingText('');
      setCurrentIndex(0);
    }
  }, [isExpanded, needsExpansion, product.description, visibleText, isMobile]);

  const handleMouseEnter = () => {
    if (needsExpansion && !isMobile) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (needsExpansion && !isMobile) {
      setIsExpanded(false);
      // Limpiar el efecto de tipeo inmediatamente
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    }
  };

  return (
    <div 
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-black ${
        needsExpansion && !isMobile ? 'hover:scale-100 hover:-translate-y-4' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen con efecto hover elegante */}
      <div className="relative overflow-hidden bg-gray-100">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
        
        {/* Precio con diseño premium */}
        <div className="absolute top-4 right-4">
          <div className="bg-black text-white px-4 py-2 rounded-full shadow-2xl">
            <span className="font-poppins font-black text-lg">${product.price}</span>
          </div>
        </div>

        {/* Efecto de borde inferior animado */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
      
      {/* Contenido */}
      <div className="p-6">
        {/* Nombre del producto */}
        <h3 className="font-poppins font-black text-xl text-black mb-3 tracking-tight group-hover:text-gray-800 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Descripción con efecto de tipeo para la parte faltante */}
        <div className="mb-6">
          <div 
            ref={descriptionRef}
            className="font-poppins text-gray-600 text-sm leading-relaxed"
          >
            {/* Texto base (siempre visible) */}
            <span>{visibleText}</span>
            
            {/* Mostrar "..." cuando NO está expandido y necesita expansión */}
            {needsExpansion && !isExpanded && !isMobile && (
              <span className="text-gray-600">...</span>
            )}
            
            {/* Texto faltante que se "tipea" con cursor cuando SÍ está expandido */}
            {needsExpansion && isExpanded && !isMobile && (
              <span className="inline">
                {typedRemainingText}
                {currentIndex < (product.description.length - visibleText.length) && (
                  <span className="inline-block w-0.5 h-4 bg-gray-600 ml-0.5 animate-pulse align-middle"></span>
                )}
              </span>
            )}
            
            {/* En mobile o cuando no necesita expansión, mostrar texto completo */}
            {(!needsExpansion || isMobile) && (
              <span>{product.description.substring(visibleText.length)}</span>
            )}
          </div>
          
          {/* Indicador de texto expandible (solo si necesita expansión y no es mobile) */}
          {needsExpansion && !isExpanded && !isMobile && (
            <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-poppins text-xs text-gray-400 font-medium">
                Mantén el cursor para leer más
              </span>
              <svg className="w-3 h-3 text-gray-400 ml-1 transform group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Botón premium */}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="w-full bg-black text-white py-4 px-6 rounded-xl font-poppins font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-black hover:bg-gray-900 hover:shadow-2xl group/btn"
        >
          <div className="flex items-center justify-center space-x-3">
            <span>Agregar al carrito</span>
            <svg 
              className="w-5 h-5 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </button>
      </div>

      {/* Efecto de sombra premium en hover - más pronunciado para cards expandibles */}
      {!isMobile && (
        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-black opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none ${
          needsExpansion ? 'group-hover:border-2' : ''
        }`}></div>
      )}
      
      {/* Efecto de elevación adicional solo para cards que se expanden */}
      {needsExpansion && !isMobile && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
          <div className="absolute -inset-4 rounded-2xl bg-black opacity-0 group-hover:opacity-3 blur-md transition-opacity duration-500 pointer-events-none -z-10"></div>
        </>
      )}
    </div>
  );
};

export default ProductCard;