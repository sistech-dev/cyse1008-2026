import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from 'src/lib/firebase/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // 1. Verify with Stripe directly
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    const stripeConfirmed =
      session.status === 'complete' &&
      (session.payment_status === 'paid' ||
        (typeof session.payment_intent === 'object' &&
          session.payment_intent?.status === 'succeeded'));

    if (!stripeConfirmed) {
      // Payment not yet confirmed by Stripe — tell the client to keep polling
      return NextResponse.json({
        ok: true,
        paid: false,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        orderId: session.metadata?.orderId ?? null,
        customer_email: session.customer_email ?? null,

      });
    }

    // 2. Stripe says paid — ensure the Firestore order reflects this.
    //    The webhook does the same write; this is a safe idempotent fallback
    //    so the success page doesn't depend on the webhook having arrived first.
    const orderId = session.metadata?.orderId ?? null;
    if (orderId) {
      const db = getDb();
      const orderRef = db.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();

      if (orderSnap.exists && orderSnap.data()?.status !== 'paid') {
        await orderRef.update({
          status: 'paid',
          paidAt: FieldValue.serverTimestamp(),
          stripeSessionId: session.id,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      paid: true,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      orderId,
      customer_email: session.customer_email ?? session.customer_details?.email ?? null,

    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Stripe error' }, { status: 400 });
  }
}
