'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer'; // 👈 Import du Footer

interface MyProfile {
  first_name: string;
  birth_date: string;
  city: string;
  postal_code: string;
  religiosity_level: string;
  bio: string;
  gender: string;
  photos?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [myProfile, setMyProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return '';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    fetch(`/api/profile/me?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setMyProfile(data.profile);
        } else {
          setMyProfile(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      <DashboardNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <div className="inline-block w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Chargement de votre profil...</p>
          </div>
        ) : !myProfile ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center space-y-5 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner">
              📝
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900">Bienvenue sur Mon HALAL 🇫🇷</h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Votre compte est bien actif, mais votre profil n'est pas encore complété. Créez-le dès maintenant pour commencer à découvrir des membres.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/create-profile"
                className="inline-flex items-center justify-center bg-blue-950 hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-2xl transition text-sm shadow-md hover:shadow-lg"
              >
                Créer mon profil ✨
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden relative">
              <div className="h-16 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 relative flex items-center justify-end px-6">
                <div className="bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                  Membre Vérifié ✔️
                </div>
              </div>

              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-5 text-center md:text-left">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md bg-slate-900 flex items-center justify-center flex-shrink-0">
                    {myProfile.photos ? (
                      <img src={myProfile.photos} alt={myProfile.first_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-3xl font-black">{myProfile.first_name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-2.5">
                      <h1 className="text-xl font-black text-slate-900 capitalize">
                        {myProfile.first_name}
                      </h1>
                      <span className="text-base text-slate-500 font-semibold">
                        • {calculateAge(myProfile.birth_date)} ans
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 flex items-center justify-center md:justify-start gap-1">
                      <span>📍</span> {myProfile.city} ({myProfile.postal_code})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Link
                    href="/create-profile"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition shadow-sm"
                  >
                    ✏️ Modifier mon profil
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  📝 À propos de moi
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/80 p-5 rounded-2xl border border-slate-100 min-h-[120px]">
                  {myProfile.bio || 'Aucune biographie rédigée.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  ✨ Mes Valeurs
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Religiosité</span>
                    <span className="text-sm font-bold text-slate-900">🙏 {myProfile.religiosity_level}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Genre</span>
                    <span className="text-sm font-bold text-slate-900 capitalize">👤 {myProfile.gender}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* 👈 VRAI FOOTER PLACÉ TOUT EN BAS */}
      <Footer />
    </div>
  );
}