# Netlify Deployment Guide

This guide will help you deploy the frontend application to Netlify.

## Prerequisites

- A [Netlify account](https://app.netlify.com/signup)
- The backend API already deployed (currently on Render: `https://back-27em.onrender.com`)
- Git repository containing your code

## Quick Deployment

### Option 1: Deploy via Netlify CLI

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy** from the `front` directory:
   ```bash
   cd front
   netlify init
   ```
   Follow the prompts to create a new site or link to an existing one.

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Dashboard

1. **Push your code to GitHub, GitLab, or Bitbucket**

2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and repository

3. **Configure Build Settings**:
   - **Base directory**: `front`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20

4. **Add Environment Variables**:
   Go to Site settings → Environment variables and add:
   ```
   NEXT_PUBLIC_API_URL=https://back-27em.onrender.com/api/v1/
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
   ```

5. **Install Next.js Plugin**:
   The `netlify.toml` file already includes the Next.js plugin configuration.
   Netlify will automatically install `@netlify/plugin-nextjs` during build.

6. **Deploy**:
   Click "Deploy site" - Netlify will automatically build and deploy your site.

## Configuration Files

### netlify.toml
The `netlify.toml` file in the `front` directory contains:
- Build settings and commands
- API proxy configuration (routes `/api/v1/*` to your backend)
- Security headers
- Caching rules for static assets
- Next.js plugin configuration

### Environment Variables

Required environment variables (set these in Netlify dashboard):

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: https://back-27em.onrender.com/api/v1/)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID (if using Google auth)

See `.env.example` for a complete list of environment variables.

## Post-Deployment Steps

1. **Update CORS Settings on Backend**:
   Add your Netlify domain to the backend's allowed origins.
   Your Netlify URL will be: `https://your-site-name.netlify.app`

2. **Update Google OAuth Settings** (if using):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Add your Netlify URL to authorized JavaScript origins and redirect URIs

3. **Test the Deployment**:
   - Visit your Netlify URL
   - Test API calls and authentication
   - Check browser console for any errors

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy on every push to your main/master branch
- Create deploy previews for pull requests
- Run build checks before deploying

## Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure Node version is set to 20
- Verify all dependencies are in `package.json`

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Check backend CORS configuration includes your Netlify domain
- Check browser network tab for actual API endpoints being called

### Images Not Loading
- Remote image domains are configured in `next.config.ts`
- Ensure the backend API is accessible from Netlify
- Check Content Security Policy headers

## Additional Resources

- [Netlify Docs - Next.js](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

## Support

For issues specific to:
- **Netlify deployment**: [Netlify Support](https://www.netlify.com/support/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Backend API**: Check your backend deployment logs on Render
