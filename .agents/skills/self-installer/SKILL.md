---
name: self-installer
description: Guided installation and setup of THIS Secure Vibe Coding OS SaaS application. This skill installs the current application only. Use when user says "install app", "setup app", "install this app", "install from readme", or "run the installation". Guides user through Clerk authentication setup, Convex backend configuration, webhook setup, and billing enablement.
---

# Self-Installer - Guided Application Installation

This skill guides the user through the complete installation of THIS application by following the README.md instructions exactly.

## Installation Instructions Source

**CRITICAL**: All installation steps MUST follow the instructions in `README.md` under the "Getting Started" > "Installation" section and subsequent configuration sections. The README is the single source of truth.

Do NOT duplicate steps here. Always read and follow the README.md file for the actual installation procedure.

## Prerequisites

Before starting:
1. User must have or will create Clerk account
2. User must have or will create Convex account

## Installation Workflow

### Step 1: Ask User for Site Name and Billing Preference

Ask the user directly:
- Question: "What would you like to name your site?"
- Default option: Use current directory name (extract from `pwd`)
- Example: If current directory is `/Users/name/code/test3`, suggest `test3`

Then ask:
- Question: "Will this project use Clerk Billing for subscriptions/payments? (yes/no)"
- If **yes**: Billing setup will be included later
- If **no**: Billing setup will be skipped and billing components will be temporarily disabled

### Step 2: Initial Setup

Run these commands for the user:
1. Run `npm install`
2. Run `cp .env.example .env.local`
3. Generate CSRF secrets per README instructions

Then prompt:
```
I've set up the initial files. Please open .env.local in your editor - we'll be adding values to it throughout this process.

Set NEXT_PUBLIC_SITE_NAME to: {site-name-from-step-1}
```

### Step 3: Clerk Configuration

Open the Clerk dashboard for the user:
```bash
open https://dashboard.clerk.com
```

Then prompt:
```
I've opened the Clerk dashboard. Please:

1. Sign in or create an account
2. Create a new application named "{site-name}"
3. Copy your API keys and add them to .env.local:
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   - CLERK_SECRET_KEY=sk_test_...

4. Go to JWT Templates and create a "convex" template
5. Copy the Issuer URL and add it to .env.local:
   - CLERK_JWT_ISSUER_DOMAIN=https://...

6. Go to Paths and set:
   - Sign-in URL: http://localhost:3000/sign-in
   - Sign-up URL: http://localhost:3000/sign-up
   - After sign-in URL: http://localhost:3000/dashboard
   - After sign-up URL: http://localhost:3000/dashboard

Let me know when you've completed these steps.
```

Wait for user to respond before proceeding.

### Step 4: Convex Configuration

Open the Convex dashboard for the user:
```bash
open https://dashboard.convex.dev
```

Then prompt:
```
I've opened the Convex dashboard. Please:

1. Sign in or create an account
2. Create a new project named "{site-name}"
3. Go to Settings > Project Settings > Lost Access
4. Copy the command shown there (it looks like):
   npx convex dev --configure=existing --team your_team_name --project your_project_name

Let me know when you have the command copied.
```

Wait for user to respond with the command, then run it for them.

After running the configure command, prompt:
```
Convex is now configured. Your .env.local should have:
- CONVEX_DEPLOYMENT=dev:...
- NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

Now set this deployment as your default project environment:
1. In your Convex dashboard, go to Settings > Project Settings
2. Under "Default Deployment", select your dev deployment
3. This ensures `convex dev` uses the correct deployment by default

Then, still in your Convex dashboard, go to Settings > Environment Variables and add:
- CLERK_JWT_ISSUER_DOMAIN (same value as in .env.local)

Let me know when you've completed these steps.
```

Wait for user to respond before proceeding.

### Step 5: Webhook Setup

Prompt the user:
```
Now let's set up webhooks. In your Clerk dashboard:

1. Go to Webhooks
2. Create a new webhook endpoint:
   - URL: Use your Convex **HTTP Actions URL** (NOT the Deployment URL)
     - Find it in Convex Dashboard > Settings > URL & Deploy Key > HTTP Actions URL
     - It ends in `.convex.site` (e.g., https://your-project-123.convex.site)
     - Append the webhook path: https://your-project-123.convex.site/clerk-users-webhook
   - Events: Select all user events and session events

3. Copy the Signing Secret

4. In your Convex dashboard, go to Settings > Environment Variables
5. Add: CLERK_WEBHOOK_SECRET={signing-secret}

Let me know when you've completed these steps.
```

