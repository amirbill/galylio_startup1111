# 🔍 SEO Guide — 1111.tn

This document contains all the steps required to make your website rank on the first pages of Google and other search engines.

---

## ✅ What Has Already Been Done (Code Changes)

### 1. Sitemap (`/sitemap.xml`)
- Created `app/sitemap.ts` — auto-generates an XML sitemap at build/runtime
- Includes all static pages: `/`, `/signin`, `/signup`, `/products`, `/para`, `/pricing`, `/solutions`, `/coming-soon`
- Dynamically fetches product IDs from the API (`/products/sitemap` and `/para/sitemap` endpoints)
- **Action needed**: Create two API endpoints on your backend:
  - `GET /api/v1/products/sitemap` → returns `[{ "id": "...", "updated_at": "..." }, ...]`
  - `GET /api/v1/para/sitemap` → returns `[{ "id": "...", "updated_at": "..." }, ...]`

### 2. Robots.txt (`/robots.txt`)
- Created `app/robots.ts` — tells search engines which pages to crawl
- Allows all public pages, blocks `/dashboard/`, `/profile/`, `/api/`, `/_next/`
- Points to the sitemap URL

### 3. SEO Metadata on Every Page
- **Root layout** (`app/layout.tsx`): Global metadata with title template, description, Open Graph, Twitter Cards, JSON-LD structured data
- **Products** (`app/products/page.tsx`): Static metadata for the listing page
- **Product Detail** (`app/products/[id]/page.tsx`): Dynamic `generateMetadata` — title includes product name + price
- **Para** (`app/para/page.tsx`): Static metadata for parapharmacie listing
- **Para Detail** (`app/para/[id]/page.tsx`): Dynamic `generateMetadata` — product name + price
- **Pricing** (`app/pricing/page.tsx`): Static metadata for pricing plans
- **Solutions** (`app/solutions/page.tsx`): Static metadata
- **Sign In / Sign Up**: Layout-based metadata via `layout.tsx`
- **Dashboard / Profile**: Marked as `noindex` (private pages)

### 4. Middleware Updated for Search Engine Bots
- Updated `middleware.ts` to detect Googlebot and other crawlers
- Bots bypass authentication restrictions and can crawl all public pages
- `sitemap.xml` and `robots.txt` are excluded from middleware

### 5. SSR (Server-Side Rendering)
- All public pages are already Server Components (no `"use client"` on page files that fetch data)
- Product and para pages fetch data on the server with `async` functions
- Auth pages (signin/signup) use `"use client"` but have metadata via layout files
- Pricing and solutions pages are static server components (best for SEO)

---

## 📋 Steps You Need to Do Manually

### Step 1: Set Your Production Domain
Add this environment variable in Vercel (or your hosting):
```
NEXT_PUBLIC_SITE_URL=https://1111.tn
```

### Step 2: Create the OG Image
Create an Open Graph image for social media sharing:
- Size: **1200×630 pixels**
- Save it as `front/public/images/og-image.png`
- This image appears when your site is shared on Facebook, Twitter, LinkedIn, WhatsApp, etc.

### Step 3: Register with Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add your property: `https://1111.tn`
3. Verify ownership using one of these methods:
   - **HTML tag** (recommended): Copy the verification code and replace `YOUR_GOOGLE_VERIFICATION_CODE` in `app/layout.tsx`
   - DNS record
   - HTML file upload
4. Once verified:
   - Submit your sitemap: `https://1111.tn/sitemap.xml`
   - Request indexing for your main pages

### Step 4: Register with Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. Import from Google Search Console or add manually
3. Submit sitemap: `https://1111.tn/sitemap.xml`

### Step 5: Create Backend Sitemap Endpoints
Add these two endpoints to your FastAPI backend:

```python
# In your products router
@router.get("/sitemap")
async def get_products_sitemap(db=Depends(get_db)):
    """Return all product IDs for sitemap generation"""
    products = await db.products.find(
        {},
        {"_id": 1, "updated_at": 1}
    ).to_list(length=None)
    return [
        {"id": str(p["_id"]), "updated_at": p.get("updated_at", "")}
        for p in products
    ]

# In your para router
@router.get("/sitemap")
async def get_para_sitemap(db=Depends(get_db)):
    """Return all para product IDs for sitemap generation"""
    products = await db.para_products.find(
        {},
        {"_id": 1, "updated_at": 1}
    ).to_list(length=None)
    return [
        {"id": str(p["_id"]), "updated_at": p.get("updated_at", "")}
        for p in products
    ]
```

