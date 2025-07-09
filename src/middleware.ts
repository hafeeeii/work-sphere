import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { rootDomain } from "./lib/utils";



const publicRoutes = ["/login", "/sign-up",];
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicRoutes.includes(path)
  const subdomain = extractSubdomain(request);

  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  let session = null;
  const businessId = cookieStore.get('businessId')?.value

  const response = NextResponse.next();

  if (subdomain) {
    response.cookies.set("subdomain", subdomain, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }


  if (cookie) {
    session = await decrypt(cookie);
  }

  const isLoggedIn = !!session?.userId;
  //  Not logged in + protected route
  if (!isLoggedIn && !isPublic) {
    if (path !== '/login') {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Logged in + visiting public page (e.g., /login or /sign-up)
  if (isLoggedIn && isPublic) {
    const redirectUrl = businessId ? "/dashboard" : "/business";
    if (path !== redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  //  Logged in + protected route but no business found
  if (isLoggedIn && !businessId) {
    if (path !== '/business') {
      return NextResponse.redirect(new URL("/business", request.url));
    }
  }


  if (businessId) {
    response.cookies.set("businessId", businessId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;

}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}