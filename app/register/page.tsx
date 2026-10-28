'use client';

import { useState as useReactState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useReactState('');
  const [password, setPassword] = useReactState('');
  const [message, setMessage] = useReactState('');
  const [isError, setIsError] = useReactState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage('Inscription réussie ! Vous pouvez vous connecter.');
        setEmail('');
        setPassword('');
      } else {
        setIsError(true);
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Mon <span className="text-red-600">HALAL</span>
          </Link>
          <p className="text-sm text-gray-500 mt-1">Créez votre compte en quelques secondes</p>
        </div>

        {message && (
          <div
            className={`p-3 mb-4 text-sm rounded-lg ${
              isError
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-900'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-200 shadow-md"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-900 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}