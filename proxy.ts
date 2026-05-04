import { NextResponse, NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin and /api/responses
  if (path.startsWith('/admin') || path === '/api/responses') {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated') {
      // If it's an API request, return 401
      if (path.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      
      // If it's a page request, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/responses/:path*'],
};
