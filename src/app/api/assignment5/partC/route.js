import { NextResponse } from 'next/server';
import { getDb } from 'src/lib/firebase/firebase-admin';

export async function GET() {
  try {
    const db = getDb();

    // ✅ Use 'vendors' collection
    const snapshot = await db.collection('vendors').get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ✅ Count active vendors
    let activeCount = 0;
    for (const item of items) {
      if (item.isActive) {
        activeCount++;
      }
    }

    console.log(`[GET /api/assignment5/partC] found ${items.length} vendors`);

    return NextResponse.json({
      count: items.length,
      activeCount,
      items: items.map((i) => ({
        id: i.id,
        name: i.name || 'Untitled',
      })),
    });

  } catch (error) {
    console.error('[GET /api/assignment5/partC] error =', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}