'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function CreateProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    birthDate: '',
    gender: 'homme', // Par défaut
    city: '',
    postalCode: '',
    religiosityLevel: 'Pratiquant(e)',
    bio: '',
    photos: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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
            gender: data.profile.gender ? data.profile.gender.toLowerCase() : 'homme',
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

  // Gérer l'upload de l'image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, photos: data.url }));
      } else {
        alert(data.error || 'Erreur lors de l’upload de l’image');
      }
    } catch (err) {
      console.error('Erreur upload :', err);
    } finally {
      setUploading(false);
    }
  };

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="inline-block w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      <DashboardNavbar />

      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              📸 Votre Photo & Profil
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ajoutez une photo claire pour inspirer confiance et maximiser vos chances de match.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Photo de profil */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden flex items-center justify-center relative border-2 border-slate-300 shadow-inner flex-shrink-0">
                {formData.photos ? (
                  <img src={formData.photos} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-slate-400">👤</span>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <label className="block text-xs font-bold text-slate-700">Photo de profil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-950 file:text-white hover:file:bg-blue-900 cursor-pointer"
                />
                {uploading && <p className="text-[11px] text-blue-600 font-semibold animate-pulse">Téléversement en cours...</p>}
                <p className="text-[11px] text-slate-400">Formats acceptés : JPG, PNG.</p>
              </div>
            </div>

            {/* Champs du formulaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>

              {/* AJOUT DU SÉLECTEUR DE GENRE ICI */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Je suis un(e)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950 font-medium text-slate-700 cursor-pointer"
                >
                  <option value="homme">👨 Homme</option>
                  <option value="femme">👩 Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Code postal</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Niveau de religiosité</label>
              <select
                value={formData.religiosityLevel}
                onChange={(e) => setFormData({ ...formData, religiosityLevel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950"
              >
                <option value="Très pratiquant(e)">Très pratiquant(e)</option>
                <option value="Pratiquant(e)">Pratiquant(e)</option>
                <option value="Modéré(e)">Modéré(e)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">À propos de vous (Bio)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="submit"
                className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-2xl transition text-xs shadow-md"
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