import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token');

  // Public paths that don't require authentication
  const isPublicPath = pathname === '/login' || pathname.startsWith('/api/auth/login') || pathname === '/api/auth/me';

  // If user has token and tries to access login, redirect to products
  if (authToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  // If user doesn't have token and tries to access protected route, redirect to login
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public/).*)',
  ],
};
