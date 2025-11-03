'use server';

import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { users } from '../users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    const token = sign(userWithoutPassword, JWT_SECRET, { expiresIn: '1h' });

    const response = NextResponse.json({
      user: userWithoutPassword,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
