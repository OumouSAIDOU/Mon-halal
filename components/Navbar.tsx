'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm py-3'
          : 'bg-white/80 backdrop-blur-md border-b border-purple-100/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex justify-between items-center">
        {/* Logo Mon HALAL */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center space-x-1.5 text-xl sm:text-2xl font-black tracking-tight text-black z-50"
        >
          <span>Mon</span>
          <span className="text-red-600">HALAL</span>
          <span className="text-xs sm:text-sm">🇫🇷</span>
        </Link>

        {/* Liens de Navigation DESKTOP */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-black">
          <Link href="/" className="hover:text-red-600 transition">
            Accueil
          </Link>
          <Link href="/#valeurs" className="hover:text-red-600 transition">
            Nos Valeurs
          </Link>
          <Link href="/#etape" className="hover:text-red-600 transition">
            Comment ça marche
          </Link>
          <Link href="/contact" className="hover:text-red-600 transition">
            Aide & Contact
          </Link>
        </nav>

        {/* Boutons d'action (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-purple-200 hover:bg-purple-300 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm border border-purple-300"
            >
              Mon Espace
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm"
              >
                Rejoindre
              </Link>
            </>
          )}
        </div>

        {/* Bouton Menu Burger MOBILE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-black focus:outline-none p-2 rounded-xl hover:bg-purple-100/80 transition z-50"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Déroulant MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bg-white/98 backdrop-blur-xl border-b border-purple-100 px-6 py-6 space-y-6 shadow-2xl h-[calc(100vh-56px)] overflow-y-auto flex flex-col justify-between animate-in slide-in-from-top-2 duration-200">
          
          <nav className="flex flex-col space-y-4 text-lg font-extrabold text-black pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-red-600 transition py-2 border-b border-purple-50 flex justify-between items-center"
            >
              <span>Accueil</span>
              <span className="text-sm text-purple-400">➔</span>
            </Link>
            <Link
              href="/#valeurs"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-red-600 transition py-2 border-b border-purple-50 flex justify-between items-center"
            >
              <span>Nos Valeurs</span>
              <span className="text-sm text-purple-400">➔</span>
            </Link>
            <Link
              href="/#etape"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-red-600 transition py-2 border-b border-purple-50 flex justify-between items-center"
            >
              <span>Comment ça marche</span>
              <span className="text-sm text-purple-400">➔</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-red-600 transition py-2 border-b border-purple-50 flex justify-between items-center"
            >
              <span>Aide & Contact</span>
              <span className="text-sm text-purple-400">➔</span>
            </Link>
          </nav>

          {/* Boutons CTA mobiles */}
          <div className="pt-6 border-t border-purple-100 flex flex-col space-y-3 pb-8">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black py-4 rounded-2xl font-black text-base transition shadow-md"
              >
                Mon Espace 
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gradient-to-r from-purple-200 via-purple-300 to-pink-200 border border-purple-300 text-black py-4 rounded-2xl font-black text-base transition shadow-lg shadow-purple-200/50 flex items-center justify-center gap-2"
                >
                  <span>Rejoindre gratuitement</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gray-50 hover:bg-purple-50 text-black border border-purple-200 py-3.5 rounded-2xl font-bold text-sm transition"
                >
                  Connexion
                </Link>
              </>
            )}
          </div>

        </div>
      )}
    </header>
  );
}