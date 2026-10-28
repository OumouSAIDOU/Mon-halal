'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="font-black text-blue-950">Mon HALAL</span>
          <span>© {new Date().getFullYear()} — Tous droits réservés 🇫🇷</span>
        </div>
        <div className="flex items-center space-x-6 font-medium">
          <span className="hover:text-slate-900 transition cursor-pointer">Confidentialité</span>
          <span className="hover:text-slate-900 transition cursor-pointer">Conditions Générales</span>
          <span className="hover:text-slate-900 transition cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}