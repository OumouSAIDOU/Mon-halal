'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';

interface MatchItem {
  like_id: number;
  status: 'pending' | 'accepted' | 'declined';
  id: number;
  user_id: number;
  first_name: string;
  birth_date: string;
  city: string;
  postal_code: string;
  religiosity_level: string;
  bio: string;
  photos?: string;
  unread_count?: number;
}

export default function MatchesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedMatches, setReceivedMatches] = useState<MatchItem[]>([]);
  const [sentMatches, setSentMatches] = useState<MatchItem[]>([]);
  
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProfileModal, setSelectedProfileModal] = useState<MatchItem | null>(null);

  // Calculer l'âge à partir de la date de naissance
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

  const fetchData = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    // 1. Récupérer le profil pour vérifier le statut Premium
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setIsPremium(Boolean(data.user.is_premium));
        }
      })
      .catch((err) => console.error('Erreur chargement profil :', err));

    // 2. Récupérer les demandes reçues et envoyées
    fetch(`/api/matches?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReceivedMatches(data.received || []);
          setSentMatches(data.sent || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement des matchs :', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Répondre à une demande reçue (Accepter ou Refuser)
  const handleResponse = async (likeId: number, action: 'accepted' | 'declined') => {
    try {
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeId, action }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData(); // Rafraîchir les listes
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur réponse match:', err);
    }
  };

  // Compter les demandes en attente dans les reçues
  const pendingReceivedCount = receivedMatches.filter((m) => m.status === 'pending').length;

  // Limite de 3 matchs acceptés pour les utilisateurs gratuits
  const acceptedMatchesCount = receivedMatches.filter((m) => m.status === 'accepted').length + sentMatches.filter((m) => m.status === 'accepted').length;
  const FREE_MATCH_LIMIT = 3;
  const hasReachedLimit = !isPremium && acceptedMatchesCount >= FREE_MATCH_LIMIT;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans relative">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full space-y-6">
        
        {/* En-tête de la page */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              💌 Vos Demandes & Matchs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Gérez vos interactions en toute transparence et respect.
            </p>
          </div>
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-xs font-bold border border-red-100">
            {acceptedMatchesCount} match{acceptedMatchesCount > 1 ? 's' : ''} actif{acceptedMatchesCount > 1 ? 's' : ''}
          </div>
        </div>

        {/* Onglets Reçues / Envoyées */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl max-w-md">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'received'
                ? 'bg-white text-blue-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📥 Demandes reçues {pendingReceivedCount > 0 && `(${pendingReceivedCount})`}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'sent'
                ? 'bg-white text-blue-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📤 Demandes envoyées ({sentMatches.length})
          </button>
        </div>

        {/* BANNIÈRE D'INCITATION PREMIUM SI LIMITE ATTEINTE */}
        {hasReachedLimit && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ✨ Offre de Lancement
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Vous avez atteint la limite de 3 matchs gratuits !
              </h2>
              <p className="text-xs text-amber-50 max-w-xl">
                Passez au statut Premium pour débloquer des matchs illimités et multiplier vos chances de trouver votre moitié (dès 4,16€/mois).
              </p>
            </div>
            <Link
              href="/pricing"
              className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow transition whitespace-nowrap"
            >
              Passer Premium 🚀
            </Link>
          </div>
        )}

        {/* CONTENU PRINCIPAL */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <div className="inline-block w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Chargement des interactions...</p>
          </div>
        ) : activeTab === 'received' ? (
          /* SECTION DEMANDES REÇUES */
          receivedMatches.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                📭
              </div>
              <h3 className="text-xl font-bold text-slate-900">Aucune demande reçue</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Continuez d'explorer des profils et d'envoyer des demandes pour susciter des intérêts !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {receivedMatches.map((item) => {
                const unread = Number(item.unread_count) || 0;
                return (
                  <div
                    key={item.like_id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between relative"
                  >
                    {/* Badge message non lu */}
                    {unread > 0 && item.status === 'accepted' && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10 animate-pulse">
                        {unread} message{unread > 1 ? 's' : ''} non lu{unread > 1 ? 's' : ''}
                      </span>
                    )}

                    <div className="h-64 bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-900 relative flex items-center justify-center overflow-hidden">
                      {item.photos ? (
                        <img src={item.photos} alt={item.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-6xl font-black opacity-90">
                          {item.first_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black text-slate-900 capitalize">
                            {item.first_name}, <span className="text-slate-500 font-normal">{calculateAge(item.birth_date)} ans</span>
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">📍 {item.city} ({item.postal_code})</p>

                        {/* Statut de la demande reçue */}
                        <div className="mt-2">
                          {item.status === 'pending' && (
                            <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-xl border border-amber-200">
                              ⏳ En attente de votre réponse
                            </span>
                          )}
                          {item.status === 'accepted' && (
                            <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-xl border border-emerald-200">
                              ✅ Match accepté
                            </span>
                          )}
                          {item.status === 'declined' && (
                            <span className="inline-block bg-slate-100 text-slate-500 text-[11px] font-bold px-3 py-1 rounded-xl">
                              ✕ Demande refusée
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions selon le statut */}
                      {item.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleResponse(item.like_id, 'declined')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition text-xs"
                          >
                            Refuser
                          </button>
                          <button
                            onClick={() => handleResponse(item.like_id, 'accepted')}
                            className="bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-2xl font-bold transition text-xs shadow-sm"
                          >
                            Accepter 🎉
                          </button>
                        </div>
                      ) : item.status === 'accepted' ? (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setSelectedProfileModal(item)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-bold transition text-xs flex items-center justify-center gap-1"
                          >
                            <span>👁️ Profil</span>
                          </button>
                          <Link
                            href="/messages"
                            className="bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-2xl font-bold transition text-xs shadow-sm flex items-center justify-center gap-1"
                          >
                            <span>💬 Message</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-100 text-center">
                          <button
                            onClick={() => setSelectedProfileModal(item)}
                            className="text-xs text-slate-500 font-semibold hover:underline"
                          >
                            Voir le profil
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* SECTION DEMANDES ENVOYÉES */
          sentMatches.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                📤
              </div>
              <h3 className="text-xl font-bold text-slate-900">Aucune demande envoyée</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Allez sur la page Explorer et cliquez sur "Matcher" pour contacter des membres.
              </p>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center bg-blue-950 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-blue-900 transition shadow-sm"
                >
                  Explorer des profils ✨
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sentMatches.map((item) => {
                const unread = Number(item.unread_count) || 0;
                return (
                  <div
                    key={item.like_id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between relative"
                  >
                    {/* Badge message non lu */}
                    {unread > 0 && item.status === 'accepted' && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10 animate-pulse">
                        {unread} message{unread > 1 ? 's' : ''} non lu{unread > 1 ? 's' : ''}
                      </span>
                    )}

                    <div className="h-64 bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-900 relative flex items-center justify-center overflow-hidden">
                      {item.photos ? (
                        <img src={item.photos} alt={item.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-6xl font-black opacity-90">
                          {item.first_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 capitalize">
                          {item.first_name}, <span className="text-slate-500 font-normal">{calculateAge(item.birth_date)} ans</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">📍 {item.city} ({item.postal_code})</p>

                        {/* Statut transparent de la demande envoyée */}
                        <div className="mt-2">
                          {item.status === 'pending' && (
                            <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-xl border border-amber-200">
                              ⏳ En attente de réponse
                            </span>
                          )}
                          {item.status === 'accepted' && (
                            <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-xl border border-emerald-200">
                              ✅ Match accepté !
                            </span>
                          )}
                          {item.status === 'declined' && (
                            <span className="inline-block bg-rose-50 text-rose-700 text-[11px] font-bold px-3 py-1 rounded-xl border border-rose-200">
                              ✕ Demande refusée
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Boutons d'action selon si c'est accepté ou non */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedProfileModal(item)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-bold transition text-xs flex items-center justify-center gap-1"
                        >
                          <span>👁️ Profil</span>
                        </button>

                        {item.status === 'accepted' ? (
                          <Link
                            href="/messages"
                            className="bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-2xl font-bold transition text-xs shadow-sm flex items-center justify-center gap-1"
                          >
                            <span>💬 Message</span>
                          </Link>
                        ) : (
                          <div className="bg-slate-50 text-slate-400 py-3 rounded-2xl font-bold text-xs flex items-center justify-center">
                            En attente
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>

      {/* MODALE POUR VOIR TOUTES LES INFORMATIONS DU PROFIL */}
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
                onClick={() => setSelectedProfileModal(null)}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs transition"
              >
                Fermer
              </button>
              {selectedProfileModal.status === 'accepted' && (
                <Link
                  href="/messages"
                  className="flex-1 bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-2xl font-bold text-xs shadow-md transition text-center flex items-center justify-center gap-2"
                >
                  <span>💬 Discuter</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}