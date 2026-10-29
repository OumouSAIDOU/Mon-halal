'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [counts, setCounts] = useState({ matchesCount: 0, unreadMessages: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchCounts = () => {
      fetch(`/api/notifications/count?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCounts({
              matchesCount: data.matchesCount || 0,
              unreadMessages: data.unreadMessages || 0,
            });
          }
        })
        .catch(() => {});
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Bloque le scroll en arrière-plan lorsque le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    localStorage.removeItem('userId');
    router.push('/'); // 👈 Redirige vers la page d'accueil principale
  };

  const navLinks = [
    { href: '/dashboard', label: 'Mon Profil', badge: 0 },
    { href: '/explore', label: 'Découvrir', badge: 0 },
    { href: '/matches', label: 'Matchs', badge: counts.matchesCount },
    { href: '/messages', label: 'Messages', badge: counts.unreadMessages },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        
        {/* Logo Mon HALAL */}
        <Link
          href="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center space-x-1 text-xl font-black tracking-tight text-black z-50"
        >
          <span>Mon</span>
          <span className="text-red-600">HALAL</span>
          <span className="text-xs bg-purple-100 text-black px-2 py-0.5 rounded-full font-bold">🇫🇷</span>
        </Link>

        {/* Navigation DESKTOP */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 ${
                  isActive
                    ? 'bg-purple-100 text-black border border-purple-300 shadow-sm'
                    : 'text-black/70 hover:text-black hover:bg-purple-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/pricing"
            className="flex items-center space-x-1 bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition transform active:scale-95"
          >
            <span>Passer Premium</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-black/60 hover:text-red-600 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Bouton Menu Burger MOBILE (En Haut à Droite) */}
        <div className="flex items-center gap-2 md:hidden z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-black focus:outline-none p-2 rounded-xl hover:bg-purple-100/80 transition"
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

      </div>

      {/* Menu Déroulant MOBILE (Glissant depuis le haut) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[64px] bg-white/98 backdrop-blur-xl border-b border-purple-100 px-6 py-6 shadow-2xl h-[calc(100vh-64px)] overflow-y-auto flex flex-col justify-between animate-in slide-in-from-top-2 duration-200">
          
          {/* Liens du Menu */}
          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-4 rounded-2xl font-extrabold text-base transition flex justify-between items-center ${
                    isActive
                      ? 'bg-purple-100 text-black border border-purple-300 shadow-sm'
                      : 'text-black/80 hover:bg-purple-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.badge > 0 && (
                      <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-purple-400">➔</span>
                </Link>
              );
            })}
          </nav>

          {/* Boutons d'action en bas du menu mobile */}
          <div className="pt-6 border-t border-purple-100 flex flex-col space-y-3 pb-8">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black py-3.5 rounded-2xl font-black text-sm transition shadow-md"
            >
              Passer Premium
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-center bg-gray-50 hover:bg-red-50 text-red-600 border border-purple-200 py-3 rounded-2xl font-bold text-sm transition"
            >
              Se déconnecter
            </button>
          </div>

        </div>
      )}
    </header>
  );
}