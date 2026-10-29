'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';

interface MatchItem {
  like_id: number;
  status: 'pending' | 'accepted' | 'declined';
  sender_id: number;
  receiver_id: number;
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
  const [receivedMatches, setReceivedMatches] = useState<MatchItem[]>([]);
  const [sentMatches, setSentMatches] = useState<MatchItem[]>([]);
  
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProfileModal, setSelectedProfileModal] = useState<MatchItem | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

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

    // 1. Vérifier le statut Premium
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setIsPremium(Boolean(data.user.is_premium));
        }
      })
      .catch((err) => console.error('Erreur chargement profil :', err));

    // 2. Récupérer les demandes (Reçues et Envoyées)
    fetch(`/api/matches?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Données reçues de /api/matches :", data);
          setReceivedMatches(data.received || []);
          setSentMatches(data.sent || []);
        } else {
          console.error("Erreur renvoyée par l'API matches :", data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur réseau chargement des matchs :', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleResponse = async (likeId: number, action: 'accepted' | 'declined') => {
    try {
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likeId, action }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur réponse match:', err);
    }
  };

  const getOtherUserId = (item: MatchItem) => item.user_id || item.id || item.receiver_id;

  const pendingReceived = receivedMatches.filter((m) => m.status === 'pending');
  const pendingSent = sentMatches.filter((m) => {
    if (m.status !== 'pending') return false;
    const targetId = getOtherUserId(m);
    return !pendingReceived.some((r) => getOtherUserId(r) === targetId);
  });

  const combinedHistory = [
    ...receivedMatches.filter((m) => m.status !== 'pending'),
    ...sentMatches.filter((m) => m.status !== 'pending')
  ];

  const uniqueHistoryMap = new Map<number, MatchItem>();
  combinedHistory.forEach((item) => {
    const targetId = getOtherUserId(item);
    if (!uniqueHistoryMap.has(targetId)) {
      uniqueHistoryMap.set(targetId, item);
    } else {
      const existing = uniqueHistoryMap.get(targetId)!;
      if (item.status === 'accepted' && existing.status !== 'accepted') {
        uniqueHistoryMap.set(targetId, item);
      }
    }
  });
  const allHistory = Array.from(uniqueHistoryMap.values());

  const acceptedCount = allHistory.filter((m) => m.status === 'accepted').length;
  const FREE_MATCH_LIMIT = 3;
  const hasReachedLimit = !isPremium && acceptedCount >= FREE_MATCH_LIMIT;
  const totalPending = pendingReceived.length + pendingSent.length;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans relative">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              💌 Vos Demandes & Matchs
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Suivez vos interactions et accédez à vos discussions en toute simplicité.
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shadow-sm">
            <span>✨</span> {acceptedCount} match{acceptedCount > 1 ? 's' : ''} actif{acceptedCount > 1 ? 's' : ''}
          </div>
        </div>

        {/* Onglets */}
        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl max-w-sm shadow-inner">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⏳ En attente</span>
            {totalPending > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {totalPending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-250 flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🗂️ Historique & Matchs</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {allHistory.length}
            </span>
          </button>
        </div>

        {/* Bannière Premium */}
        {hasReachedLimit && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Offre de Lancement
              </span>
              <h2 className="text-base sm:text-lg font-black">
                Limite de 3 matchs gratuits atteinte !
              </h2>
            </div>
            <Link
              href="/pricing"
              className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow transition whitespace-nowrap"
            >
              Passer Premium 🚀
            </Link>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <div className="inline-block w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Chargement...</p>
          </div>
        ) : activeTab === 'pending' ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {totalPending === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner">
                  ✨
                </div>
                <h3 className="text-lg font-black text-slate-900">Aucune demande en attente</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tout est à jour ! Vous n'avez pas de nouvelle demande en suspens pour le moment.
                </p>
              </div>
            ) : (
              <>
                {/* Reçues */}
                {pendingReceived.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                      📥 Reçues ({pendingReceived.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {pendingReceived.map((item) => (
                        <div key={item.like_id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                          <div className="h-60 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                            {item.photos ? (
                              <img src={item.photos} alt={item.first_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-5xl font-black">{item.first_name?.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="p-5 space-y-4">
                            <div>
                              <h3 className="text-lg font-black text-slate-900 capitalize">
                                {item.first_name}, <span className="text-slate-500 font-normal">{calculateAge(item.birth_date)} ans</span>
                              </h3>
                              <p className="text-xs text-amber-600 font-bold mt-1">⏳ Souhaite entrer en contact avec vous</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => handleResponse(item.like_id, 'declined')}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition text-xs"
                              >
                                Refuser ✕
                              </button>
                              <button
                                onClick={() => handleResponse(item.like_id, 'accepted')}
                                className="bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold transition text-xs shadow-sm"
                              >
                                Accepter 🎉
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Envoyées */}
                {pendingSent.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                      📤 Envoyées ({pendingSent.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {pendingSent.map((item) => (
                        <div key={item.like_id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                          <div className="h-60 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                            {item.photos ? (
                              <img src={item.photos} alt={item.first_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-5xl font-black">{item.first_name?.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="p-5 space-y-4">
                            <div>
                              <h3 className="text-lg font-black text-slate-900 capitalize">
                                {item.first_name}, <span className="text-slate-500 font-normal">{calculateAge(item.birth_date)} ans</span>
                              </h3>
                              <p className="text-xs text-slate-400 font-medium mt-1">⏳ En attente de réponse du membre</p>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                              <button
                                onClick={() => setSelectedProfileModal(item)}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-bold transition text-xs text-center"
                              >
                                Voir le profil 👁️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {allHistory.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner">
                  🗂️
                </div>
                <h3 className="text-lg font-black text-slate-900">Aucun historique</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allHistory.map((item) => {
                  const unread = Number(item.unread_count) || 0;
                  const isAccepted = item.status === 'accepted';

                  return (
                    <div key={item.like_id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between relative">
                      {unread > 0 && isAccepted && (
                        <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10 animate-pulse">
                          {unread} msg non lu
                        </span>
                      )}
                      <div className="h-60 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                        {item.photos ? (
                          <img src={item.photos} alt={item.first_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-5xl font-black">{item.first_name?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-900 capitalize">
                            {item.first_name}, <span className="text-slate-500 font-normal">{calculateAge(item.birth_date)} ans</span>
                          </h3>
                          <div className="mt-1.5">
                            {isAccepted ? (
                              <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-xl border border-emerald-200">
                                ✅ Match accepté
                              </span>
                            ) : (
                              <span className="inline-block bg-slate-100 text-slate-500 text-[11px] font-bold px-3 py-1 rounded-xl">
                                ✕ Refusée / Archivée
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setSelectedProfileModal(item)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-bold transition text-xs"
                          >
                            👁️ Profil
                          </button>
                          {isAccepted ? (
                            <Link
                              href="/messages"
                              className="bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold transition text-xs shadow-sm text-center flex items-center justify-center gap-1.5"
                            >
                              💬 Message
                            </Link>
                          ) : (
                            <div className="bg-slate-50 text-slate-400 py-3 rounded-2xl font-bold text-xs flex items-center justify-center">
                              Archivé
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modale Profil */}
      {selectedProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="h-64 bg-slate-900 relative overflow-hidden flex-shrink-0">
              {selectedProfileModal.photos ? (
                <img src={selectedProfileModal.photos} alt={selectedProfileModal.first_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-6xl font-black">
                  {selectedProfileModal.first_name?.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
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
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-xs shadow-md transition text-center flex items-center justify-center gap-2"
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