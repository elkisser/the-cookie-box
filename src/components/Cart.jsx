import React, { useEffect, useState } from 'react';

const Cart = ({ isOpen, onClose, items, updateQuantity, removeFromCart }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const ANIMATION_MS = 280;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      // start exit animation
      setIsClosing(true);
      const t = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, ANIMATION_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen, shouldRender]);

  const handleClose = () => {
    // trigger parent close after exit animation so we don't unmount instantly
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, ANIMATION_MS);
  };
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const generateWhatsAppMessage = () => {
    const message = `¡Hola! Quiero hacer un pedido de The Cookie Box:\n\n${
      items.map(item => `• ${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n')
    }\n\nTotal: $${total}\n\n¡Gracias! 🍪`;
    return encodeURIComponent(message);
  };

  const generateInstagramMessage = () => {
    const message = `¡Hola! Quiero hacer un pedido de The Cookie Box:\n\n${
      items.map(item => `• ${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n')
    }\n\nTotal: $${total}`;
    return encodeURIComponent(message);
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end ${isClosing ? 'fade-out' : 'fade-in'}`} onClick={handleClose}>
      <div className={`bg-white w-full max-w-md h-full overflow-y-auto ${isClosing ? 'cart-slide-out' : 'cart-slide-in'} flex flex-col`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-black text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="font-praise text-3xl">Mi Pedido</h2>
            <button 
              onClick={handleClose}
              className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="font-poppins text-gray-300 mt-2">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en el carrito
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
              </div>
              <h3 className="font-poppins font-semibold text-gray-600 text-lg mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500">Agregá algunas cookies</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-poppins font-semibold text-black text-sm truncate">{item.name}</h3>
                          <p className="font-poppins font-bold text-black text-lg">${item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center mt-4 w-full">
                        <div className="flex items-center justify-center gap-4 w-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-600 text-xl">-</span>
                          </button>
                          
                          <span className="font-poppins font-semibold text-black w-12 text-center text-lg">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-600 text-xl">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total and Actions */}
              <div className="sticky bottom-0 bg-black rounded-t-2xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-poppins font-semibold text-lg">Total:</span>
                  <span className="font-praise text-2xl">${total}</span>
                </div>
                
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/543425000000?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-500 text-white py-4 px-6 rounded-xl text-center font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444"/>
                    </svg>
                    <span>Enviar por WhatsApp</span>
                  </a>
                  
                  <a
                    href={`https://www.instagram.com/direct/inbox/?text=${generateInstagramMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl text-center font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Enviar por Instagram</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;