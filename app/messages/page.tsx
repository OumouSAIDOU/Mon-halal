'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';

interface Match {
  id: number;
  user_id: number;
  first_name: string;
  city: string;
  unread_count?: number;
  status: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger la liste des matchs (uniquement les acceptés)
  const fetchMatches = async (userId: number, preserveSelection = true) => {
    try {
      const res = await fetch(`/api/matches?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        // Combiner les reçus et les envoyés, et filtrer strictement sur status === 'accepted'
        const receivedAccepted = (data.received || []).filter((m: any) => m.status === 'accepted');
        const sentAccepted = (data.sent || []).filter((m: any) => m.status === 'accepted');

        // Fusionner sans doublons basés sur user_id
        const map = new Map();
        [...receivedAccepted, ...sentAccepted].forEach((m) => map.set(m.user_id, m));
        const acceptedList = Array.from(map.values());

        setMatches(acceptedList);

        // Sélectionner le premier par défaut si rien n'est sélectionné
        if (!selectedMatch && acceptedList.length > 0) {
          setSelectedMatch(acceptedList[0]);
        } else if (selectedMatch && preserveSelection) {
          const updatedCurrent = acceptedList.find((m: any) => m.user_id === selectedMatch.user_id);
          if (updatedCurrent) setSelectedMatch(updatedCurrent);
        }
      }
    } catch (err) {
      console.error('Erreur chargement matchs :', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Initialisation au chargement de la page
  useEffect(() => {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      router.push('/login');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    setCurrentUserId(userId);
    fetchMatches(userId, false);
  }, [router]);

  // Charger les messages du match actif et marquer comme lu
  const fetchMessages = async (receiverId: number, isSilent = false) => {
    if (!currentUserId) return;

    if (!isSilent) setLoadingMessages(true);

    try {
      const res = await fetch(`/api/messages?senderId=${currentUserId}&receiverId=${receiverId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        
        // Mettre immédiatement le compteur de ce match à 0 dans l'interface locale
        setMatches((prev) =>
          prev.map((m) => (m.user_id === receiverId ? { ...m, unread_count: 0 } : m))
        );
      }
    } catch (err) {
      console.error('Erreur chargement messages :', err);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  // Effet quand on change de match ou pour le polling en temps réel (toutes les 3s)
  useEffect(() => {
    if (selectedMatch && currentUserId) {
      fetchMessages(selectedMatch.user_id);

      const interval = setInterval(() => {
        fetchMessages(selectedMatch.user_id, true);
        fetchMatches(currentUserId, true);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedMatch?.user_id, currentUserId]);

  // Envoi d'un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || !currentUserId) return;

    const textToSend = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedMatch.user_id,
          content: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchMessages(selectedMatch.user_id, true);
      } else {
        alert(data.error || 'Impossible d’envoyer le message.');
      }
    } catch (err) {
      console.error('Erreur envoi message :', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex flex-col">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-3 min-h-[650px]">
          
          {/* COLONNE GAUCHE : LISTE DES MATCHS ACCEPTÉS & NOTIFS */}
          <div className="border-r border-slate-100 flex flex-col bg-slate-50/40">
            <div className="p-5 border-b border-slate-100 bg-white">
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                💬 Discussions <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">Mon HALAL</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">Vos matchs confirmés</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loadingMatches ? (
                <div className="p-8 text-center text-slate-400 text-xs">Chargement des discussions...</div>
              ) : matches.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="text-3xl">❤️</div>
                  <p className="text-xs text-slate-500 font-medium">
                    Aucun match accepté pour le moment. Attendez qu'un membre accepte votre demande !
                  </p>
                </div>
              ) : (
                matches.map((match) => {
                  const isSelected = selectedMatch?.user_id === match.user_id;
                  const unreadCount = Number(match.unread_count) || 0;

                  return (
                    <button
                      key={match.id}
                      onClick={() => {
                        setSelectedMatch(match);
                        fetchMessages(match.user_id);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl transition flex items-center justify-between space-x-3 ${
                        isSelected
                          ? 'bg-blue-950 text-white shadow-md'
                          : 'hover:bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-950'
                          }`}
                        >
                          {match.first_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate capitalize">{match.first_name}</h3>
                          <p className={`text-xs truncate ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                            📍 {match.city}
                          </p>
                        </div>
                      </div>

                      {/* PASTILLE ROUGE DE NOTIFICATION NON LU */}
                      {unreadCount > 0 && !isSelected && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* COLONNE DROITE : TCHAT */}
          <div className="md:col-span-2 flex flex-col bg-white">
            {selectedMatch ? (
              <>
                <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-950 text-white flex items-center justify-center font-bold">
                      {selectedMatch.first_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm capitalize">{selectedMatch.first_name}</h2>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Match accepté ✅
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {loadingMessages ? (
                    <div className="text-center py-10 text-slate-400 text-xs">Chargement...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16 space-y-2">
                      <div className="text-4xl">👋</div>
                      <p className="text-xs text-slate-500 font-medium">
                        C'est un Match réciproque ! Envoyez un premier message à <span className="font-bold text-slate-800 capitalize">{selectedMatch.first_name}</span>.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                              isMe
                                ? 'bg-blue-950 text-white rounded-br-none'
                                : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Écrire à ${selectedMatch.first_name}...`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl transition text-xs shadow-md"
                  >
                    Envoyer 🚀
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl">
                  💬
                </div>
                <h3 className="text-base font-bold text-slate-900">Vos messages</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Sélectionnez un match accepté à gauche pour commencer à échanger en toute confiance.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}