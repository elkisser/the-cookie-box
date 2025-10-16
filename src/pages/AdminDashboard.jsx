import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setFetchLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error al cargar los productos');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      // Upload image if exists
      if (formData.image) {
        const imageRef = ref(storage, `products/${Date.now()}_${formData.image.name}`);
        const snapshot = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: editingProduct ? (imageUrl || editingProduct.imageUrl) : imageUrl,
        createdAt: editingProduct ? editingProduct.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingProduct) {
        // Update existing product
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), productData);
      }

      // Reset form and refresh products
      setFormData({ name: '', description: '', price: '', image: null });
      setEditingProduct(null);
      await fetchProducts();
      alert(editingProduct ? 'Producto actualizado' : 'Producto agregado');
      
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
      image: null
    });
  };

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        await fetchProducts();
        alert('Producto eliminado');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', image: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-praise text-5xl text-black text-center mb-8">
          Panel de Administración
        </h1>

        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-poppins text-2xl font-semibold text-black mb-4">
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Cookie de Chocolate"
                />
              </div>

              <div>
                <label className="form-label">
                  Precio ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="5.99"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="form-input"
                placeholder="Deliciosa cookie con chips de chocolate..."
              />
            </div>

            <div>
              <label className="form-label">
                Imagen {editingProduct && '(Dejar vacío para mantener la actual)'}
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="form-input"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Agregar Producto'}
              </button>
              
              {editingProduct && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-poppins text-2xl font-semibold text-black mb-4">
            Productos Existentes ({products.length})
          </h2>
          
          {fetchLoading ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay productos registrados</p>
              <p className="text-sm text-gray-500 mt-2">
                Agrega tu primer producto usando el formulario de arriba
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-poppins font-semibold text-black text-lg">{product.name}</h3>
                        <p className="font-poppins text-gray-600 text-sm line-clamp-2">{product.description}</p>
                        <p className="font-poppins font-bold text-black text-lg">${product.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;