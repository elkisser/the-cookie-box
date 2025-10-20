import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [imagePreview, setImagePreview] = useState(null);
  const [formStep, setFormStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setFetchLoading(true);
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleProductStatus = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingProduct?.imageUrl || '';
      
      if (formData.image) {
        const imageRef = ref(storage, `products/${Date.now()}_${formData.image.name}`);
        const snapshot = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: imageUrl,
        isActive: formData.isActive,
        createdAt: editingProduct ? editingProduct.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      resetForm();
      await fetchProducts();
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: null,
      isActive: product.isActive !== false
    });
    setImagePreview(product.imageUrl || null);
    setActiveTab('form');
    setFormStep(1);
  };

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto permanentemente?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const toggleProductActiveStatus = async (productId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        isActive: !currentStatus,
        updatedAt: new Date()
      });
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Error al actualizar el producto');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', image: null, isActive: true });
    setEditingProduct(null);
    setImagePreview(null);
    setFormStep(1);
  };

  const nextStep = () => {
    if (formStep < 3) setFormStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (formStep > 1) setFormStep(prev => prev - 1);
  };

  const activeProducts = products.filter(p => p.isActive !== false);
  const inactiveProducts = products.filter(p => p.isActive === false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header con animación */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-praise text-2xl">🍪</span>
            </div>
            <h1 className="font-praise text-6xl text-black bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="font-poppins text-gray-600 text-lg max-w-2xl mx-auto">
            Gestiona tu catálogo de cookies artesanales
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar mejorado */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-8 border border-white/20">
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('form')}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group ${
                    activeTab === 'form' 
                      ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-white hover:shadow-lg hover:scale-105 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'form' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-black group-hover:text-white'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-semibold">{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('active')}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group ${
                    activeTab === 'active' 
                      ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-white hover:shadow-lg hover:scale-105 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'active' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-black group-hover:text-white'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold block">Activos</span>
                    <span className="text-sm opacity-75">{activeProducts.length} productos</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group ${
                    activeTab === 'inactive' 
                      ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-white hover:shadow-lg hover:scale-105 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeTab === 'inactive' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-black group-hover:text-white'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold block">Ocultos</span>
                    <span className="text-sm opacity-75">{inactiveProducts.length} productos</span>
                  </div>
                </button>
              </nav>

              {/* Stats mejorados */}
              <div className="mt-8 pt-6 border-t border-gray-200/50">
                <h3 className="font-semibold text-gray-900 mb-4">Resumen</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50">
                    <span className="text-sm text-gray-700">Total</span>
                    <span className="font-bold text-blue-700">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50">
                    <span className="text-sm text-gray-700">Publicados</span>
                    <span className="font-bold text-green-700">{activeProducts.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100/50">
                    <span className="text-sm text-gray-700">Ocultos</span>
                    <span className="font-bold text-orange-700">{inactiveProducts.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Product Form - Completamente renovado */}
            {activeTab === 'form' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-poppins text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                      {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {editingProduct ? 'Actualiza la información del producto' : 'Completa los datos para agregar un nuevo producto'}
                    </p>
                  </div>
                  {editingProduct && (
                    <button
                      onClick={resetForm}
                      className="btn-secondary px-6 py-3 text-sm font-semibold rounded-xl hover:scale-105 transition-transform"
                    >
                      + Nuevo Producto
                    </button>
                  )}
                </div>

                {/* Progress Steps - compactado y centrado */}
                <div className="flex items-center justify-center mb-6 max-w-sm mx-auto">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        formStep >= step 
                          ? 'bg-black text-white shadow-md' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-10 h-[3px] mx-2 transition-all duration-300 ${
                          formStep > step ? 'bg-black' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Step 1: Información básica */}
                  {formStep === 1 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Nombre del Producto */}
                        <div className="space-y-2">
                          <label className="form-label text-lg font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M5 7h14" />
                            </svg>
                            Nombre del Producto
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="form-input-lg pl-10 focus:ring-2 focus:ring-black/20 focus:border-black/60 transition-shadow"
                              placeholder="Cookie Triple Chocolate"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Usa un nombre corto y sugerente.</p>
                        </div>

                        {/* Precio */}
                        <div className="space-y-2">
                          <label className="form-label text-lg font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12c2.21 0 4 1.343 4 3M12 4v16" />
                            </svg>
                            Precio ($)
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black font-semibold">
                              $
                            </div>
                            <input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                              step="0.01"
                              min="0"
                              className="form-input-lg pl-8 focus:ring-2 focus:ring-black/20 focus:border-black/60 transition-shadow"
                              placeholder="3000.00"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Usa punto para decimales. Ej: 6.50</p>
                        </div>
                      </div>

                      {/* Descripción */}
                      <div className="space-y-2">
                        <label className="form-label text-lg font-semibold flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M8 8h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Descripción
                        </label>
                        <div className="relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            className="form-input-lg pr-12 focus:ring-2 focus:ring-black/20 focus:border-black/60 transition-shadow"
                            placeholder="Describe los ingredientes y características especiales de tu cookie..."
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {Math.max(0, 300 - (formData.description?.length || 0))} caracteres
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Recomendado: hasta 300 caracteres.</p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn-primary px-6 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-transform"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Imagen y visibilidad */}
                  {formStep === 2 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Upload de imagen */}
                        <div className="space-y-4">
                          <label className="form-label text-lg font-semibold">
                            Imagen del Producto
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-black transition-all duration-300 group cursor-pointer bg-gradient-to-br from-gray-50 to-white">
                            <input
                              type="file"
                              name="image"
                              onChange={handleInputChange}
                              accept="image/*"
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer block">
                              {imagePreview ? (
                                <div className="space-y-4">
                                  <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-40 h-40 object-cover rounded-2xl mx-auto shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <p className="text-sm text-gray-600">Haz clic para cambiar la imagen</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">Subir imagen</p>
                                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP hasta 5MB</p>
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Toggle de visibilidad - SUPER MEJORADO */}
                        <div className="space-y-6">
                          <label className="form-label text-lg font-semibold">
                            Visibilidad del Producto
                          </label>
                          
                          <div 
                            onClick={toggleProductStatus}
                            className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              formData.isActive
                                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-lg'
                                : 'bg-gradient-to-br from-orange-50 to-red-100 border-2 border-orange-200 shadow-lg'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-xl transition-all duration-300 ${
                                  formData.isActive
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-orange-500 text-white shadow-lg'
                                }`}>
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {formData.isActive ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    )}
                                  </svg>
                                </div>
                                <div>
                                  <h3 className={`font-bold text-lg transition-colors duration-300 ${
                                    formData.isActive ? 'text-green-800' : 'text-orange-800'
                                  }`}>
                                    {formData.isActive ? 'Visible' : 'Oculto'}
                                  </h3>
                                  <p className={`text-sm transition-colors duration-300 ${
                                    formData.isActive ? 'text-green-600' : 'text-orange-600'
                                  }`}>
                                    {formData.isActive 
                                      ? 'Los clientes pueden ver este producto' 
                                      : 'Este producto está oculto para los clientes'
                                    }
                                  </p>
                                </div>
                              </div>
                              
                              {/* Toggle Switch Animado */}
                              <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-500 ${
                                formData.isActive ? 'bg-green-500 justify-end' : 'bg-orange-500 justify-start'
                              }`}>
                                <div className="w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300" />
                              </div>
                            </div>
                            
                            {/* Efecto de brillo */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-opacity duration-1000 ${
                              formData.isActive ? 'opacity-0' : 'opacity-0'
                            }`} />
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              {formData.isActive 
                                ? '🎯 El producto está visible en tu tienda' 
                                : '👻 El producto está oculto de los clientes'
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary px-6 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-transform"
                        >
                          Atrás
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn-primary px-6 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-transform"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Resumen y envío */}
                  {formStep === 3 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Resumen del Producto</h3>
                        
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-600">Nombre</label>
                              <p className="text-lg font-bold text-gray-900">{formData.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600">Precio</label>
                              <p className="text-lg font-bold text-green-600">${formData.price}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-gray-600">Estado</label>
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
                                formData.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  formData.isActive ? 'bg-green-500' : 'bg-orange-500'
                                }`} />
                                <span className="font-semibold">
                                  {formData.isActive ? 'Visible' : 'Oculto'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-gray-600">Descripción</label>
                              <p className="text-gray-700 leading-relaxed">{formData.description}</p>
                            </div>
                            {imagePreview && (
                              <div>
                                <label className="text-sm font-semibold text-gray-600">Imagen</label>
                                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2 shadow-lg" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary px-6 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-transform"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary disabled:opacity-50 flex items-center space-x-3 px-6 py-3 text-base font-semibold rounded-xl hover:scale-105 transition-transform"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Guardando...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Los componentes ProductList se mantienen igual pero con las mejoras visuales */}
            {activeTab === 'active' && (
              <ProductList 
                products={activeProducts}
                loading={fetchLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={toggleProductActiveStatus}
                title="Productos Activos"
                emptyMessage="No hay productos activos"
              />
            )}

            {activeTab === 'inactive' && (
              <ProductList 
                products={inactiveProducts}
                loading={fetchLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={toggleProductActiveStatus}
                title="Productos Ocultos"
                emptyMessage="No hay productos ocultos"
                isInactive
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ProductList component (mejorado con las mismas animaciones)
const ProductList = ({ products, loading, onEdit, onDelete, onToggleStatus, title, emptyMessage, isInactive = false }) => {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex items-center space-x-4">
          <div className="spinner"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-poppins text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
          {title}
        </h2>
        <span className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow-lg">
          {products.length} productos
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🍪</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-3">{emptyMessage}</h3>
          <p className="text-gray-500">
            {isInactive 
              ? 'Los productos que ocultes aparecerán aquí' 
              : 'Comienza agregando tu primer producto'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="border border-gray-200/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm animate-stagger"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 flex-1">
                  <div className="relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {!isInactive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-poppins font-bold text-gray-900 text-xl truncate">{product.name}</h3>
                      {!isInactive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-semibold shadow-sm">
                          Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-semibold shadow-sm">
                          Oculto
                        </span>
                      )}
                    </div>
                    <p className="font-poppins text-gray-600 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
                    <div className="flex items-center space-x-6">
                      <p className="font-poppins font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price}
                      </p>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Creado: {product.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:scale-110 transition-all duration-300 shadow-lg"
                    title="Editar producto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => onToggleStatus(product.id, product.isActive !== false)}
                    className={`p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg ${
                      isInactive 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                        : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                    }`}
                    title={isInactive ? 'Mostrar producto' : 'Ocultar producto'}
                  >
                    {isInactive ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                  
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:scale-110 transition-all duration-300 shadow-lg"
                    title="Eliminar producto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;