Wait for user to respond before proceeding.

### Step 6: Billing Setup (Conditional)

**If user said YES to billing in Step 1:**

Prompt the user:
```
Now let's enable billing. In your Clerk dashboard:

1. Go to Billing > Subscription plans
2. Create a "Pro" plan at $9.99/month per README instructions

3. Go to Billing > Settings
4. Enable billing

Let me know when you've completed these steps.
```

Wait for user to respond before proceeding.

**If user said NO to billing in Step 1:**

Inform the user:
```
Since you're not using billing, I'll disable the billing components temporarily.
```

Then disable billing in the project:

1. **Update the payment-gated page** (`app/(app)/dashboard/payment-gated/page.tsx`):
   - Replace the content with a simple placeholder message
   - Example: "Payment features coming soon" or similar

2. **Update the pricing section** (find the pricing component on the landing page):
   - Replace or remove the `CustomClerkPricing` component
   - Can use static pricing cards or remove the section entirely

3. **Update sidebar navigation** (find the sidebar/nav component):
   - Remove or hide the "Payment gated" link

After making changes, inform the user:
```
Billing components have been temporarily disabled. You can re-enable them later by:
1. Setting up Clerk Billing in your dashboard
2. Reverting the changes I made to the payment-gated page and pricing section
3. Restoring the sidebar link

The original files are in git history if you need to restore them.
```

### Step 7: Deploy and Test

Run these commands:
```bash
npx convex dev --once
```

Then start the dev server:
```bash
npm run dev
```

**If user said YES to billing:**

Prompt the user:
```
The application should now be running at http://localhost:3000

Please test:
1. Visit the landing page
2. Sign in via /dashboard
3. Check the payment-gated page
4. Try the subscription flow with the test card

Let me know if everything is working!
```

**If user said NO to billing:**

Prompt the user:
```
The application should now be running at http://localhost:3000

Please test:
1. Visit the landing page
2. Sign in via /dashboard
3. Verify the dashboard loads correctly

Let me know if everything is working!
```

## Critical Rules

### MUST Follow README Exactly

- **READ** README.md before each phase to get current instructions
- **NEVER** add environment variables not in README.md
- **NEVER** deviate from README step order or content
- **ONLY** use environment variables explicitly listed in README
- If README changes, this skill automatically follows new instructions

### Environment Variables

Only reference variables that appear in README.md `.env.local` configuration section.

**DO NOT** reference:
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- Any other variables not in README

### User-Driven Approach

- Open URLs for the user using `open <url>` command
- Prompt the user with clear instructions for what to configure
- Wait for user confirmation before proceeding to next step
- User manually updates .env.local with values they copy from dashboards

## Error Handling

If any step fails:
1. Report the error with the README section reference
2. Show what was attempted
3. Suggest checking README.md for updated instructions
4. Allow user to retry or continue manually

## Success Output

**If user said YES to billing:**

```
🎉 Installation Complete!

Site Name: {user-chosen-name}
Development URL: http://localhost:3000

Configuration Summary:
✅ Dependencies installed (npm packages)
✅ Environment variables configured (.env.local)
✅ CSRF secrets generated
✅ Clerk authentication set up
✅ JWT template configured for Convex
✅ Convex backend deployed
✅ Webhooks configured (Clerk → Convex)
✅ Billing enabled with Pro plan ($9.99/month)

Next Steps:
- Application is running at http://localhost:3000
- Convex functions are deployed
- Billing is enabled in test mode
- You can now develop and customize
- See README.md for deployment to production
```

**If user said NO to billing:**

```
🎉 Installation Complete!

Site Name: {user-chosen-name}
Development URL: http://localhost:3000

Configuration Summary:
✅ Dependencies installed (npm packages)
✅ Environment variables configured (.env.local)
✅ CSRF secrets generated
✅ Clerk authentication set up
✅ JWT template configured for Convex
✅ Convex backend deployed
✅ Webhooks configured (Clerk → Convex)
⏸️ Billing disabled (components temporarily removed)

Next Steps:
- Application is running at http://localhost:3000
- Convex functions are deployed
- You can now develop and customize
- To enable billing later, set up Clerk Billing and restore the billing components
- See README.md for deployment to production
```

## Maintainability

This skill is designed to be **maintenance-free**:
- All actual installation steps are in README.md
- Skill only orchestrates the workflow and guides the user
- When README updates, skill automatically follows new instructions
- No need to update this skill when installation process changes
