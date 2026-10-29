import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get('userId');

    if (!userIdStr) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non spécifié' },
        { status: 400 }
      );
    }

    const currentUserId = parseInt(userIdStr, 10);

    // 1. Récupérer le profil de l'utilisateur connecté
    const [myProfileRows]: any = await db.query(
      'SELECT gender, first_name FROM profiles WHERE user_id = ?',
      [currentUserId]
    );

    if (!myProfileRows || myProfileRows.length === 0 || !myProfileRows[0].first_name) {
      return NextResponse.json({
        success: true,
        requireProfile: true,
        profiles: [],
      });
    }

    const myGender = (myProfileRows[0].gender || '').toString().toLowerCase().trim();
    const isFemale = myGender.includes('femme') || myGender.includes('female') || myGender === 'f';
    const isMale = !isFemale && (myGender.includes('homme') || myGender.includes('male') || myGender === 'm' || myGender === 'h');

    // 2. Construction de la requête pour récupérer les profils compatibles (SANS exclusion)
    let query = `
      SELECT p.id, p.user_id, p.first_name, p.birth_date, p.city, p.postal_code, p.religiosity_level, p.bio, p.photos, p.gender
      FROM profiles p
      WHERE p.user_id != ?
    `;
    const queryParams: any[] = [currentUserId];

    if (isFemale) {
      query += ` AND (
        (LOWER(p.gender) LIKE '%homme%' OR LOWER(p.gender) LIKE '%male%' OR LOWER(p.gender) = 'm' OR LOWER(p.gender) = 'h')
        AND LOWER(p.gender) NOT LIKE '%female%'
        AND LOWER(p.gender) NOT LIKE '%femme%'
      )`;
    } else if (isMale) {
      query += ` AND (LOWER(p.gender) LIKE '%femme%' OR LOWER(p.gender) LIKE '%female%' OR LOWER(p.gender) = 'f')`;
    } else {
      return NextResponse.json({ success: true, requireProfile: false, profiles: [] });
    }

    query += ` ORDER BY p.id DESC`;

    const [profiles]: any = await db.query(query, queryParams);

    // 3. Pour chaque profil, on récupère son statut exact (accepted, pending ou null)
    const profilesWithStatus = await Promise.all(
      profiles.map(async (profile: any) => {
        const [relationRows]: any = await db.query(
          `SELECT status FROM contact_requests 
           WHERE (sender_id = ? AND receiver_id = ?) 
              OR (sender_id = ? AND receiver_id = ?)`,
          [currentUserId, profile.user_id, profile.user_id, currentUserId]
        );

        let status = null;
        if (relationRows && relationRows.length > 0) {
          status = relationRows[0].status; // 'accepted', 'pending', etc.
        }

        return {
          ...profile,
          status: status || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      requireProfile: false,
      profiles: profilesWithStatus || [],
    });
  } catch (error) {
    console.error('Erreur serveur /api/explore:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur.' },
      { status: 500 }
    );
  }
}