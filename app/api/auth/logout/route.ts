import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  (await cookies()).set('admin_session', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}
