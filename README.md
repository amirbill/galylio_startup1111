# Frontend Application

This is a [Next.js](https://nextjs.org) e-commerce price comparison application built with TypeScript, React, and Tailwind CSS.

## Features

- 🛍️ Product search and comparison
- 📊 Price tracking and analytics
- 🔐 Google OAuth authentication
- 💬 AI-powered chatbot
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

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

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

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
