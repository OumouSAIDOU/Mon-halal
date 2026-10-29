'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';

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
  
  // État pour gérer l'index de la photo active dans le grand carrousel
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  // Récupérer le tableau de toutes les photos
  const photoList = myProfile?.photos
    ? myProfile.photos.split(',').map((p) => p.trim()).filter((p) => p !== '')
    : [];

  const activePhoto = photoList[currentPhotoIndex] || photoList[0] || '';

  // Fonctions pour naviguer dans le carrousel
  const nextPhoto = () => {
    if (photoList.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photoList.length);
    }
  };

  const prevPhoto = () => {
    if (photoList.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <DashboardNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-purple-100 shadow-sm">
            <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-black/60 text-sm font-medium">Chargement de votre profil...</p>
          </div>
        ) : !myProfile ? (
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-12 text-center space-y-5 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 bg-purple-100 text-black rounded-3xl flex items-center justify-center mx-auto text-2xl font-black shadow-inner border border-purple-200">
              !
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-black">Bienvenue sur Mon HALAL 🇫🇷</h1>
              <p className="text-sm text-black/70 max-w-md mx-auto leading-relaxed font-medium">
                Votre compte est bien actif, mais votre profil n'est pas encore complété. Créez-le dès maintenant pour commencer à découvrir des membres.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/create-profile"
                className="inline-flex items-center justify-center bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black font-extrabold px-8 py-3.5 rounded-2xl transition text-sm shadow-md"
              >
                Créer mon profil
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* EN-TÊTE PROFIL AVEC GRAND CARROUSEL DE PHOTOS */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden relative">
              <div className="h-16 bg-purple-100/60 border-b border-purple-100 relative flex items-center justify-end px-6">
                <div className="bg-white text-black text-xs font-bold px-3.5 py-1 rounded-full border border-purple-300 shadow-sm">
                  Membre Vérifié
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left w-full">
                  
                  {/* GRAND CONTENEUR PHOTO (Taille augmentée à w-40 h-40 ou w-48 h-48) */}
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-2 border-purple-200 shadow-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group">
                    {activePhoto ? (
                      <img src={activePhoto} alt={myProfile.first_name} className="w-full h-full object-cover transition-all duration-300" />
                    ) : (
                      <span className="text-black text-5xl font-black">{myProfile.first_name.charAt(0).toUpperCase()}</span>
                    )}

                    {/* Boutons Suivant / Précédent (visibles au survol si plusieurs photos) */}
                    {photoList.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Photo précédente"
                        >
                          ‹
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Photo suivante"
                        >
                          ›
                        </button>
                        
                        {/* Indicateur de position (ex: 1/3) */}
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
                          {currentPhotoIndex + 1} / {photoList.length}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <h1 className="text-2xl sm:text-3xl font-black text-black capitalize">
                        {myProfile.first_name}
                      </h1>
                      <span className="text-lg text-black/60 font-semibold">
                        • {calculateAge(myProfile.birth_date)} ans
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-black/70 flex items-center justify-center sm:justify-start gap-1">
                      <span>📍 {myProfile.city} ({myProfile.postal_code})</span>
                    </p>
                    {photoList.length > 1 && (
                      <p className="text-xs text-purple-800 font-semibold pt-1">
                        ✨ Utilisez les flèches sur la photo pour parcourir vos {photoList.length} photos.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Link
                    href="/create-profile"
                    className="bg-purple-200 hover:bg-purple-300 border border-purple-300 text-black px-6 py-3 rounded-2xl font-bold text-xs transition shadow-sm"
                  >
                    Modifier mon profil
                  </Link>
                </div>
              </div>
            </div>

            {/* SECTIONS INFOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-3xl p-7 border border-purple-100 shadow-sm space-y-4">
                <h3 className="text-base font-black text-black pb-2 border-b border-purple-100">
                  À propos de moi
                </h3>
                <p className="text-black/80 text-sm leading-relaxed whitespace-pre-line bg-purple-50/40 p-5 rounded-2xl border border-purple-100/60 min-h-[120px] font-medium">
                  {myProfile.bio || 'Aucune biographie rédigée.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-purple-100 shadow-sm space-y-5">
                <h3 className="text-base font-black text-black pb-2 border-b border-purple-100">
                  Mes Valeurs
                </h3>
                <div className="space-y-3">
                  <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/60">
                    <span className="text-xs font-bold text-black/50 block mb-1">Religiosité</span>
                    <span className="text-sm font-black text-black">{myProfile.religiosity_level}</span>
                  </div>
                  <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/60">
                    <span className="text-xs font-bold text-black/50 block mb-1">Genre</span>
                    <span className="text-sm font-black text-black capitalize">{myProfile.gender}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}