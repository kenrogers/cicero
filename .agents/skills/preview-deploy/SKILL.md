---
name: preview-deploy
description: Guided preview deployment for the Vibe Coders Starter Kit. Use when user says "deploy preview", "preview deployment", "deploy for testing", "test deployment", or "deploy to preview". Walks through deploying to Vercel Preview + Convex dev deployment for testing before production.
---

# Preview Deployment - Guided Deployment for Testing

This skill guides the user through deploying their application to a **preview environment** for testing before going to production.

## When to Use This Skill

- User wants to test their app in a live environment
- User says "deploy preview", "deploy for testing", "preview deployment"
- User wants to share a working URL with others for feedback
- User is ready to deploy but NOT ready for production/real users

## Important: Preview First Philosophy

**Always deploy to preview first.** Production deployment should only happen when:
- The user explicitly requests production deployment
- All features have been tested in preview
- Billing has been verified with test cards

## Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    PREVIEW DEPLOY                            │
│ ────────────────────────────────────────────────────────    │
│ Purpose: Test in live environment before production          │
│ Clerk Billing: Test mode (fake cards only)                   │
│ Users: Test accounts                                         │
│ Risk: LOW - can reset anytime                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                   (only when ready)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOY                         │
│ ────────────────────────────────────────────────────────    │
│ Purpose: Real users and real payments                        │
│ Clerk Billing: Live mode (real money)                        │
│ Users: Real customers                                        │
│ Risk: HIGH - affects revenue and users                       │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites Check

Before starting, verify:
1. ✅ Local development is working (`npm run dev` + `npx convex dev`)
2. ✅ User can sign in and use the app locally
3. ✅ All intended features work locally

## Step 1: Confirm Environment

Ask the user:

```
Let's deploy your app for testing! Before we start:

1. Is your local development working? (npm run dev + npx convex dev)
2. Can you sign in and use the app locally?

This will be a PREVIEW deployment for testing - no real payments or production users.

Ready to continue? (yes/no)
```

Wait for confirmation before proceeding.

## Step 2: Vercel Account Setup

Check if user has Vercel:

```
Do you have a Vercel account? 

If not, let's create one:
```

```bash
open https://vercel.com/signup
```

Prompt:
```
Please sign up or sign in to Vercel. You can use your GitHub account for easy integration.

Let me know when you're logged in to the Vercel dashboard.
```

Wait for confirmation.

## Step 3: Connect to Git Repository

Prompt:
```
Is your project pushed to GitHub (or GitLab/Bitbucket)?

If not, let's do that first:
```

If needed, run:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

Then:
```bash
open https://vercel.com/new
```

Prompt:
```
In the Vercel dashboard:

1. Click "Add New Project"
2. Find and select your repository
3. Click "Import"

Don't deploy yet - we need to configure environment variables first.

Let me know when you see the configuration screen.
```

Wait for confirmation.

## Step 4: Configure Vercel Environment Variables

Prompt:
```
On the Vercel project configuration screen, expand "Environment Variables" and add these:

**From your local .env.local file:**
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = {your pk_test_ value}
- CLERK_SECRET_KEY = {your sk_test_ value}
- NEXT_PUBLIC_CLERK_FRONTEND_API_URL = {your Clerk frontend API URL ending in .clerk.accounts.dev}
- CSRF_SECRET = {your CSRF secret}
- SESSION_SECRET = {your session secret}
- NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL = /dashboard
- NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL = /dashboard
- NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL = /dashboard
- NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL = /dashboard

**Leave these for now - Convex will provide them:**
- CONVEX_DEPLOY_KEY (we'll add this next)
- NEXT_PUBLIC_CONVEX_URL (we'll add this next)

Let me know when you've added the Clerk and security variables.
```

Wait for confirmation.

## Step 5: Get Convex Deploy Key

```bash
open https://dashboard.convex.dev
```

Prompt:
```
In your Convex dashboard:

1. Select your project
2. Go to Settings → Deploy Keys
3. Click "Create Deploy Key"
4. Name it "Vercel Preview" 
5. Select your DEV deployment (not production)
6. Copy the deploy key

Back in Vercel, add:
- CONVEX_DEPLOY_KEY = {the deploy key you just copied}

The format should look like: dev:your-project|xxxxxxxxxxx

Let me know when you've added the Convex deploy key.
```

Wait for confirmation.

## Step 6: Configure Convex URL

Prompt:
```
Also add to Vercel:
- NEXT_PUBLIC_CONVEX_URL = {your Convex URL from .env.local}

The format is: https://your-deployment.convex.cloud

You can find this in your local .env.local file.

Let me know when added.
```

Wait for confirmation.

## Step 7: Deploy to Vercel

Prompt:
```
Now click "Deploy" in Vercel!

This will:
1. Build your Next.js app
2. Deploy it to a preview URL
3. Connect to your Convex dev deployment

The first deploy takes 2-5 minutes. You'll see the build logs.

Let me know when the deployment completes (you'll see "Ready" status).
```

Wait for confirmation.

## Step 8: Update Clerk Allowed Origins

After deployment, Vercel provides a URL. Prompt:

```
Great! Copy your Vercel deployment URL (looks like: https://your-app.vercel.app)

Now we need to tell Clerk about this new URL:
```

```bash
open https://dashboard.clerk.com
```

