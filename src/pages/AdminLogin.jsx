import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-4 px-4 relative bottom-20">
      <div className="w-full max-w-md">
        {/* Header consistente con Dashboard, pero más sobrio */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-white font-praise text-2xl">🍪</span>
            </div>
            <h2 className="font-praise text-5xl text-black">The Cookie Box</h2>
          </div>
          <p className="font-poppins text-gray-600 mt-2">Panel de Administración</p>
        </div>

        {/* Tarjeta limpia y compacta */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="font-poppins text-sm text-gray-700">Email</label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/15 focus:border-black/50 font-poppins"
                  placeholder="admin@thecookiebox.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="font-poppins text-sm text-gray-700">Contraseña</label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.943 0 1.816.182 2.606.51A3.99 3.99 0 0120 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a3.99 3.99 0 013.394-3.49A7.964 7.964 0 0112 11z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/15 focus:border-black/50 font-poppins"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black text-white font-semibold py-3 transition-all duration-200 hover:bg-gray-900 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;