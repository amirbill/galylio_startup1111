# Frontend Application

This is a [Next.js](https://nextjs.org) e-commerce price comparison application built with TypeScript, React, and Tailwind CSS.

## Features

- 🛍️ Product search and comparison
- 📊 Price tracking and analytics
- 🔐 Google OAuth authentication
- 💬 AI-powered chatbot
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Search Flow

The search system is split into three parts:

1. The UI search bar lives in [components/SearchBar.tsx](components/SearchBar.tsx).
2. The search bar sends requests to the backend API using `NEXT_PUBLIC_API_URL` from [lib/api.ts](lib/api.ts).
3. The backend search routes live in the Python app:
	 - Retail search: `/api/v1/products/search`
	 - Parapharmacy search: `/api/v1/para/search`

### How it works

- The user types at least 2 characters.
- The search bar waits 300 ms before sending the request.
- By default, it queries one endpoint:
	- `searchEndpoint="/api/v1/products/search"` for retail
	- `searchEndpoint="/api/v1/para/search"` for parapharmacy
- If `searchBoth` is enabled, it queries both endpoints in parallel.
- Results are sorted by `relevance` before being shown.
- Clicking a result opens the matching product page.

### Ranking rules

The backend search is relevance-based, not just regex-based.

- Exact SKU matches rank highest.
- Exact product name matches rank above partial matches.
- Prefix matches and token matches are boosted.
- Brand and category matches also contribute to the score.
- Accents are normalized, so searches like `creme` can match `Crème`.

### Request example

Retail search example:

```text
GET https://back-27em.onrender.com/api/v1/products/search?q=pc%20p&limit=8
```

Parapharmacy search example:

```text
GET https://back-27em.onrender.com/api/v1/para/search?q=creme&limit=8
```

### Important deployment note

Do not prepend `/api/v1` twice in the frontend. The app already resolves the endpoint against the backend base URL, so the final deployed request must look like:

```text
https://back-27em.onrender.com/api/v1/products/search
```

not:

```text
https://back-27em.onrender.com/api/v1/api/v1/products/search
```

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Authentication**: Google OAuth

## Getting Started

### Prerequisites

- Node.js 18+ (20 recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file (copy from example):
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://back-27em.onrender.com/api/v1/
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:1111](http://localhost:1111) to view the application.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The application runs on port `1111` for both `dev` and `start`.

## Deployment

### Netlify (Recommended)

This project is configured for deployment on Netlify.

**Quick Deploy:**

1. Run the deployment readiness check:
```powershell
.\check-deployment.ps1
```

2. Follow the [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

3. See detailed instructions in [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md)

**Key Files:**
- `netlify.toml` - Netlify configuration
- `.env.example` - Environment variables template
- `NETLIFY_DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

### Other Platforms

This Next.js app can also be deployed on:
- Vercel
- AWS Amplify
- Digital Ocean
- Railway

## Project Structure

```
front/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── para/              # Parapharmacy section
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── services/             # API services
└── public/              # Static assets
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

## Environment Variables

See `.env.example` for all available environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID

## Support

For deployment issues, check:
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Netlify Guide](./NETLIFY_DEPLOYMENT.md)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
