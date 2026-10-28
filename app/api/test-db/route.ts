import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    return NextResponse.json({ success: true, message: 'Connexion à la base de données réussie !', rows });
  } catch (error) {
    console.error('Erreur SQL:', error);
    return NextResponse.json({ success: false, error: 'Impossible de se connecter à la base de données' }, { status: 500 });
  }
}