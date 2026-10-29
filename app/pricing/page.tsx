'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planType: string) => {
    setLoadingPlan(planType);
    const userId = localStorage.getItem('userId');

    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: planType }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection vers Stripe');
        setLoadingPlan(null);
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pb-20 font-sans selection:bg-purple-200 selection:text-black">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
        
        {/* EN-TÊTE */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="bg-purple-100 border border-purple-300 text-black text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Offre de Lancement
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
            Investissez dans votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-500 to-red-600">
              avenir marital
            </span>
          </h1>
          <p className="text-sm sm:text-base text-black/70 font-medium">
            Des formules adaptées pour trouver votre moitié dans le respect de vos valeurs.
          </p>
        </div>

        {/* 3 CARTES DE TARIF */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. FORMULE DÉCOUVERTE (Gratuit) */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm flex flex-col justify-between transition hover:border-purple-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-black/60 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  Découverte
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-black">Formule Découverte</h3>
                <p className="text-xs text-black/60 font-medium mt-1">
                  Pour commencer simplement.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2 border-t border-purple-50">
                <span className="text-4xl font-black text-black">0 €</span>
                <span className="text-xs text-black/60 font-medium">/ mois</span>
              </div>

              <ul className="space-y-3 text-xs text-black/80 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Profil complet avec 3 photos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>5 demandes de contact par jour</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Réponse aux messages gratuite</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>3 conseils IA par jour</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Outils de blocage et signalement</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled
                className="w-full bg-purple-50 border border-purple-200 text-black/50 font-bold text-xs py-4 rounded-2xl cursor-default"
              >
                Formule actuelle
              </button>
            </div>
          </div>

          {/* 2. FORMULE PREMIUM (Populaire) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-purple-300 shadow-xl shadow-purple-100/50 flex flex-col justify-between relative transform lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-200 border border-purple-300 text-black font-black text-xs uppercase px-4 py-1 rounded-full shadow-sm">
              Le plus populaire
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-black bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  Premium
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-black">Formule Premium</h3>
                <p className="text-xs text-black/60 font-medium mt-1">
                  Pour échanger sans contraintes.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2 border-t border-purple-50">
                <span className="text-4xl font-black text-red-600">14,99 €</span>
                <span className="text-xs text-black/60 font-medium">/ mois</span>
              </div>

              <ul className="space-y-3 text-xs text-black/90 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                  <span>Messagerie 100% illimitée</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                  <span>Jusqu'à 10 photos + vocal</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                  <span>Voir qui a aimé votre profil</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                  <span>Filtres de recherche avancés</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                  <span>1 boost offert + 15 conseils IA/jour</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSubscribe('premium')}
                disabled={loadingPlan !== null}
                className="w-full bg-gradient-to-r from-purple-200 via-purple-300 to-pink-200 hover:from-purple-300 hover:to-pink-300 border border-purple-300 text-black font-black text-xs py-4 rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingPlan === 'premium' ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Choisir Premium</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. FORMULE VIP */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm flex flex-col justify-between transition hover:border-purple-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-black bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  VIP
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-black">Formule VIP</h3>
                <p className="text-xs text-black/60 font-medium mt-1">
                  Visibilité maximale et sur-mesure.
                </p>
              </div>

              <div className="flex items-baseline gap-1 pt-2 border-t border-purple-50">
                <span className="text-4xl font-black text-black">24,99 €</span>
                <span className="text-xs text-black/60 font-medium">/ mois</span>
              </div>

              <ul className="space-y-3 text-xs text-black/80 font-medium pt-2">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>15 photos + 5 boosts par mois</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Assistant IA illimité & match du jour</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>10 coups de cœur prioritaires/mois</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Mode incognito & Questions Duo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span>Badge VIP & assistance 7j/7</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSubscribe('vip')}
                disabled={loadingPlan !== null}
                className="w-full bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black font-extrabold text-xs py-4 rounded-2xl shadow transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingPlan === 'vip' ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Choisir VIP</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}