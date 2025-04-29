import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";



const publicRoutes = ["/login", "/sign-up",];

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtected = !publicRoutes.includes(path)

    const cookieStore = await cookies()
    const cookie = cookieStore.get('session')?.value
    let session = null;

    if (cookie) {
        session = await decrypt(cookie);
    }


    if (!session?.userId && isProtected) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session?.userId && !isProtected) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();

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