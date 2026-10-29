'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'question',
    message: '',
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'question', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: "Comment garantissez-vous que les profils sont 100% réels ?",
      a: "Chaque inscription fait l'objet d'une vérification manuelle par notre équipe de modération. Nous vérifions l'authenticité des profils avant toute validation."
    },
    {
      q: "La plateforme est-elle vraiment adaptée au mariage halal ?",
      a: "Oui, c'est notre unique vocation. Les fonctionnalités sont pensées pour respecter la pudeur, les valeurs islamiques et le sérieux du projet de mariage."
    },
    {
      q: "Est-ce gratuit pour s'inscrire ?",
      a: "L'inscription et la création de profil sont totalement gratuites. Vous pouvez découvrir la plateforme et consulter les membres sans frais."
    },
    {
      q: "Comment contacter l'équipe en cas de problème ?",
      a: "Vous pouvez utiliser le formulaire sur cette page ou envoyer directement un email à support@monhalal.fr. Notre équipe répond en moins de 24h."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-purple-200 selection:text-black overflow-x-hidden">
      
      {/* Navbar fixe */}
      <Navbar />

      {/* Hero Contact */}
      <section className="relative bg-white text-black pt-36 pb-16 lg:pt-48 lg:pb-24 border-b border-purple-100 overflow-hidden">
        
        {/* Orbes d'ambiance */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <div
            className={`inline-flex items-center gap-2 bg-purple-100 border border-purple-300 text-black text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transform transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
            }`}
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse"></span>
            Assistance & Support Client
          </div>

          <h1
            className={`text-4xl sm:text-6xl font-black text-black tracking-tight leading-tight transition-all duration-1000 delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Besoin d’aide ou une <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-500 to-red-600">
              question sur Mon HALAL ?
            </span>
          </h1>

          <p
            className={`text-base sm:text-lg text-black/70 max-w-2xl mx-auto font-medium transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Notre équipe est à votre écoute pour vous accompagner dans votre démarche de recherche de mariage en toute sérénité.
          </p>
        </div>
      </section>

      {/* Section Formulaire + FAQ */}
      <section className="py-16 sm:py-24 bg-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Formulaire de Contact (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-purple-100 shadow-xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-black">Envoyez-nous un message</h2>
              <p className="text-black/60 text-sm font-medium">Remplissez le formulaire ci-dessous et nous vous répondrons très rapidement.</p>
            </div>

            {submitted ? (
              <div className="bg-purple-100 border border-purple-300 text-black p-6 rounded-2xl text-center space-y-2 animate-in zoom-in duration-300">
                <span className="text-3xl">✅</span>
                <h3 className="font-extrabold text-lg">Message envoyé avec succès !</h3>
                <p className="text-xs text-black/70 font-medium">Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black uppercase tracking-wider">Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-black placeholder-black/40 focus:outline-none focus:border-purple-400 focus:bg-white text-sm font-semibold transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black uppercase tracking-wider">Adresse Email</label>
                    <input
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-black placeholder-black/40 focus:outline-none focus:border-purple-400 focus:bg-white text-sm font-semibold transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">Sujet de votre demande</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-black focus:outline-none focus:border-purple-400 focus:bg-white text-sm font-semibold transition"
                  >
                    <option value="question">Question générale</option>
                    <option value="account">Problème de compte / Inscription</option>
                    <option value="report">Signaler un comportement</option>
                    <option value="other">Autre demande</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">Votre message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Expliquez-nous comment nous pouvons vous aider..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-black placeholder-black/40 focus:outline-none focus:border-purple-400 focus:bg-white text-sm font-semibold transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-200 via-purple-300 to-pink-200 hover:from-purple-300 hover:to-pink-300 border border-purple-300 text-black py-4 rounded-2xl font-black text-sm transition-all transform hover:-translate-y-0.5 shadow-md shadow-purple-200/50 flex items-center justify-center gap-2"
                >
                  <span>Envoyer le message</span>
                  <span>🚀</span>
                </button>
              </form>
            )}
          </div>

          {/* Section FAQ accordéon (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-100 px-3.5 py-1 rounded-full inline-block">Foire aux questions</span>
              <h2 className="text-2xl sm:text-3xl font-black text-black">Questions fréquentes</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left font-bold text-sm text-black flex justify-between items-center hover:bg-purple-50/50 transition"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-purple-600 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-black/70 font-medium leading-relaxed border-t border-purple-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Encadré contact direct */}
            <div className="p-6 bg-gradient-to-br from-purple-100/80 via-white to-purple-50 rounded-3xl border border-purple-200 space-y-3">
              <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                <span>📧</span> Contact Direct
              </h3>
              <p className="text-xs text-black/70 font-semibold leading-relaxed">
                Vous préférez envoyer un e-mail directement ? Contactez notre équipe de support à :
              </p>
              <a href="mailto:support@monhalal.fr" className="text-sm font-black text-red-600 hover:underline inline-block">
                support@monhalal.fr
              </a>
            </div>

          </div>

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