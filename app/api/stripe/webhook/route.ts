import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  // Initialisation de Stripe ici pour éviter le crash au build sur Netlify
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

  // Connexion MySQL
  const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    // ... le reste de ta configuration
  });

  try {
    // Ton code existant...
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur Webhook:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}