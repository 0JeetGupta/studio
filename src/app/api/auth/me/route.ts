'use server';

import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = verify(token.value, JWT_SECRET);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
