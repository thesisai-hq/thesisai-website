import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const apiKey = SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !apiKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const hasIOS = Boolean(body.hasIOS);
  const source = String(body.source ?? 'unknown').trim();

  if (!name || !email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid name or email' }, { status: 400 });
  }

  const payload = {
    name,
    email,
    has_ios: hasIOS,
    source,
  };

  const endpoint = `${SUPABASE_URL}/rest/v1/waitlist_entries?on_conflict=email`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: errorText || 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