### Step 6: Set Up Google Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a GA4 property for `1111.tn`
3. Get your Measurement ID (e.g., `G-XXXXXXXXXX`)
4. Add the Google Analytics script to your `app/layout.tsx` `<head>`:

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Step 7: Verify Your SEO Setup
After deploying, verify everything works:
1. Visit `https://1111.tn/sitemap.xml` — should show XML sitemap
2. Visit `https://1111.tn/robots.txt` — should show robots rules
3. Use [Google Rich Results Test](https://search.google.com/test/rich-results) to validate structured data
4. Use [PageSpeed Insights](https://pagespeed.web.dev/) to check performance
5. Use [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) to verify mobile compatibility

---

## 🚀 Additional SEO Tips to Rank Higher

### Content Strategy
- **Blog**: Consider adding a `/blog` section with articles about price comparisons, buying guides, and product reviews in French/Arabic
- **Category pages**: Add descriptive text to category pages explaining what users can find
- **Product descriptions**: Ensure product descriptions are unique and keyword-rich

### Technical SEO
- **Page speed**: Optimize images (use WebP), minimize JavaScript bundles
- **Mobile responsive**: Ensure all pages work perfectly on mobile (Google uses mobile-first indexing)
- **Core Web Vitals**: Monitor LCP, FID, CLS in Search Console
- **HTTPS**: Ensure your site uses HTTPS (already done on Vercel)

### Link Building
- **Social media**: Create Facebook, Instagram, and LinkedIn pages for 1111.tn
- **Local directories**: Register on Tunisian business directories
- **Press releases**: Announce your platform on Tunisian tech blogs
- **Partnerships**: Partner with tech/shopping influencers in Tunisia

### Local SEO (Tunisia-Specific)
- **Google Business Profile**: Create a profile if you have a physical office
- **Arabic content**: Consider adding Arabic (`ar`) version of key pages
- **Local keywords**: Target "مقارنة الأسعار تونس", "أفضل سعر", "أسعار تونس"
- **`.tn` domain**: Your domain `1111.tn` already has local SEO advantage

### Monitoring
- Check **Google Search Console** weekly for:
  - Indexing issues
  - Search queries and click-through rates
  - Mobile usability issues
  - Core Web Vitals
- Set up **Google Alerts** for "1111.tn" to monitor mentions

---

## 📁 Files Modified/Created

| File | Change |
|------|--------|
| `app/sitemap.ts` | **Created** — Dynamic sitemap generation |
| `app/robots.ts` | **Created** — robots.txt configuration |
| `app/layout.tsx` | **Updated** — Global SEO metadata, JSON-LD, Open Graph |
| `app/products/page.tsx` | **Updated** — Added metadata |
| `app/products/[id]/page.tsx` | **Updated** — Added `generateMetadata` |
| `app/para/page.tsx` | **Updated** — Added metadata |
| `app/para/[id]/page.tsx` | **Updated** — Added `generateMetadata` |
| `app/pricing/page.tsx` | **Updated** — Added metadata |
| `app/solutions/page.tsx` | **Updated** — Added metadata |
| `app/coming-soon/layout.tsx` | **Updated** — Enhanced metadata |
| `app/(auth)/signin/layout.tsx` | **Created** — Sign in metadata |
| `app/(auth)/signup/layout.tsx` | **Created** — Sign up metadata |
| `app/(auth)/forgot-password/layout.tsx` | **Created** — noindex metadata |
| `app/(auth)/reset-password/layout.tsx` | **Created** — noindex metadata |
| `app/(auth)/verify/layout.tsx` | **Created** — noindex metadata |
| `app/profile/layout.tsx` | **Created** — noindex metadata |
| `app/dashboard/layout.tsx` | **Updated** — noindex metadata |
| `middleware.ts` | **Updated** — Bot detection + sitemap/robots exclusion |