Prompt:
```
In your Clerk dashboard:

1. Make sure you're on your DEVELOPMENT instance (not production)
2. Go to Configure → Paths
3. Under "Allowed origins" or "Redirect URLs", add your Vercel URL:
   - https://your-app.vercel.app
   - https://your-app-*.vercel.app (for preview deployments)

This allows Clerk authentication to work from your deployed app.

Let me know when you've added the URL.
```

Wait for confirmation.

## Step 9: Verify Webhook Configuration

The webhook should already be configured from initial setup:

Prompt:
```
Let's verify your Clerk → Convex webhook is working:

1. In Clerk Dashboard → Configure → Webhooks
2. You should see an existing webhook pointing to your Convex URL
3. The endpoint should be: {NEXT_PUBLIC_CONVEX_URL}/clerk-users-webhook
4. Events should include: user.created, user.updated, user.deleted, paymentAttempt.updated

Since we're using the same Convex dev deployment as local, the existing webhook should work.

Is the webhook configured? (yes/no/need help)
```

## Step 10: Test the Deployment

Prompt:
```
Let's test your deployment! Visit your Vercel URL and verify:

1. [ ] Landing page loads correctly
2. [ ] You can sign in/sign up (uses Clerk development mode)
3. [ ] Dashboard loads after sign-in
4. [ ] Data syncs (Convex real-time working)
5. [ ] If billing enabled: test subscription with card 4242 4242 4242 4242

Note: Billing uses Clerk Billing (not Stripe directly). Test cards work because 
Clerk is in development mode.

Try each of these and let me know how it goes!
```

Wait for results.

## Step 11: Troubleshooting Common Issues

### Issue: Auth not working
```
If sign-in fails:
1. Check Clerk Dashboard → Paths → Allowed origins includes your Vercel URL
2. Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is correct in Vercel env vars
3. Verify NEXT_PUBLIC_CLERK_FRONTEND_API_URL matches your Clerk dashboard
4. Redeploy after fixing env vars (Vercel → Deployments → Redeploy)
```

### Issue: Database not connecting
```
If data isn't loading:
1. Check NEXT_PUBLIC_CONVEX_URL is correct
2. Check CONVEX_DEPLOY_KEY is valid and points to dev deployment
3. Verify Convex dashboard shows your dev deployment is active
4. Check browser console for connection errors
```

### Issue: Webhooks not firing
```
If user sync isn't working:
1. Check Clerk Dashboard → Webhooks → Recent Deliveries
2. Look for failures and check error messages
3. Verify CLERK_WEBHOOK_SECRET in Convex env vars matches the signing secret
4. Make sure paymentAttempt.updated event is enabled for billing
```

### Issue: Billing not working
```
If subscription flow fails:
1. Verify Clerk Billing is enabled (Clerk Dashboard → Billing → Settings)
2. Check you have at least one subscription plan created
3. Use test card: 4242 4242 4242 4242, any future date, any CVC
4. Check browser console for CSP errors (may need middleware update)
```

### Issue: Build failed
```
Check Vercel build logs for:
1. TypeScript errors - run `npx tsc --noEmit` locally
2. Missing dependencies - check package.json
3. Environment variable issues - all required vars must be set

Always test locally first: npm run build
```

## Success Output

```
🎉 Preview Deployment Complete!

Deployment URL: {vercel-url}
Environment: Preview (Clerk development mode)
Billing: Test mode (use card 4242 4242 4242 4242)

What You Can Do Now:
✅ Share URL with teammates for feedback
✅ Test all features in a live environment
✅ Test billing with Clerk Billing test cards
✅ Verify mobile responsiveness
✅ Test across different browsers

What's Next:
- Continue developing locally (changes auto-deploy on push)
- When ready for real users, say: deploy to production

Your preview deployment auto-updates when you push to your main branch!
```

## When User Asks for Production

If user requests production deployment, respond:

```
Production deployment requires additional setup:
- A custom domain you own
- Production Clerk instance (pk_live_ keys)
- Production Convex deployment (npx convex deploy)
- Clerk Billing in live mode (real payments)

Would you like me to guide you through production deployment?

Note: Only deploy to production when you're ready for real users and real payments.
```

Then guide them to DEPLOYMENT.md for the full production setup.

## Key Differences: Preview vs Production

| Aspect | Preview | Production |
|--------|---------|------------|
| **Clerk Keys** | pk_test_ / sk_test_ | pk_live_ / sk_live_ |
| **Clerk Mode** | Development instance | Production instance |
| **Convex** | dev:deployment | prod:deployment |
| **Billing** | Test mode (fake cards) | Live mode (real $$$) |
| **Domain** | *.vercel.app | your-domain.com |
| **Users** | Test accounts | Real customers |
| **Data** | Can reset anytime | Protect at all costs |

## Tech Stack Reference

This deployment uses:
- **Next.js 15** with App Router
- **Vercel** for hosting and edge functions
- **Convex** for real-time database
- **Clerk** for authentication AND billing (via Clerk Billing)
- **TailwindCSS v4** + shadcn/ui for styling

## Official Documentation References

- Vercel Deployments: https://vercel.com/docs/deployments
- Vercel Environments: https://vercel.com/docs/deployments/environments
- Convex Production: https://docs.convex.dev/production/
- Convex CLI Deploy: https://docs.convex.dev/cli
- Clerk Deployment: https://clerk.com/docs/guides/development/deployment/production
- Clerk Environments: https://clerk.com/docs/guides/development/managing-environments
- Clerk Billing: https://clerk.com/docs/guides/billing/overview
