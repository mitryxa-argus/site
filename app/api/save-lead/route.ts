import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const BASE44_APP_ID = process.env.BASE44_APP_ID || '69bba705f823e1f29a3170af';
    const BASE44_API_KEY = process.env.BASE44_API_KEY || '';

    // Save to Base44 CRM Lead entity
    const res = await fetch(
      `https://api.base44.com/v1/apps/${BASE44_APP_ID}/entities/Lead`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': BASE44_API_KEY,
        },
        body: JSON.stringify({
          full_name: body.full_name || '',
          email: body.email || '',
          phone: body.phone || '',
          source: 'Argus Chat',
          status: 'New',
          notes: body.notes || '',
          service_interest: body.service_interest || 'AI Decision Platform',
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Base44 API error:', err);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    console.error('Save lead error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
