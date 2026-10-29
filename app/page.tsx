'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const fullText = "destinée par Allah";
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Compteurs animés (Numbers Count Up)
  const [membersCount, setMembersCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    // 1. Animation Machine à écrire
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingDone(true);
      }
    }, 90);

    // 2. Animation Compteur de Chiffres
    const duration = 2000; // 2 secondes
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const countInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      setMembersCount(Math.floor(progress * 10000));
      setVerifiedCount(Math.floor(progress * 100));

      if (step >= steps) {
        setMembersCount(10000);
        setVerifiedCount(100);
        clearInterval(countInterval);
      }
    }, intervalTime);

    return () => {
      clearInterval(typingInterval);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-purple-200 selection:text-black overflow-x-hidden">
      
      {/* Navbar fixe */}
      <Navbar />

      {/* Hero Section Centré avec Arrière-plan Dynamique & Animations */}
      <section className="relative bg-white text-black overflow-hidden pt-40 pb-32 lg:pt-52 lg:pb-40 border-b border-purple-100 flex items-center justify-center text-center">
        
        {/* 1. Orbes d'ambiance animés en arrière-plan */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-red-100/40 rounded-full blur-3xl pointer-events-none animate-bounce duration-[10000ms]"></div>

        {/* 2. Image de fond avec effet Ken Burns (Zoom lent) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/logo-hero.jpg"
            alt="Mariage et Rencontre Halal - Mon HALAL"
            className="w-full h-full object-cover object-center scale-105 filter brightness-95 opacity-40 transition-transform duration-[8000ms] ease-out hover:scale-115"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white"></div>
        </div>

        {/* 3. Contenu principal du Hero */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto flex flex-col items-center">
          <div className="w-full space-y-8 flex flex-col items-center">
            
            {/* Badge animé avec pulsation et rebond */}
            <div
              className={`inline-flex items-center gap-2 bg-purple-100 border border-purple-300 text-black text-xs font-bold px-5 py-2.5 rounded-full shadow-md transform transition-all duration-1000 ease-out hover:scale-105 cursor-default ${
                isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-90'
              }`}
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-ping"></span>
              N°1 des rencontres et du mariage halal en France
            </div>

            {/* Titre principal avec Typing Effect */}
            <h1
              className={`text-4xl sm:text-6xl xl:text-7xl font-black text-black tracking-tight leading-[1.1] max-w-4xl transition-all duration-1000 delay-200 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              Votre âme sœur, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-500 to-red-600 inline-block">
                {displayText}
              </span>
              <span className={`inline-block w-1 h-10 sm:h-14 bg-red-600 ml-1 align-middle transition-opacity ${isTypingDone ? 'animate-pulse' : 'opacity-100'}`}></span>
              , <br />
              vous attend ici.
            </h1>

            {/* Sous-titre avec transition fluide */}
            <p
              className={`text-base sm:text-lg text-black/80 max-w-2xl leading-relaxed font-medium transition-all duration-1000 delay-400 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              Arrêtez de perdre votre temps sur des applications qui ne respectent pas vos valeurs. Ici, on parle mariage. Sérieusement, dans le respect et la pudeur.
            </p>


            {/* Chiffres clés animés avec Compteur JS (CountUp) */}
            <div
              className={`pt-12 grid grid-cols-3 gap-8 sm:gap-16 border-t border-purple-100 max-w-xl w-full text-center transition-all duration-1000 delay-800 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <div className="space-y-1 transform transition hover:scale-110 duration-300 cursor-default">
                <p className="text-3xl sm:text-4xl font-black text-black">
                  +{membersCount.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-black/70 font-semibold">Membres actifs</p>
              </div>

              <div className="space-y-1 transform transition hover:scale-110 duration-300 cursor-default">
                <p className="text-3xl sm:text-4xl font-black text-black">
                  {verifiedCount}%
                </p>
                <p className="text-xs text-black/70 font-semibold">Profils vérifiés</p>
              </div>

              <div className="space-y-1 transform transition hover:scale-110 duration-300 cursor-default">
                <p className="text-3xl sm:text-4xl font-black text-black">
                  0€
                </p>
                <p className="text-xs text-black/70 font-semibold">Gratuit au début</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section : Pourquoi Mon HALAL avec cartes animées */}
      <section id="valeurs" className="py-24 bg-white text-black">
        <div className="w-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-100 px-3.5 py-1 rounded-full inline-block animate-pulse">Nos Valeurs</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Pas une app de rencontre. Une app de mariage.
            </h2>
            <p className="text-black/70 text-sm max-w-xl mx-auto font-medium">
              On a créé ce qu'on aurait aimé trouver : une plateforme rigoureuse, sans les dérives des applications généralistes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-purple-50/60 p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2 transition-all duration-300 space-y-4 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-200 text-purple-900 border border-purple-300 rounded-2xl flex items-center justify-center text-2xl font-bold group-hover:rotate-12 transition-transform duration-300">
                🛡️
              </div>
              <h3 className="text-xl font-black text-black">Zéro faux profil</h3>
              <p className="text-black/70 text-xs sm:text-sm leading-relaxed font-medium">
                Chaque inscription est vérifiée. Ici, vous discutez uniquement avec des personnes réelles aux intentions sincères.
              </p>
            </div>

            <div className="group bg-purple-50/60 p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-2xl hover:border-red-200 hover:-translate-y-2 transition-all duration-300 space-y-4 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 border border-red-200 rounded-2xl flex items-center justify-center text-2xl font-bold group-hover:rotate-12 transition-transform duration-300">
                🔒
              </div>
              <h3 className="text-xl font-black text-black">La pudeur sans compromis</h3>
              <p className="text-black/70 text-xs sm:text-sm leading-relaxed font-medium">
                Modération stricte des messages et espaces sécurisés. Votre vie privée et votre réputation sont protégées.
              </p>
            </div>

            <div className="group bg-purple-50/60 p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2 transition-all duration-300 space-y-4 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-200 text-purple-900 border border-purple-300 rounded-2xl flex items-center justify-center text-2xl font-bold group-hover:rotate-12 transition-transform duration-300">
                🇫🇷
              </div>
              <h3 className="text-xl font-black text-black">Ancrage en France</h3>
              <p className="text-black/70 text-xs sm:text-sm leading-relaxed font-medium">
                Trouvez des profils compatibles près de chez vous qui partagent votre quotidien et vos principes de vie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Comment ça marche */}
      <section id="etape" className="py-24 bg-purple-50/30 border-t border-purple-100 text-black">
        <div className="w-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-black text-black uppercase tracking-widest bg-purple-200 border border-purple-300 px-3.5 py-1 rounded-full inline-block">Processus simple</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              De l'inscription au Nikah.
            </h2>
            <p className="text-black/70 text-sm font-medium">Quatre étapes simples pour concrétiser votre projet de mariage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '1', title: 'Inscription rapide', desc: 'Créez votre profil gratuitement en quelques minutes.' },
              { num: '2', title: 'Découvrez les profils', desc: 'Parcourez les membres compatibles avec vos critères.' },
              { num: '3', title: 'Demande & Match', desc: 'Envoyez une demande de match en toute transparence.' },
              { num: '4', title: 'Échangez sereinement', desc: 'Discutez par message une fois le match accepté.' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 space-y-3 flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-purple-200 border border-purple-300 text-black font-black rounded-2xl flex items-center justify-center mx-auto text-sm shadow-sm group-hover:scale-110 group-hover:bg-purple-300 transition-all">
                  {step.num}
                </div>
                <h4 className="font-bold text-sm text-black">{step.title}</h4>
                <p className="text-black/70 text-xs leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation / Coran Section */}
      <section className="py-20 bg-purple-100/80 border-t border-purple-200 text-black text-center px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-red-600 font-extrabold">Sourate Ar-Rum, 21</p>
          <p className="text-xl sm:text-2xl font-serif italic text-black leading-relaxed">
            « Et parmi Ses signes, Il a créé de vous, pour vous, des épouses pour que vous trouviez la tranquillité auprès d'elles... »
          </p>
          <p className="text-xs text-black/70 pt-2 font-semibold">Qu’Allah facilite votre recherche et bénisse votre union.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-12 border-t border-purple-100 mt-auto">
        <div className="w-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-xl font-black text-black">
            Mon <span className="text-red-600">HALAL</span> 🇫🇷
          </div>
          <p className="text-xs text-black/60 font-medium">
            © 2026 Mon HALAL. Tous droits réservés. Plateforme dédiée au mariage sérieux.
          </p>
        </div>
      </footer>
    </div>
  );
}