'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo Mon HALAL */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-extrabold tracking-tight text-blue-900">
          <span>Mon</span>
          <span className="text-red-600">HALAL</span>
          <span className="text-sm">🇫🇷</span>
        </Link>

        {/* Liens de Navigation DESKTOP */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-900 transition">
            Accueil
          </Link>
          <Link href="/#valeurs" className="hover:text-blue-900 transition">
            Nos Valeurs
          </Link>
          <Link href="/#etape" className="hover:text-blue-900 transition">
            Comment ça marche
          </Link>
        </nav>

        {/* Boutons d'action (Desktop & Mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
            >
              Mon Espace
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-blue-900 transition px-3 py-2"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                Rejoindre
              </Link>
            </>
          )}
        </div>

        {/* Bouton Menu Burger MOBILE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Déroulant MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-900 transition py-1"
            >
              Accueil
            </Link>
            <Link
              href="/#valeurs"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-900 transition py-1"
            >
              Nos Valeurs
            </Link>
            <Link
              href="/#etape"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-900 transition py-1"
            >
              Comment ça marche
            </Link>
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                Mon Espace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm"
                >
                  Rejoindre
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}