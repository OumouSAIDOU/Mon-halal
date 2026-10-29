import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Vérifier si les champs sont remplis
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    // 2. Vérifier si l'utilisateur existe déjà dans la base
    const [existingUsers]: any = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cet email est déjà utilisé.' },
        { status: 400 }
      );
    }

    // 3. Hacher le mot de passe (sécurité maximale)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Insérer l'utilisateur avec les valeurs par défaut de la Formule Découverte (Gratuit)
    const [result]: any = await db.query(
      `INSERT INTO users (email, password_hash, subscription, maxPhotos, contactRequestsCount, aiAdviceCount) 
       VALUES (?, ?, 'FREE', 3, 0, 0)`,
      [email, hashedPassword]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Inscription réussie !',
        userId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne.' },
      { status: 500 }
    );
  }
}