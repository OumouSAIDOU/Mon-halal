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

    // 2. Chercher l'utilisateur dans la base de données
    const [users]: any = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 3. Vérifier le mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // Connexion réussie
    return NextResponse.json(
      {
        success: true,
        message: 'Connexion réussie !',
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne.' },
      { status: 500 }
    );
  }
}