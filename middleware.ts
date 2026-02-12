import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



// Search engine bot detection
const BOT_USER_AGENTS = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver',
    'linkedinbot', 'twitterbot', 'whatsapp', 'telegrambot',
    'applebot', 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
    'petalbot', 'bytespider', 'gptbot',
]

function isBot(userAgent: string | null): boolean {
    if (!userAgent) return false
    const ua = userAgent.toLowerCase()
    return BOT_USER_AGENTS.some(bot => ua.includes(bot))
}

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl
    const userAgent = request.headers.get('user-agent')

    // ============================================================
    // 0. BOTS — allow search engines to crawl all public pages
    // ============================================================
    if (isBot(userAgent)) {
        return NextResponse.next()
    }

    const hasTechAccess = request.cookies.get('tech_access')?.value === '1'

    // ============================================================
    // 2. TECH GUYS — full access to everything, no auth needed
    // ============================================================
    if (hasTechAccess) {
        return NextResponse.next()
    }

    // ============================================================
    // 3. PUBLIC USERS — can ONLY access /signup and /signin
    // ============================================================
    if (pathname === '/signup' || pathname.startsWith('/signup/') ||
        pathname === '/signin' || pathname.startsWith('/signin/')) {
        return NextResponse.next()
    }

    // Everything else → redirect to /signup
    return NextResponse.redirect(new URL('/signup', request.url))
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|videos|sitemap.xml|robots.txt).*)',
    ],
}
