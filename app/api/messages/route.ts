import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Fonction utilitaire pour vérifier si deux utilisateurs ont un match accepté
async function checkIsAcceptedMatch(userA: string | number, userB: string | number) {
  const [rows]: any = await db.query(
    `SELECT id FROM likes 
     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
       AND status = 'accepted'`,
    [userA, userB, userB, userA]
  );
  return rows && rows.length > 0;
}

// GET : Récupérer les messages entre deux membres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
      return NextResponse.json({ success: false, error: 'Paramètres manquants' }, { status: 400 });
    }

    // Vérifier si le match est bien accepté
    const isAccepted = await checkIsAcceptedMatch(senderId, receiverId);
    if (!isAccepted) {
      return NextResponse.json({ success: false, error: 'Conversation non autorisée (match non accepté).' }, { status: 403 });
    }

    // 1. Marquer comme lus tous les messages reçus de cet expéditeur
    await db.query(
      `UPDATE messages SET is_read = 1 
       WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
      [receiverId, senderId]
    );

    // 2. Charger les messages de la conversation
    const [messages]: any = await db.query(
      `SELECT id, sender_id, receiver_id, content, created_at, is_read 
       FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
      [senderId, receiverId, receiverId, senderId]
    );

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Erreur GET messages :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

// POST : Envoyer un message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Données incomplètes' }, { status: 400 });
    }

    // Vérifier si le match est bien accepté avant d'envoyer
    const isAccepted = await checkIsAcceptedMatch(senderId, receiverId);
    if (!isAccepted) {
      return NextResponse.json({ success: false, error: 'Impossible d’envoyer un message : le match n’est pas accepté.' }, { status: 403 });
    }

    await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content, is_read, created_at) 
       VALUES (?, ?, ?, 0, NOW())`,
      [senderId, receiverId, content.trim()]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur POST message :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}