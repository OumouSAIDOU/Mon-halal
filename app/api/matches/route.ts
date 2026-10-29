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

    // 1. Demandes REÇUES (avec décompte des messages non lus)
    const [receivedRows]: any = await db.query(
      `SELECT 
          l.id as like_id, 
          COALESCE(l.status, 'pending') as status, 
          l.created_at, 
          p.id, 
          p.user_id, 
          p.first_name, 
          p.birth_date, 
          p.city, 
          p.postal_code, 
          p.religiosity_level, 
          p.bio,
          p.photos,
          p.gender,
          (
            SELECT COUNT(m.id) 
            FROM messages m 
            WHERE m.sender_id = p.user_id 
              AND m.receiver_id = ? 
              AND (m.is_read = 0 OR m.is_read IS NULL)
          ) AS unread_count
        FROM contact_requests l
        JOIN profiles p ON l.sender_id = p.user_id
        WHERE l.receiver_id = ?
        ORDER BY l.id DESC`,
      [currentUserId, currentUserId]
    );

    // 2. Demandes ENVOYÉES (avec décompte des messages non lus)
    const [sentRows]: any = await db.query(
      `SELECT 
          l.id as like_id, 
          COALESCE(l.status, 'pending') as status, 
          l.created_at, 
          p.id, 
          p.user_id, 
          p.first_name, 
          p.birth_date, 
          p.city, 
          p.postal_code, 
          p.religiosity_level, 
          p.bio,
          p.photos,
          p.gender,
          (
            SELECT COUNT(m.id) 
            FROM messages m 
            WHERE m.sender_id = p.user_id 
              AND m.receiver_id = ? 
              AND (m.is_read = 0 OR m.is_read IS NULL)
          ) AS unread_count
        FROM contact_requests l
        JOIN profiles p ON l.receiver_id = p.user_id
        WHERE l.sender_id = ?
        ORDER BY l.id DESC`,
      [currentUserId, currentUserId]
    );

    return NextResponse.json({ 
      success: true, 
      received: receivedRows || [], 
      sent: sentRows || [] 
    });
  } catch (error) {
    console.error('Erreur GET /api/matches :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Accepter ou Refuser une demande
export async function PATCH(request: NextRequest) {
  try {
    const { likeId, action } = await request.json(); // action = 'accepted' ou 'declined'

    if (!likeId || !['accepted', 'declined'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action invalide ou ID manquant' },
        { status: 400 }
      );
    }

    await db.query('UPDATE contact_requests SET status = ? WHERE id = ?', [action, likeId]);

    return NextResponse.json({ success: true, status: action });
  } catch (error) {
    console.error('Erreur PATCH /api/matches :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}