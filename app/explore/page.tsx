'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';

interface Profile {
  id: number;
  user_id: number;
  first_name: string;
  birth_date: string;
  city: string;
  postal_code: string;
  religiosity_level: string;
  bio: string;
  photos?: string;
  gender: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [requireProfile, setRequireProfile] = useState(false);
  const [selectedProfileModal, setSelectedProfileModal] = useState<Profile | null>(null);

  // États pour la modale explicative de Match
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [pendingTargetId, setPendingTargetId] = useState<number | null>(null);
  const [pendingTargetName, setPendingTargetName] = useState('');

  // États pour la recherche et le filtre
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReligiosity, setSelectedReligiosity] = useState('Tous');

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

    // Interroger l'API explore
    fetch(`/api/explore?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.requireProfile) {
          setRequireProfile(true);
        } else if (data.success && data.profiles) {
          setRequireProfile(false);
          setProfiles(data.profiles);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement exploration :', err);
        setLoading(false);
      });
  }, [router]);

  // Filtrer les profils selon la barre de recherche et le filtre de religiosité
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReligiosity =
      selectedReligiosity === 'Tous' || profile.religiosity_level === selectedReligiosity;

    return matchesSearch && matchesReligiosity;
  });

  // Déclenché au clic sur le bouton "Matcher"
  const handleOpenMatchModal = (receiverUserId: number, receiverName: string) => {
    setPendingTargetId(receiverUserId);
    setPendingTargetName(receiverName);
    setShowMatchModal(true);
  };

  // Action CONFIRMER LE MATCH (envoi de la requête)
  const handleConfirmMatch = async () => {
    if (!pendingTargetId) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          senderUserId: parseInt(userId, 10), 
          receiverUserId: pendingTargetId 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProfiles((prev) => prev.filter((p) => p.user_id !== pendingTargetId));
        setShowMatchModal(false);
        setSelectedProfileModal(null);
        setPendingTargetId(null);

        if (data.isMatch) {
          alert("🎉 C'est un Match réciproque ! Retrouvez ce membre dans vos matchs.");
          router.push('/matches');
        } else {
          alert(`Votre demande de match a bien été envoyée à ${pendingTargetName} !`);
        }
      } else {
        alert(data.error || "Impossible d'envoyer la demande de match.");
      }
    } catch (err) {
      console.error('Erreur réseau match :', err);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  };

  // Action PASSER
  const handlePass = (receiverUserId: number) => {
    setProfiles((prev) => prev.filter((p) => p.user_id !== receiverUserId));
    setSelectedProfileModal(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans relative pb-16 md:pb-0">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        
        {/* CHARGEMENT */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <div className="inline-block w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Chargement...</p>
          </div>
        ) : requireProfile ? (
          /* NOUVEAU COMPTE SANS PROFIL : ACCÈS BLOQUÉ */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-sm space-y-5 max-w-xl mx-auto my-10">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
              📝
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Créez votre profil pour commencer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Pour des raisons de sécurité et pour vous afficher uniquement des profils compatibles selon votre genre, vous devez d'abord compléter votre profil.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center bg-blue-950 text-white px-8 py-3.5 rounded-2xl font-extrabold text-xs hover:bg-blue-900 transition shadow-md"
              >
                Compléter mon profil ✨
              </Link>
            </div>
          </div>
        ) : (
          /* COMPTE AVEC PROFIL COMPLÉTÉ : AFFICHAGE DES PROFILS COMPATIBLES */
          <>
            {/* En-tête de la page & Filtres */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    ✨ Explorer les Profils
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Découvrez des célibataires partageant vos valeurs et votre vision de l'engagement.
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-950 px-4 py-2 rounded-2xl text-xs font-bold border border-blue-100 self-start sm:self-auto">
                  {filteredProfiles.length} profil{filteredProfiles.length > 1 ? 's' : ''} disponible{filteredProfiles.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Barre de recherche & Filtre religiosité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="relative w-full min-w-0">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher par prénom ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950 transition"
                  />
                </div>

                <div className="w-full min-w-0">
                  <select
                    value={selectedReligiosity}
                    onChange={(e) => setSelectedReligiosity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950 transition text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="Tous">Tous les niveaux de religiosité</option>
                    <option value="Très pratiquant(e)">🙏 Très pratiquant(e)</option>
                    <option value="Pratiquant(e)">🙏 Pratiquant(e)</option>
                    <option value="Modéré(e)">🙏 Modéré(e)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste Vide ou Grille de profils */}
            {filteredProfiles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucun profil trouvé</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {profiles.length === 0
                    ? "Il n'y a pas d'autres profils disponibles pour le moment."
                    : "Essayez de modifier vos critères de recherche ou de réinitialiser le filtre."}
                </p>
                {profiles.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedReligiosity('Tous');
                    }}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition shadow-sm"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between relative"
                  >
                    {/* Photo de profil */}
                    <div className="h-64 bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-900 relative flex items-center justify-center overflow-hidden">
                      {profile.photos ? (
                        <img src={profile.photos} alt={profile.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-6xl font-black opacity-90">
                          {profile.first_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full font-medium border border-white/10">
                        📍 {profile.city} ({profile.postal_code})
                      </div>
                    </div>

                    {/* Infos du profil */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-black text-slate-900 capitalize">
                          {profile.first_name}, <span className="text-slate-500 font-normal">{calculateAge(profile.birth_date)} ans</span>
                        </h3>
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] px-3 py-1 rounded-xl font-semibold">
                          🙏 {profile.religiosity_level || 'Pratiquant(e)'}
                        </span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handlePass(profile.user_id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl font-bold transition text-xs flex items-center justify-center"
                          title="Passer"
                        >
                          <span>✕ Passer</span>
                        </button>

                        <button
                          onClick={() => setSelectedProfileModal(profile)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-bold transition text-xs flex items-center justify-center"
                        >
                          <span>👁️ Profil</span>
                        </button>

                        <button
                          onClick={() => handleOpenMatchModal(profile.user_id, profile.first_name)}
                          className="bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-2xl font-bold transition text-xs shadow-sm flex items-center justify-center gap-1"
                        >
                          <span>❤️</span> Matcher
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODALE DE DÉTAIL DU PROFIL */}
      {selectedProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="h-56 bg-slate-900 relative overflow-hidden flex-shrink-0">
              {selectedProfileModal.photos ? (
                <img src={selectedProfileModal.photos} alt={selectedProfileModal.first_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-950 text-white text-6xl font-black">
                  {selectedProfileModal.first_name.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm backdrop-blur-md transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <h2 className="text-xl font-black text-slate-900 capitalize">
                  {selectedProfileModal.first_name}, {calculateAge(selectedProfileModal.birth_date)} ans
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  📍 {selectedProfileModal.city} ({selectedProfileModal.postal_code})
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-950 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-100">
                  🙏 {selectedProfileModal.religiosity_level || 'Pratiquant(e)'}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">À propos</h4>
                <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedProfileModal.bio || "Aucune description renseignée."}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={() => handlePass(selectedProfileModal.user_id)}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs transition"
              >
                Passer ✕
              </button>
              <button
                onClick={() => handleOpenMatchModal(selectedProfileModal.user_id, selectedProfileModal.first_name)}
                className="flex-1 bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-2xl font-bold text-xs shadow-md transition text-center flex items-center justify-center gap-2"
              >
                <span>❤️ Matcher ce profil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'EXPLICATION & CONFIRMATION DE MATCH */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-2">
              <span className="text-4xl">💌</span>
              <h3 className="text-lg font-black text-slate-900">
                Envoyer une demande de match à {pendingTargetName} ?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed pt-2">
                Votre demande de match est envoyée. Si <span className="font-semibold text-slate-800">{pendingTargetName}</span> accepte, vous retrouverez ce match dans votre page dédiée.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMatchModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmMatch}
                className="flex-1 bg-blue-950 hover:bg-blue-900 text-white font-bold py-3 rounded-2xl transition text-xs shadow-md"
              >
                Confirmer l'envoi 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}