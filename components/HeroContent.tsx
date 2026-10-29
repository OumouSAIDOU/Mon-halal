'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Déclenche l'animation dès que le composant est monté
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="max-w-3xl space-y-8">
        
        {/* Badge : apparaît en premier (Délai 100ms) */}
        <div
          className={`inline-flex items-center gap-2 bg-purple-100 border border-purple-300 text-black text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          🇫🇷 N°1 des rencontres et du mariage halal en France
        </div>

        {/* Titre : apparaît en deuxième (Délai 300ms) */}
        <h1
          className={`text-4xl sm:text-6xl xl:text-7xl font-black text-black tracking-tight leading-[1.1] transition-all duration-700 delay-150 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Votre âme sœur, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-red-600">
            destinée par Allah
          </span>, <br />
          vous attend ici.
        </h1>

        {/* Paragraphe : apparaît en troisième (Délai 450ms) */}
        <p
          className={`text-base sm:text-lg text-black/80 max-w-2xl leading-relaxed font-medium transition-all duration-700 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Arrêtez de perdre votre temps sur des applications qui ne respectent pas vos valeurs. Ici, on parle mariage. Sérieusement, dans le respect et la pudeur.
        </p>

        {/* Boutons CTA : apparaissent en quatrième (Délai 600ms) */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-4 pt-2 transition-all duration-700 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            href="/register"
            className="w-full sm:w-auto bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black px-8 py-4 rounded-2xl font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
          >
            <span>Créer mon compte gratuitement</span>
            <span className="text-lg">🚀</span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-white hover:bg-purple-50 text-black border border-purple-200 px-8 py-4 rounded-2xl font-bold text-sm transition text-center shadow-sm"
          >
            Se connecter
          </Link>
        </div>

        {/* Chiffres clés : apparaissent en dernier (Délai 700ms) */}
        <div
          className={`pt-8 grid grid-cols-3 gap-6 border-t border-purple-100 max-w-lg text-left transition-all duration-700 delay-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="space-y-1">
            <p className="text-2xl font-black text-black">+10k</p>
            <p className="text-xs text-black/70 font-semibold">Membres actifs</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-black">100%</p>
            <p className="text-xs text-black/70 font-semibold">Profils vérifiés</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-black">0€</p>
            <p className="text-xs text-black/70 font-semibold">Gratuit au début</p>
          </div>
        </div>

      </div>
    </div>
  );
}