import { NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8000';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/v1/ai/console/agents`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `API error ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 503 });
  }
}
