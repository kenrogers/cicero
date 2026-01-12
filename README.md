# Vibe Coders Starter Kit

A production-ready starter template that gives you everything you need to vibe code real applications—not just prototypes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What This Is

The Vibe Coders Starter Kit is created by [Ken Rogers](https://kenrogers.co) as part of the [Vibe Coders](https://skool.com/vibecoders/about) community on Skool.

Huge thank you to Dr. Allen Harper for providing the inspiration for this. The Vibe Coders Starter Kit was forked from his [Secure Vibe Coding OS](https://github.com/harperaa/secure-vibe-coding-OS).

**The problem with most starter templates:** They give you a basic setup, but the moment you start building, you're on your own—writing prompts from scratch, repeating mistakes, losing context between sessions.

**This template is different.** It includes:

1. **A workflow system** that makes AI-assisted development predictable
2. **A skills library** with pre-built patterns for common tasks
3. **A learning system** that captures what works and applies it automatically
4. **Production-ready infrastructure** (auth, payments, database, security)
5. **A polished design system** so your apps don't look like generic AI output

## The Core Philosophy

Most vibe coding produces throwaway prototypes. This template is designed to produce **shippable software** by baking in the practices that separate demos from products:

| Practice | How It's Built In |
|----------|-------------------|
| **Consistent workflow** | The `/work` command guides every session |
| **Compound learning** | Lessons accumulate and apply automatically |
| **Security by default** | Pre-built patterns for auth, CSRF, rate limiting, validation |
| **Professional design** | Design skill with patterns that avoid generic AI aesthetics |
| **Real infrastructure** | Auth, payments, real-time database—all wired up |

---

## Quick Start

### 1. Create Your Project

Click the **"Use this template"** button at the top of this repository, then:

```bash
git clone https://github.com/YOUR_USERNAME/your-new-repo.git
cd your-new-repo
npm install
```

### 2. Set Up Services

You'll need accounts for:
- **[Clerk](https://dashboard.clerk.com)** — Authentication and billing
- **[Convex](https://dashboard.convex.dev)** — Real-time database

```bash
cp .env.example .env.local
# Fill in your Clerk and Convex credentials (see Installation section below)
```

### 3. Start Development

```bash
npm run dev        # Terminal 1 - Next.js
npx convex dev     # Terminal 2 - Convex
```

### 4. Start Building

Open your AI coding tool and say:

```
/work
```

The system will guide you from there.

### Automated Setup (Amp/Claude Users)

If you're using Amp or Claude with [Playwright MCP](https://github.com/anthropics/anthropic-cookbook/tree/main/misc/mcp_playwright), you can automate the entire installation:

```
install app
```

The AI will walk through setup automatically—creating your Clerk app, Convex project, configuring webhooks, enabling billing, and testing everything works.

---

## The `/work` Workflow

Instead of writing prompts from scratch each session, you use a single command that handles planning, execution, and learning automatically.

```
┌─────────────────────────────────────────────────────────────┐
│                        /work                                │
├─────────────────────────────────────────────────────────────┤
│  1. LEARN   - Check past lessons for what worked/failed     │
│  2. DO      - Plan and execute with atomic commits          │
│  3. CAPTURE - Save learnings for next time                  │
└─────────────────────────────────────────────────────────────┘
```

### Why This Matters

| Problem | How `/work` Fixes It |
|---------|----------------------|
| **Repeating mistakes** | Automatically surfaces past learnings before you start |
| **Lost context between sessions** | Reads project state and picks up where you left off |
| **Forgotten lessons** | Prompts you to capture learnings when work completes |
| **Vague AI prompts** | Plans are structured, executable, and atomic (2-3 tasks max) |
| **Inconsistent workflow** | Enforces the same proven loop every session |

### How It Works

1. **Projects** break into **phases** (auth, database, UI, etc.)
2. **Phases** break into **plans** with 2-3 atomic tasks each
3. **Tasks** execute one at a time with verification and commits
4. **Learnings** get captured and applied to future sessions

All state is stored in `.planning/` and lessons in `.agents/skills/lessons/`.

### All Commands

| Command | What It Does |
|---------|--------------|
| `/work` | **Unified workflow (recommended)** |
| `/gsd` | Check status, route to next action |
| `/new-project` | Initialize project with deep questioning |
| `/roadmap` | Break project into phases |
| `/plan` | Create PLAN.md (2-3 atomic tasks) |
| `/execute` | Run plan with atomic commits |
| `/progress` | Show status and next steps |

---

## The Skills System

Skills are specialized instructions that activate when you need them. They encode best practices so you don't have to remember (or re-discover) the right way to do things.

### Pre-Built Skills

```
.agents/skills/
├── security/           # CSRF, rate limiting, validation, auth patterns
├── gsd/                # Project management and planning system
├── frontend-design/    # UI patterns that avoid generic AI aesthetics
└── lessons/            # YOUR learnings (grows over time)
```

### How Skills Work

When you describe a task that matches a skill, the AI loads it automatically:

- "Add rate limiting to this endpoint" → loads `rate-limiting` skill
- "Build a landing page" → loads `frontend-design` skill
- "Protect this form from CSRF" → loads `csrf-protection` skill

### The Learning System

The `lessons/` directory starts empty and grows as you work:

```bash
# After completing work, capture what you learned:
/retrospective

# The system creates:
.agents/skills/lessons/implementing-stripe-webhooks/
└── SKILL.md    # What worked, what failed, exact parameters
```

Next time you work on something similar, `/work` finds and applies those lessons automatically.

| Timeline | What Happens |
|----------|--------------|
| **Week 1** | Empty lessons, learn as you go |
| **Week 2** | Past lessons surface automatically, work goes faster |
| **Month 1** | 10+ lessons, most tasks have relevant experience |
| **Month 3** | Institutional knowledge base, onboard new team members |

---

## What's Included

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 with App Router |
| **Styling** | TailwindCSS v4 + shadcn/ui |
| **Database** | Convex (real-time, serverless) |
| **Auth** | Clerk (users, sessions, social login) |
| **Payments** | Clerk Billing (subscriptions via Stripe) |
| **Deployment** | Vercel-ready |

### Features

**Infrastructure**
- 🔐 Complete authentication with Clerk
- 💳 Subscription billing with Clerk Billing
- 🗄️ Real-time database with Convex
- 🔗 Webhook integration for user/payment sync
- 🚢 One-click Vercel deployment

**Security**
- 🛡️ CSRF protection with HMAC-SHA256
- 🚦 Rate limiting (IP-based, configurable)
- ✅ Input validation with Zod + XSS sanitization
- 🔐 Security headers (CSP, HSTS, X-Frame-Options)
- 📊 Security monitoring dashboard (admin-only)

**Design & UX**
- 🎨 Custom design system (not generic AI output)
- 🌗 Dark/Light theme with system awareness
- 📱 Mobile-first responsive layouts
- ✨ Animations with Framer Motion
- 🎭 Polished error pages

**Developer Experience**
- ⚡️ Turbopack for fast HMR
- 📝 TypeScript throughout
- 🧩 shadcn/ui component library
- 📝 SEO + LLM-optimized blog engine

---

## Installation

### Prerequisites

- Node.js 18+
- Clerk account ([dashboard.clerk.com](https://dashboard.clerk.com))
- Convex account ([dashboard.convex.dev](https://dashboard.convex.dev))

### Step 1: Create Your Repository

1. Click **"Use this template"** → **"Create a new repository"**
2. Name your repository and click **"Create repository"**
3. Clone your new repository:

```bash
git clone https://github.com/YOUR_USERNAME/your-repo-name.git
cd your-repo-name
npm install
```

### Step 2: Environment Variables

```bash
cp .env.example .env.local
```

Configure your `.env.local`:

```bash
# Site Branding
NEXT_PUBLIC_SITE_NAME=Your Site Name

# Clerk Authentication
# Get from: Clerk Dashboard → Your App → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Frontend API URL
# Get from: Clerk Dashboard → Configure → JWT Templates → Convex template
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev

# Convex (auto-configured by npx convex dev)
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# CSRF Protection (generate with: node -p "require('crypto').randomBytes(32).toString('base64url')")
CSRF_SECRET=<generate-this>
SESSION_SECRET=<generate-this>

# Clerk Redirects
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

### Step 3: Configure Convex

```bash
npx convex dev
```

This will prompt you to link your Convex project and automatically set the deployment URLs.

### Step 4: Set Up Clerk Webhook

1. Get your Convex HTTP Actions URL from the Convex dashboard
2. In Clerk Dashboard → Configure → Webhooks → Add Endpoint
3. URL: `{your-convex-url}/clerk-users-webhook`
4. Enable events: `user.created`, `user.updated`, `user.deleted`, `paymentAttempt.updated`
5. Copy the signing secret

### Step 5: Convex Environment Variables

In your Convex Dashboard → Settings → Environment Variables:

```bash
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev
ADMIN_EMAIL=your-admin-email@example.com
```

### Step 6: Enable Billing

1. Clerk Dashboard → Subscriptions → Create a Plan
2. Set name and monthly fee
3. Click "Enable Billing" at top of screen

### Step 7: Start Development

```bash
npm run dev        # Terminal 1
npx convex dev     # Terminal 2
```

Visit `http://localhost:3000`

---

## Using the Security Features

### CSRF Protection

Wrap your API handlers:

```typescript
import { withCsrf } from "@/lib/withCsrf";

async function handler(request: NextRequest) {
  return NextResponse.json({ success: true });
}

export const POST = withCsrf(handler);
```

Frontend usage:

```typescript
const { csrfToken } = await fetch("/api/csrf", { credentials: "include" }).then(r => r.json());

await fetch("/api/endpoint", {
  method: "POST",
  headers: { "X-CSRF-Token": csrfToken },
  credentials: "include",
  body: JSON.stringify(data),
});
```

### Rate Limiting

```typescript
import { withRateLimit } from "@/lib/withRateLimit";

export const POST = withRateLimit(handler);
```

### Input Validation

```typescript
import { validateRequest } from "@/lib/validateRequest";
import { createPostSchema } from "@/lib/validation";

const validation = validateRequest(createPostSchema, body);
if (!validation.success) return validation.response;

// validation.data is type-safe and XSS-sanitized
```

### Combining Protections

```typescript
export const POST = withRateLimit(withCsrf(handler));
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:

- Production Clerk and Convex setup
- Vercel configuration
- Webhook configuration for production
- Going live with real payments

---

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
├── convex/                 # Convex functions and schema
├── lib/                    # Utilities (validation, security, etc.)
├── .agents/
│   └── skills/
│       ├── security/       # Security implementation patterns
│       ├── gsd/            # Project management system
│       ├── frontend-design/# UI patterns
│       └── lessons/        # Your accumulated learnings
└── .planning/              # Project state (gitignored plans)
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License

---

**Stop rebuilding the same foundation over and over.** The Vibe Coders Starter Kit gives you authentication, payments, real-time data, security, and a workflow system that actually helps you ship.

Built with ❤️ by [Ken Rogers](https://kenrogers.co) for the [Vibe Coders](https://skool.com/vibecoders/about) community.
