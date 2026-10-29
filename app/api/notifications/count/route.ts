import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdStr = searchParams.get('userId');

    if (!userIdStr) {
      return NextResponse.json({ success: false, unreadMessages: 0, matchesCount: 0 });
    }

    const currentUserId = parseInt(userIdStr, 10);

    // 1. Total des messages reçus NON LUS
    const [unreadRows]: any = await db.query(
      `SELECT COUNT(id) AS total FROM messages WHERE receiver_id = ? AND is_read = 0`,
      [currentUserId]
    );

    // 2. Total des demandes de contact REÇUES qui sont EN ATTENTE (status = 'pending')
    const [matchesRows]: any = await db.query(
      `SELECT COUNT(id) AS total FROM contact_requests WHERE receiver_id = ? AND status = 'pending'`,
      [currentUserId]
    );

    return NextResponse.json({
      success: true,
      unreadMessages: unreadRows[0]?.total || 0,
      matchesCount: matchesRows[0]?.total || 0, // 👈 Remplace le 0 ici par le vrai total calculé
    });
  } catch (error) {
    console.error('Erreur notifications count :', error);
    return NextResponse.json({ success: false, unreadMessages: 0, matchesCount: 0 });
  }
}