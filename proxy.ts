import { NextResponse, NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin areas and sensitive APIs
  if (path.startsWith('/admin') || path.startsWith('/api/admin') || path === '/api/responses') {
    // ALLOW GET requests to question/section APIs for public survey use
    const isPublicGet = request.method === 'GET' && 
      (path === '/api/admin/questions' || path === '/api/admin/sections');

    if (isPublicGet) {
      return NextResponse.next();
    }

    const session = request.cookies.get('admin_session');

    if (!session || !session.value || session.value.length < 32) {
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
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/responses/:path*'],
};
