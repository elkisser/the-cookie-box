import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { CartProvider, useCart } from './context/CartContext';
import ToastContainer from './components/ToastContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminLogin from './pages/AdminLogin';
import Logout from './pages/Logout';
import AdminDashboard from './pages/AdminDashboard';

// Wrapper component to access cart context
const ToastContainerWrapper = () => {
  const { toasts, removeToast } = useCart();
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    );
  }

  const AppContent = () => {
    const location = useLocation();

    return (
      <CartProvider>
        <div key={location.pathname} className="App animate-page">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/logout" element={<Logout />} />
            <Route 
              path="/mrcookie" 
              element={
                user ? (
                  <AdminDashboard />
                ) : (
                  <AdminLogin onLogin={() => setUser(auth.currentUser)} />
                )
              } 
            />
            <Route path="/admin" element={<Navigate to="/mrcookie" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <ToastContainerWrapper />
        </div>
      </CartProvider>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;