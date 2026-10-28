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

    const [profiles]: any = await db.query(
      `SELECT p.id, p.user_id, p.first_name, p.birth_date, p.city, p.postal_code, p.religiosity_level, p.bio, p.gender
       FROM profiles p
       WHERE p.user_id != ?
       ORDER BY p.id DESC`,
      [currentUserId]
    );

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur.' },
      { status: 500 }
    );
  }
}