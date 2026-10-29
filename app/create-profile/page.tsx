'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function CreateProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    birthDate: '',
    gender: 'homme',
    city: '',
    postalCode: '',
    religiosityLevel: 'Pratiquant(e)',
    bio: '',
    photos: '', // Chaîne séparée par des virgules pour stocker plusieurs photos
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Charger les données existantes du profil au démarrage
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
          setFormData({
            firstName: data.profile.first_name || '',
            birthDate: data.profile.birth_date ? data.profile.birth_date.split('T')[0] : '',
            gender: data.profile.gender ? (data.profile.gender === 'female' ? 'femme' : 'homme') : 'homme',
            city: data.profile.city || '',
            postalCode: data.profile.postal_code || '',
            religiosityLevel: data.profile.religiosity_level || 'Pratiquant(e)',
            bio: data.profile.bio || '',
            photos: data.profile.photos || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Transformer la chaîne de photos en tableau pour l'affichage
  const photoList = formData.photos
    ? formData.photos.split(',').filter((url) => url.trim() !== '')
    : [];

  // 2. Gérer l'upload d'une nouvelle photo (avec envoi du userId)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Utilisateur non connecté.');
      router.push('/login');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('userId', userId); // Indispensable pour que l'API sache à qui appartient l'upload

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      
      if (data.success) {
        // Ajouter la nouvelle URL à la liste existante
        const updatedPhotos = [...photoList, data.url].join(',');
        setFormData((prev) => ({ ...prev, photos: updatedPhotos }));
      } else {
        alert(data.error || 'Erreur lors du téléversement de l’image');
      }
    } catch (err) {
      console.error('Erreur upload :', err);
      alert('Erreur réseau lors de l’upload.');
    } finally {
      setUploading(false);
    }
  };

  // 3. Supprimer une photo de la liste
  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedList = photoList.filter((_, index) => index !== indexToRemove);
    setFormData((prev) => ({ ...prev, photos: updatedList.join(',') }));
  };

  // 4. Enregistrer tout le profil dans la base de données
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const res = await fetch('/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId, 10), ...formData }),
      });

      const data = await res.json();
      if (data.success) {
        router.refresh();
        router.push('/dashboard');
      } else {
        alert(data.error || 'Erreur lors de l’enregistrement');
      }
    } catch (err) {
      console.error('Erreur :', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <DashboardNavbar />

      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              📸 Vos Photos & Profil
            </h1>
            <p className="text-xs text-black/60 mt-1">
              Ajoutez des photos claires et respectueuses pour maximiser vos chances de match.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Galerie de photos */}
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-4">
              <label className="block text-xs font-bold text-black">
                Galerie photos ({photoList.length} photo(s))
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photoList.map((url, idx) => (
                  <div key={idx} className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-purple-200 group">
                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition"
                      title="Supprimer la photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Bouton d'ajout */}
                <label className="w-full h-32 rounded-2xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100/50 transition text-center p-2">
                  <span className="text-2xl">➕</span>
                  <span className="text-[10px] font-bold text-purple-900 mt-1">Ajouter</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploading && (
                <p className="text-[11px] text-purple-700 font-semibold animate-pulse">
                  Téléversement en cours...
                </p>
              )}
              <p className="text-[11px] text-black/50">
                Limites : 3 photos (Découverte), 10 photos (Premium), 15 photos (VIP).
              </p>
            </div>

            {/* Champs du formulaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                  className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Je suis un(e)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-black cursor-pointer"
                >
                  <option value="homme">👨 Homme</option>
                  <option value="femme">👩 Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Code postal</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                  className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Niveau de religiosité</label>
              <select
                value={formData.religiosityLevel}
                onChange={(e) => setFormData({ ...formData, religiosityLevel: e.target.value })}
                className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="Très pratiquant(e)">Très pratiquant(e)</option>
                <option value="Pratiquant(e)">Pratiquant(e)</option>
                <option value="Modéré(e)">Modéré(e)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">À propos de vous (Bio)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-purple-50 flex justify-end gap-3">
              <button
                type="submit"
                className="bg-black hover:bg-black/80 text-white font-bold px-8 py-3.5 rounded-2xl transition text-xs shadow-md"
              >
                Enregistrer les modifications 🚀
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}