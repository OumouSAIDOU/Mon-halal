import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Supporte à la fois senderUserId / receiverUserId ET senderId / receiverId pour éviter tout bug
    const senderUserId = body.senderUserId || body.senderId;
    const receiverUserId = body.receiverUserId || body.receiverId;

    if (!senderUserId || !receiverUserId) {
      return NextResponse.json(
        { success: false, error: 'Informations manquantes.' },
        { status: 400 }
      );
    }

    // 1. Enregistrer le like dans la table des likes
    await db.query(
      'INSERT IGNORE INTO likes (sender_id, receiver_id, is_match) VALUES (?, ?, 0)',
      [senderUserId, receiverUserId]
    );

    // 2. Vérifier si l'autre personne t'a déjà liké (Match réciproque)
    const [rows]: any = await db.query(
      'SELECT * FROM likes WHERE sender_id = ? AND receiver_id = ?',
      [receiverUserId, senderUserId]
    );

    // Sécurité pour s'assurer de bien récupérer le tableau de résultats
    const reverseLike = Array.isArray(rows) ? rows : [rows];
    let isMatch = false;

    // 3. S'il y a un match réciproque
    if (reverseLike && reverseLike.length > 0 && reverseLike[0]) {
      isMatch = true;
      
      // Mettre is_match à 1 dans la table likes
      await db.query(
        'UPDATE likes SET is_match = 1 WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
        [senderUserId, receiverUserId, receiverUserId, senderUserId]
      );

      // Ajouter également dans la table matches si elle existe
      try {
        await db.query(
          'INSERT IGNORE INTO matches (user1_id, user2_id) VALUES (?, ?)',
          [Math.min(senderUserId, receiverUserId), Math.max(senderUserId, receiverUserId)]
        );
      } catch (e) {
        // Ignorer si la table matches n'est pas configurée exactement ainsi
      }
    }

    return NextResponse.json(
      { success: true, isMatch, message: isMatch ? 'Match !' : 'Like enregistré' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur lors du like:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur.' },
      { status: 500 }
    );
  }
}