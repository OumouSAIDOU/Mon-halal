'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [counts, setCounts] = useState({ matchesCount: 0, unreadMessages: 0 });

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

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Mon Profil', icon: '👤', badge: 0 },
    { href: '/explore', label: 'Découvrir', icon: '✨', badge: 0 },
    { href: '/matches', label: 'Matchs', icon: '❤️', badge: counts.matchesCount },
    { href: '/messages', label: 'Messages', icon: '💬', badge: counts.unreadMessages },
  ];

  return (
    <>
      {/* --- NAVBAR DESKTOP & HEADER MOBILE --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          {/* Logo Mon HALAL */}
          <Link href="/dashboard" className="flex items-center space-x-2 text-xl font-black tracking-tight text-blue-950">
            <span>Mon</span>
            <span className="text-red-600">HALAL</span>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">🇫🇷</span>
          </Link>

          {/* Navigation DESKTOP (Masquée sur écran mobile) */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-950 border border-blue-200/60 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.icon} {link.label}</span>
                  {link.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions : Bouton Premium + Déconnexion */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Bouton Premium */}
            <Link
              href="/pricing"
              className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs px-3 sm:px-4 py-2 rounded-xl shadow-sm transition transform active:scale-95"
            >
              <span>✨</span>
              <span className="hidden sm:inline">Passer</span>
              <span>Premium</span>
            </Link>

            {/* Bouton Déconnexion */}
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* --- BOTTOM NAVBAR MOBILE (Affichée uniquement sur téléphone) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-1 py-2 shadow-lg flex justify-around items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl relative transition-all ${
                isActive ? 'text-blue-950 font-black' : 'text-slate-500 font-medium'
              }`}
            >
              <span className="text-lg relative">
                {link.icon}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                    {link.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] mt-0.5">{link.label}</span>
            </Link>
          );
        })}

        {/* Raccourci Premium pour la barre mobile */}
        <Link
          href="/pricing"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl relative text-amber-600 font-extrabold"
        >
          <span className="text-lg">✨</span>
          <span className="text-[10px] mt-0.5">Premium</span>
        </Link>
      </nav>
    </>
  );
}