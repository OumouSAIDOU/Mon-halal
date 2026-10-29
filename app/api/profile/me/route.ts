import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET : Récupérer son propre profil (avec photos)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdStr = searchParams.get('userId');

    if (!userIdStr) {
      return NextResponse.json({ success: false, error: 'Utilisateur non spécifié' }, { status: 400 });
    }

    const currentUserId = parseInt(userIdStr, 10);

    const [profiles]: any = await db.query(
      `SELECT id, user_id, first_name, birth_date, city, postal_code, religiosity_level, bio, gender, photos 
       FROM profiles 
       WHERE user_id = ?`,
      [currentUserId]
    );

    if (profiles.length === 0) {
      return NextResponse.json({ success: true, profile: null });
    }

    return NextResponse.json({ success: true, profile: profiles[0] });
  } catch (error) {
    console.error('Erreur GET /api/profile/me :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

// POST : Créer ou Mettre à jour son propre profil (avec contrôle strict des photos)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, firstName, birthDate, gender, city, postalCode, religiosityLevel, bio, photos } = body;

    if (!userId || !firstName || !birthDate || !gender || !city || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants.' },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId, 10);

    // 1. Récupérer le quota de photos autorisé (maxPhotos) dans la table users
    const [users]: any = await db.query(
      `SELECT maxPhotos, subscription FROM users WHERE id = ?`,
      [parsedUserId]
    );

    const maxPhotos = users.length > 0 ? users[0].maxPhotos : 3;
    const subscription = users.length > 0 ? users[0].subscription : 'FREE';

    // 2. Compter le nombre de photos soumises
    const photosList = photos
      ? photos.split(',').filter((url: string) => url.trim() !== '')
      : [];

    if (photosList.length > maxPhotos) {
      return NextResponse.json(
        {
          success: false,
          error: `Votre formule (${subscription}) est limitée à ${maxPhotos} photo(s). Veuillez en supprimer une avant d'en ajouter une nouvelle ou passez à l'offre supérieure.`,
        },
        { status: 403 }
      );
    }

    const dbGender = gender === 'femme' ? 'female' : 'male';

    // 3. Vérifier si un profil existe déjà
    const [existing]: any = await db.query(
      `SELECT id FROM profiles WHERE user_id = ?`,
      [parsedUserId]
    );

    if (existing.length > 0) {
      // UPDATE
      await db.query(
        `UPDATE profiles 
         SET first_name = ?, birth_date = ?, gender = ?, city = ?, postal_code = ?, religiosity_level = ?, bio = ?, photos = ?
         WHERE user_id = ?`,
        [
          firstName,
          birthDate,
          dbGender,
          city,
          postalCode,
          religiosityLevel || 'Pratiquant(e)',
          bio || '',
          photosList.join(','),
          parsedUserId,
        ]
      );
    } else {
      // INSERT
      await db.query(
        `INSERT INTO profiles (user_id, first_name, birth_date, gender, city, postal_code, religiosity_level, bio, photos)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parsedUserId,
          firstName,
          birthDate,
          dbGender,
          city,
          postalCode,
          religiosityLevel || 'Pratiquant(e)',
          bio || '',
          photosList.join(','),
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST /api/profile/me :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur lors de l’enregistrement.' }, { status: 500 });
  }
}