# Cicero Deployment Guide

## Prerequisites

- [Vercel account](https://vercel.com)
- [Convex account](https://convex.dev) with project set up
- [Clerk account](https://clerk.com) with production instance
- [OpenRouter account](https://openrouter.ai) with credits
- [Resend account](https://resend.com) with verified domain
- [AssemblyAI account](https://assemblyai.com) with credits

## Step 1: Create Production Convex Deployment

```bash
# Deploy to production
npx convex deploy --prod
```

This creates a production deployment and outputs the production URL.

## Step 2: Set Convex Environment Variables

In the [Convex Dashboard](https://dashboard.convex.dev), go to your production deployment → Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI summarization | `sk-or-v1-...` |
| `RESEND_API_KEY` | Resend API key for email notifications | `re_...` |
| `ASSEMBLYAI_API_KEY` | AssemblyAI key for transcription | `...` |
| `ADMIN_EMAIL` | Admin email for protected endpoints | `admin@example.com` |

```bash
# Or set via CLI
npx convex env set OPENROUTER_API_KEY "sk-or-v1-..." --prod
npx convex env set RESEND_API_KEY "re_..." --prod
npx convex env set ASSEMBLYAI_API_KEY "..." --prod
npx convex env set ADMIN_EMAIL "admin@example.com" --prod
```

## Step 3: Configure Clerk Production

1. In [Clerk Dashboard](https://dashboard.clerk.com), switch to your **Production** instance
2. Copy the production API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Set up JWT template for Convex (same as development)

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Import your repository at [vercel.com/new](https://vercel.com/new)
2. Configure environment variables (see below)
3. Deploy

### Option B: Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Step 5: Set Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

### Required Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | Your production Convex URL (e.g., `https://xxx.convex.cloud`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk production publishable key |
| `CLERK_SECRET_KEY` | Clerk production secret key |
| `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` | Clerk frontend API URL |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., `https://cicero.app`) |
| `NEXT_PUBLIC_SITE_NAME` | `Cicero` |

### CSRF & Session Secrets

Generate new secrets for production:

```bash
node -p "require('crypto').randomBytes(32).toString('base64url')"
```

| Variable | Value |
|----------|-------|
| `CSRF_SECRET` | Generated 32-byte base64url string |
| `SESSION_SECRET` | Generated 32-byte base64url string |

### Redirect URLs

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/dashboard` |

## Step 6: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to your domain

## Step 7: Set Up Clerk Webhooks

1. In Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret
5. Add to Vercel: `CLERK_WEBHOOK_SECRET`

## Step 8: Verify Deployment

### Check List

- [ ] Homepage loads at production URL
- [ ] `/meetings` page shows meetings (may be empty initially)
- [ ] Sign in works via Clerk
- [ ] Subscribe form works on landing page
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

### Test Full Pipeline

1. Trigger a scrape (as admin):
   ```bash
   curl -X POST https://your-domain.com/api/admin/scrape \
     -H "Authorization: Bearer YOUR_CLERK_TOKEN"
   ```

2. Check Convex dashboard for new meetings
3. Process a meeting via Convex dashboard
4. Verify email notification is sent

## Monitoring

### Convex Dashboard
- Monitor function invocations
- Check for errors in Logs
- View data in Tables

### Vercel Dashboard
- Monitor deployments
- Check function logs
- View analytics

## Troubleshooting

### "Convex functions not found"
- Ensure `npx convex deploy --prod` completed successfully
- Check that `NEXT_PUBLIC_CONVEX_URL` points to production

### "Clerk authentication failing"
- Verify you're using production Clerk keys
- Check JWT template is configured for Convex

### "Emails not sending"
- Verify `RESEND_API_KEY` is set in Convex production
- Check Resend dashboard for delivery logs
- Ensure sending domain is verified

### "Transcription failing"
- Verify `ASSEMBLYAI_API_KEY` is set in Convex production
- Check AssemblyAI account has credits

### "AI summarization failing"
- Verify `OPENROUTER_API_KEY` is set in Convex production
- Check OpenRouter account has credits
- Try a different model if current one is unavailable

## Costs Estimate

| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| Vercel | Hobby tier | Free |
| Convex | Pro tier recommended | ~$25/month |
| OpenRouter | Per meeting (~$0.01-0.05) | ~$5/month |
| AssemblyAI | Per meeting (~$0.50-2.00) | ~$20-50/month |
| Resend | 3000 emails/month free | Free |
| Clerk | 10,000 MAU free | Free |

## Security Checklist

- [ ] Production secrets are different from development
- [ ] CSRF and session secrets are unique 32-byte values
- [ ] Admin email is set correctly
- [ ] Rate limiting is enabled on public endpoints
- [ ] No sensitive data in client-side code
- [ ] All API routes have proper authentication
