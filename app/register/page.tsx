'use client';

import { useState as useReactState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useReactState('');
  const [password, setPassword] = useReactState('');
  const [message, setMessage] = useReactState('');
  const [isError, setIsError] = useReactState(false);
  const [isLoaded, setIsLoaded] = useReactState(false);
  const [isLoading, setIsLoading] = useReactState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage('Inscription réussie ! Redirection vers la page de connexion...');
        setEmail('');
        setPassword('');

        // Redirection vers la page login après 1.5 seconde
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.error || 'Une erreur est survenue');
        setIsLoading(false);
      }
    } catch (err) {
      setIsError(true);
      setMessage('Erreur de connexion au serveur.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-purple-200 selection:text-black">
      
      {/* Orbes de fond dynamiques */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/50 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-red-100/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header : Logo & Bouton Retour */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex justify-between items-center py-2">
        <Link href="/" className="text-xl sm:text-2xl font-black text-black">
          Mon <span className="text-red-600">HALAL</span> 🇫🇷
        </Link>
        <Link
          href="/"
          className="text-xs font-bold text-black/70 hover:text-black bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-full transition shadow-sm"
        >
          ← Retour à l'accueil
        </Link>
      </header>

      {/* Conteneur Intelligent Unifié */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-8">
        <div
          className={`bg-white/80 backdrop-blur-xl border border-purple-100/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-purple-100/50 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transform transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Côté Gauche : Présentation & Promesse (5 colonnes) */}
          <div className="lg:col-span-5 space-y-6 lg:border-r lg:border-purple-100/80 lg:pr-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-black shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              Création de Compte
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Rejoignez Mon HALAL
              </h1>
              <p className="text-xs sm:text-sm text-black/70 font-medium leading-relaxed">
                Faites le premier pas vers un mariage épanoui, sérieux et respectueux de vos principes.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3 text-left">
                <span className="text-lg">✨</span>
                <div>
                  <p className="text-xs font-bold text-black">100% Gratuit au début</p>
                  <p className="text-[11px] text-black/60 font-medium">Créez votre profil en quelques clics</p>
                </div>
              </div>
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3 text-left">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="text-xs font-bold text-black">Pudeur & Confidentialité</p>
                  <p className="text-[11px] text-black/60 font-medium">Environnement sain et modéré</p>
                </div>
              </div>
            </div>
          </div>

          {/* Côté Droit : Formulaire d'Inscription (7 colonnes) */}
          <div className="lg:col-span-7 space-y-6">
            
            {message && (
              <div
                className={`p-4 text-xs sm:text-sm font-bold rounded-2xl border transition-all animate-in zoom-in duration-200 ${
                  isError
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-purple-100 border-purple-300 text-black'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-black uppercase tracking-wider">
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-purple-50/40 border border-purple-200 rounded-2xl text-black placeholder-black/40 focus:outline-none focus:border-purple-400 focus:bg-white text-sm font-semibold transition shadow-sm"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-black uppercase tracking-wider">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-purple-50/40 border border-purple-200 rounded-2xl text-black placeholder-black/40 focus:outline-none focus:border-purple-400 focus:bg-white text-sm font-semibold transition shadow-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-200 via-purple-300 to-pink-200 hover:from-purple-300 hover:to-pink-300 border border-purple-300 text-black py-4 rounded-2xl font-black text-sm transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-md shadow-purple-200/50 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <span></span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-purple-100 text-center">
              <p className="text-xs sm:text-sm text-black/70 font-medium">
                Vous avez déjà un compte ?{' '}
                <Link
                  href="/login"
                  className="text-black font-extrabold hover:text-red-600 underline underline-offset-4 transition"
                >
                  Se connecter
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="relative z-10 text-center text-xs text-black/50 font-semibold py-2">
        © 2026 Mon HALAL. Tous droits réservés.
      </footer>

    </div>
  );
}