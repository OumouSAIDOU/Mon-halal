import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const senderId = body.senderId || body.senderUserId;
    const receiverId = body.receiverId || body.receiverUserId;

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { success: false, error: 'Informations manquantes.' },
        { status: 400 }
      );
    }

    // 1. Vérifier si une demande existe déjà entre ces deux personnes (dans les deux sens)
    const [existing]: any = await db.query(
      `SELECT * FROM contact_requests 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?)`,
      [senderId, receiverId, receiverId, senderId]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Vous avez déjà une interaction ou une demande en cours avec ce membre.' },
        { status: 400 }
      );
    }

    // 2. Vérifier le quota des 5 demandes par jour pour les gratuits (optionnel mais propre)
    // (Tu peux laisser ou adapter selon ton système de quota)

    // 3. Insérer la demande de contact avec le statut 'pending'
    await db.query(
      'INSERT INTO contact_requests (sender_id, receiver_id, status) VALUES (?, ?, ?)',
      [senderId, receiverId, 'pending']
    );

    return NextResponse.json(
      { success: true, message: 'Demande de contact envoyée avec succès !' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur lors de la demande de contact:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur.' },
      { status: 500 }
    );
  }
}