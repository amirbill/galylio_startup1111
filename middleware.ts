import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ---- ACCESS CONTROL ----
// Tech team secret: append ?access=<SECRET> to any URL to unlock the full site
const TECH_ACCESS_SECRET = 'tech1111tn'

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl

    // ============================================================
    // 1. TECH ACCESS: ?access=<secret> sets a cookie → full site access
    // ============================================================
    if (searchParams.get('access') === TECH_ACCESS_SECRET) {
        const cleanUrl = new URL(pathname, request.url)
        const res = NextResponse.redirect(cleanUrl)
        res.cookies.set('tech_access', '1', {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            sameSite: 'lax',
        })
        return res
    }

    const hasTechAccess = request.cookies.get('tech_access')?.value === '1'

    // ============================================================
    // 2. TECH GUYS — full access to everything, no auth needed
    // ============================================================
    if (hasTechAccess) {
        return NextResponse.next()
    }

    // ============================================================
    // 3. PUBLIC USERS — can ONLY access /signup, nothing else
    // ============================================================
    if (pathname === '/signup' || pathname.startsWith('/signup/')) {
        return NextResponse.next()
    }

    // Everything else → redirect to /signup
    return NextResponse.redirect(new URL('/signup', request.url))
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|videos).*)',
    ],
}
