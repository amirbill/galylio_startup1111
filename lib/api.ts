// API Configuration
// Direct connection to backend (avoids Vercel rewrite issues)

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://back-27em.onrender.com/api/v1";

// Normalize: strip trailing slash, then check for /api/v1
const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
export const API_URL = normalizedBase.endsWith('/api/v1')
    ? normalizedBase
    : `${normalizedBase}/api/v1`;
