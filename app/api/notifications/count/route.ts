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

    // Total des messages reçus NON LUS
    const [unreadMessages]: any = await db.query(
      `SELECT COUNT(id) AS total FROM messages WHERE receiver_id = ? AND is_read = 0`,
      [currentUserId]
    );

    return NextResponse.json({
      success: true,
      unreadMessages: unreadMessages[0]?.total || 0,
      matchesCount: 0,
    });
  } catch (error) {
    console.error('Erreur notifications count :', error);
    return NextResponse.json({ success: false, unreadMessages: 0, matchesCount: 0 });
  }
}