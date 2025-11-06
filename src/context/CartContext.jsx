import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '../hooks/useToast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { toasts, showToast, removeToast } = useToast();

  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    showToast(`¡${product.name} agregado al carrito!`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

    if (item) {
      showToast(`${item.name} eliminado del carrito`, 'warning');
    }
  }, [cartItems, showToast]);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    const item = cartItems.find(item => item.id === productId);
    if (item) {
      showToast(`Cantidad de ${item.name} actualizada`, 'info');
    }
  }, [cartItems, showToast, removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    showToast('Carrito vaciado', 'info');
  }, [showToast]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Efecto para actualizar el localStorage cuando cambia el carrito
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    toasts,
    removeToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};