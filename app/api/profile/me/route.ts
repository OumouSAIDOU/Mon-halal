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

// POST : Créer ou Mettre à jour son propre profil (avec photos)
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

    const dbGender = gender === 'femme' ? 'female' : 'male';
    const parsedUserId = parseInt(userId, 10);

    // Vérifier si un profil existe déjà
    const [existing]: any = await db.query(
      `SELECT id FROM profiles WHERE user_id = ?`,
      [parsedUserId]
    );

    if (existing.length > 0) {
      // UPDATE strict (avec la photo)
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
          photos || '',
          parsedUserId,
        ]
      );
    } else {
      // INSERT (avec la photo)
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
          photos || '',
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST /api/profile/me :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur lors de l’enregistrement.' }, { status: 500 });
  }
}