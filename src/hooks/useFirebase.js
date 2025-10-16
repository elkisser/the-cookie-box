import { useState, useEffect } from 'react';
import { productService, authService } from '../services/firebaseService';

// Hook para productos
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData, imageFile) => {
    try {
      const newProduct = await productService.createProduct(productData, imageFile);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, productData, imageFile) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData, imageFile);
      setProducts(prev => 
        prev.map(product => product.id === id ? updatedProduct : product)
      );
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    removeProduct,
    refreshProducts: loadProducts
  };
};

// Hook para autenticación
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      return await authService.login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout
  };
};