import { 
    db, auth, storage,
    collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, orderBy, query,
    signInWithEmailAndPassword, signOut, onAuthStateChanged,
    ref, uploadBytes, getDownloadURL
  } from '../firebase/config';
  
  // ==================== PRODUCT SERVICES ====================
  export const productService = {
    // Obtener todos los productos
    getProducts: async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting products:', error);
        throw new Error('Error al cargar los productos');
      }
    },
  
    // Obtener producto por ID
    getProduct: async (id) => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        throw new Error('Producto no encontrado');
      } catch (error) {
        console.error('Error getting product:', error);
        throw error;
      }
    },
  
    // Crear producto
    createProduct: async (productData, imageFile) => {
      try {
        let imageUrl = '';
        
        // Subir imagen si existe
        if (imageFile) {
          const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
          const snapshot = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }
  
        const product = {
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          imageUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        };
  
        const docRef = await addDoc(collection(db, 'products'), product);
        return { id: docRef.id, ...product };
      } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Error al crear el producto');
      }
    },
  
    // Actualizar producto
    updateProduct: async (id, productData, imageFile = null) => {
      try {
        let imageUrl = productData.imageUrl;
        
        if (imageFile) {
          const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
          const snapshot = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }
  
        const updatedData = {
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          imageUrl,
          updatedAt: new Date()
        };
  
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, updatedData);
        
        return { id, ...updatedData };
      } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Error al actualizar el producto');
      }
    },
  
    // Eliminar producto
    deleteProduct: async (id) => {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Error al eliminar el producto');
      }
    }
  };
  
  // ==================== AUTH SERVICES ====================
  export const authService = {
    // Iniciar sesión
    login: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Credenciales incorrectas');
      }
    },
  
    // Cerrar sesión
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error logging out:', error);
        throw error;
      }
    },
  
    // Observador de autenticación
    onAuthStateChanged: (callback) => {
      return onAuthStateChanged(auth, callback);
    },
  
    // Usuario actual
    getCurrentUser: () => {
      return auth.currentUser;
    }
  };