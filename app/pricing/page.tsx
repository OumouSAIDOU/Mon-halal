'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection vers Stripe');
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* EN-TÊTE */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Offre de Lancement 💍
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-blue-950 mt-3 mb-4">
            Investissez dans votre avenir marital
          </h1>
          <p className="text-sm text-slate-600">
            Trouvez votre moitié dans le respect des valeurs islamiques avec un accès illimité aux profils et fonctionnalités.
          </p>

          {/* TOGGLE MENSUEL / ANNUEL */}
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                billingCycle === 'monthly'
                  ? 'bg-blue-950 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-950 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annuel</span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                -58%
              </span>
            </button>
          </div>
        </div>

        {/* CARTES DE TARIF */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* FORMULE MENSUELLE */}
          <div className={`bg-white rounded-3xl p-6 border transition shadow-sm ${billingCycle === 'monthly' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}>
            <h3 className="text-lg font-bold text-slate-900">Abonnement Mensuel</h3>
            <p className="text-xs text-slate-500 mt-1">Liberté totale, sans engagement.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-blue-950">9,99 €</span>
              <span className="text-xs text-slate-500 font-medium">/ mois</span>
            </div>
            
            <ul className="mt-6 space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">✅ Messages illimités</li>
              <li className="flex items-center gap-2">✅ Voir qui a aimé votre profil</li>
              <li className="flex items-center gap-2">✅ Filtres avancés par ville et religiosité</li>
              <li className="flex items-center gap-2">✅ Résiliation en 1 clic à tout moment</li>
            </ul>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading}
              className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow transition"
            >
              Choisir le Mensuel
            </button>
          </div>

          {/* FORMULE ANNUELLE (RECOMMANDÉE) */}
          <div className={`bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 border-2 relative transition shadow-md ${billingCycle === 'yearly' ? 'border-amber-500 ring-4 ring-amber-500/20' : 'border-amber-300'}`}>
            <div className="absolute -top-3 right-6 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow">
              ⭐ Le plus populaire
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">Abonnement Annuel</h3>
            <p className="text-xs text-amber-900 font-medium mt-1">Recherche sereine pour le mariage.</p>
            
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-amber-600">49,99 €</span>
              <span className="text-xs text-slate-500 font-medium">/ an</span>
              <span className="text-[10px] text-emerald-600 font-bold ml-1">(~4,16 €/mois)</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2 font-medium">✅ Tout le contenu du Pass Mensuel</li>
              <li className="flex items-center gap-2 font-medium">✅ Économisez 58% sur l'année</li>
              <li className="flex items-center gap-2 font-medium">✅ Badge "Membre Sérieux" sur le profil</li>
              <li className="flex items-center gap-2 font-medium">✅ Priorité d'affichage dans Explore</li>
            </ul>

            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={loading}
              className="mt-8 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition transform active:scale-95"
            >
              Passer à l'Annuel (49,99 €)
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}