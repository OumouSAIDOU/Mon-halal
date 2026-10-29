import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mysql from 'mysql2/promise';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// Connexion MySQL
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'mon_halal',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Erreur Signature Webhook Stripe : ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Traitement du paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (userId) {
      try {
        await db.execute(
          `UPDATE users SET is_premium = 1, stripe_customer_id = ?, stripe_subscription_id = ? WHERE id = ?`,
          [customerId, subscriptionId, userId]
        );
        console.log(`Utilisateur ID ${userId} est maintenant Premium !`);
      } catch (dbErr) {
        console.error('Erreur mise à jour MySQL :', dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}