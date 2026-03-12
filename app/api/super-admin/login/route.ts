// Next.js API route for proxying super-admin login requests
// Place this file at: app/api/super-admin/login/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await fetch('https://pgthikana.in/api/super-admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    let data;
    const contentType = apiRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await apiRes.json();
    } else {
      // fallback: try to parse as JSON, else return as text
      const text = await apiRes.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, message: 'Invalid response from upstream', raw: text };
      }
    }
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Proxy error', error: (err as Error).message }, { status: 500 });
  }
}
