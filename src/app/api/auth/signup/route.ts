'use server';
import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { users } from '../users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const newUser = {
      id: String(users.length + 1),
      displayName: name,
      email: email,
      password: password,
    };
    users.push(newUser);
    
    const { password: userPassword, ...userWithoutPassword } = newUser;

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
      { message: 'An error occurred during sign up' },
      { status: 500 }
    );
  }
}
