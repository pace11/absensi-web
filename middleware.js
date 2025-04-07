import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')

  if (!session?.id && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!!session?.id && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
