import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type } = body; // type = 'matches' ou 'messages'

    if (!userId || !type) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const column = type === 'matches' ? 'last_seen_matches' : 'last_seen_messages';

    await db.query(
      `UPDATE users SET ${column} = NOW() WHERE id = ?`,
      [userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur marquage lu :', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}