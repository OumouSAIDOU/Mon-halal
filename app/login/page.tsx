'use client';

import { useState as useReactState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useReactState('');
  const [password, setPassword] = useReactState('');
  const [message, setMessage] = useReactState('');
  const [isError, setIsError] = useReactState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage('Connexion réussie ! Redirection en cours...');

        // Sauvegarder l'ID utilisateur temporairement dans le stockage local du navigateur
        if (data.userId) {
          localStorage.setItem('userId', data.userId.toString());
        }

        // Redirection vers le dashboard après 1.5 seconde
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-blue-950">
            Mon <span className="text-red-600">HALAL</span> 🇫🇷
          </Link>
          <p className="text-sm text-gray-500 mt-1">Heureux de vous revoir</p>
        </div>

        {message && (
          <div
            className={`p-3 mb-4 text-sm rounded-xl ${
              isError
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-50 text-blue-950 font-medium'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:outline-none text-sm"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-950 focus:outline-none text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-3.5 rounded-xl font-bold hover:bg-blue-900 transition duration-200 shadow-md text-sm"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-950 font-bold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}