# Netlify Deployment Checklist

Use this checklist to ensure a smooth deployment to Netlify.

## Pre-Deployment Checklist

- [ ] **Code is committed to Git**
  - Push all changes to your repository (GitHub, GitLab, or Bitbucket)

- [ ] **Backend is deployed and accessible**
  - Current backend URL: `https://back-27em.onrender.com`
  - Verify API is responding: Check `/api/v1/health` endpoint

- [ ] **Environment variables are documented**
  - Review `.env.example` file
  - Have your Google OAuth Client ID ready (if using)

- [ ] **Dependencies are up to date**
  ```bash
  cd front
  npm install
  npm run build  # Test build locally
  ```

## Netlify Setup Checklist

### Via Dashboard (Recommended)

- [ ] **Create Netlify account** (if you don't have one)
  - Go to https://app.netlify.com/signup

- [ ] **Import project**
  - Click "Add new site" → "Import an existing project"
  - Connect your Git provider
  - Select your repository

- [ ] **Configure build settings**
  - Base directory: `front`
  - Build command: `npm run build`
  - Publish directory: `.next`
  
- [ ] **Set Node version**
  - Add environment variable: `NODE_VERSION=20`

- [ ] **Add environment variables**
  Go to Site settings → Environment variables:
  - `NEXT_PUBLIC_API_URL` = `https://back-27em.onrender.com/api/v1/`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = `<your-client-id>`

- [ ] **Deploy the site**
  - Click "Deploy site"
  - Wait for build to complete
  - Note your deployed URL (e.g., `https://your-site-name.netlify.app`)

### Via CLI (Alternative)

- [ ] **Install Netlify CLI**
  ```bash
  npm install -g netlify-cli
  ```

- [ ] **Login to Netlify**
  ```bash
  netlify login
  ```

- [ ] **Initialize site**
  ```bash
  cd front
  netlify init
  ```

- [ ] **Set environment variables**
  ```bash
  netlify env:set NEXT_PUBLIC_API_URL "https://back-27em.onrender.com/api/v1/"
  netlify env:set NEXT_PUBLIC_GOOGLE_CLIENT_ID "your-client-id"
  ```

- [ ] **Deploy**
  ```bash
  netlify deploy --prod
  ```

## Post-Deployment Checklist

- [ ] **Verify deployment**
  - Visit your Netlify URL
  - Check homepage loads correctly
  - Test navigation between pages

- [ ] **Test API connectivity**
  - Open browser DevTools → Network tab
  - Perform actions that call the backend API
  - Verify API calls are successful (200 status codes)

- [ ] **Update Google OAuth (if using)**
  - Go to [Google Cloud Console](https://console.cloud.google.com/)
  - Select your project → Credentials
  - Edit OAuth 2.0 Client ID
  - Add to "Authorized JavaScript origins":
    - `https://your-site-name.netlify.app`
  - Add to "Authorized redirect URIs":
    - `https://your-site-name.netlify.app`
  - Save changes

- [ ] **Test authentication**
  - Try to sign in with Google
  - Verify user data is stored correctly
  - Test protected routes

- [ ] **Configure custom domain (optional)**
  - Go to Site settings → Domain management
  - Add custom domain
  - Update DNS records as instructed

- [ ] **Enable HTTPS**
  - Netlify automatically provides free SSL
  - Verify the site is served over HTTPS

- [ ] **Set up notifications (optional)**
  - Go to Site settings → Build & deploy → Deploy notifications
  - Add email or Slack notifications for deploys

## Continuous Deployment

- [ ] **Verify automatic deployments**
  - Push a small change to your repository
  - Check that Netlify automatically rebuilds and deploys

- [ ] **Configure deploy contexts (optional)**
  - Branch deploys for feature branches
  - Deploy previews for pull requests
  
- [ ] **Set up build hooks (optional)**
  - Create build hooks for external triggers
  - Use for scheduled rebuilds or CMS updates

## Performance & Monitoring

- [ ] **Check Lighthouse scores**
  - Run Lighthouse audit in Chrome DevTools
  - Aim for 90+ scores

- [ ] **Set up analytics (optional)**
  - Netlify Analytics for server-side tracking
  - Or integrate Google Analytics

- [ ] **Monitor build times**
  - Check build logs for warnings
  - Optimize if builds take too long

## Troubleshooting

If deployment fails, check:

- [ ] Build logs in Netlify dashboard
- [ ] Node version is set to 20
- [ ] All dependencies are in `package.json`
- [ ] Environment variables are set correctly
- [ ] `netlify.toml` is in the `front` directory

If API calls fail:

- [ ] Backend URL is correct in `NEXT_PUBLIC_API_URL`
- [ ] Backend is running and accessible
- [ ] CORS is configured correctly on backend
- [ ] Check browser console for errors

## Success Criteria

Your deployment is successful when:

✅ Site loads without errors
✅ API calls work correctly
✅ Authentication works (if implemented)
✅ Images load properly
✅ Navigation works across all routes
✅ Build completes without warnings
✅ Performance scores are acceptable

## Resources

- 📚 [Full deployment guide](./NETLIFY_DEPLOYMENT.md)
- 🔧 [Netlify Docs](https://docs.netlify.com/)
- 🚀 [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- 🔐 [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

**Need help?** Check the [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) guide for detailed instructions.
