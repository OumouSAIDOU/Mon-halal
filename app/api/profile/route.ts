import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdStr = searchParams.get('userId');

    if (!userIdStr) {
      return NextResponse.json({ success: false, error: 'UserId manquant' }, { status: 400 });
    }

    const currentUserId = parseInt(userIdStr, 10);

    // 1. Obtenir le genre de l'utilisateur
    const [myProfiles]: any = await db.query(
      `SELECT gender FROM profiles WHERE user_id = ?`,
      [currentUserId]
    );

    const myGender = myProfiles.length > 0 ? myProfiles[0].gender : 'male';
    const targetGender = myGender === 'female' ? 'male' : 'female';

    // 2. Obtenir les profils non likés + indication si ils nous ont liké (has_liked_me)
    const [profiles]: any = await db.query(
      `SELECT 
         p.id, 
         p.user_id, 
         p.first_name, 
         p.birth_date, 
         p.city, 
         p.postal_code, 
         p.religiosity_level, 
         p.bio, 
         p.gender,
         IF(l_in.id IS NOT NULL, 1, 0) AS has_liked_me
       FROM profiles p
       LEFT JOIN likes l_out ON l_out.sender_id = ? AND l_out.receiver_id = p.user_id
       LEFT JOIN likes l_in ON l_in.sender_id = p.user_id AND l_in.receiver_id = ?
       WHERE p.user_id != ?
         AND p.gender = ?
         AND l_out.id IS NULL`,
      [currentUserId, currentUserId, currentUserId, targetGender]
    );

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('Erreur GET /api/profile :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}