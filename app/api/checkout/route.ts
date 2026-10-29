import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  // Initialisation à l'intérieur de la fonction (évite le crash au build)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

  try {
    // Ton code Stripe existant...
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}