import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur non identifié' }, { status: 400 });
    }

    // Sélection du prix selon la formule
    const isYearly = plan === 'yearly';
    const amount = isYearly ? 4999 : 999; // 49.99€ ou 9.99€ en centimes
    const planName = isYearly ? 'Abonnement Annuel Mon HALAL' : 'Abonnement Mensuel Mon HALAL';
    const interval = isYearly ? 'year' : 'month';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: planName,
              description: 'Accès Premium illimité à la plateforme Mon HALAL',
            },
            unit_amount: amount,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur Stripe Checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}