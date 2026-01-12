# PLAN.md Format Reference

## Why XML Task Structure?

The XML format provides:
1. **Clear boundaries**: Each section is unambiguous
2. **Parseable**: Can be extracted programmatically if needed
3. **Self-documenting**: Tag names explain purpose
4. **Consistent**: Same structure every time

## Complete Task Template

```xml
<task id="[number]">
  <objective>
    [Single sentence describing what this task accomplishes]
  </objective>
  <context>
    [Everything needed to execute without external knowledge]
    
    Files to modify:
    - path/to/file1.ts
    - path/to/file2.ts
    
    Files to create:
    - path/to/new/file.ts
    
    Related patterns (reference existing code):
    - See path/to/similar.ts for pattern
    
    Relevant decisions:
    - Decision from STATE.md
    
    Dependencies:
    - This task depends on [what]
    - Previous task created [what]
  </context>
  <action>
    1. [Specific step with file paths]
    2. [Next step with expected outcome]
    3. [Continue with details]
  </action>
  <verify>
    - [ ] [Specific verification with command]
    - [ ] [Expected outcome check]
    - [ ] [Manual verification if needed]
  </verify>
  <done>[type]: [descriptive commit message]</done>
</task>
```

## Section Details

### `<objective>`

Single sentence. What, not how.

✅ Good:
- "Set up Clerk authentication with protected routes"
- "Create database schema for users and tasks"
- "Implement task CRUD API endpoints"

❌ Bad:
- "Do the auth stuff"
- "Write code for the database"
- "Make it work"

### `<context>`

Everything the executor needs to know. Assume they have no prior context.

Include:
- **Files to modify**: Exact paths
- **Files to create**: Exact paths with parent directories
- **Patterns to follow**: References to existing similar code
- **Decisions**: Relevant choices from STATE.md
- **Dependencies**: What this task builds on

Example:
```xml
<context>
  This task sets up authentication using Clerk.
  
  Files to modify:
  - app/layout.tsx (wrap with ClerkProvider)
  - middleware.ts (create, configure protected routes)
  
  Files to create:
  - app/sign-in/[[...sign-in]]/page.tsx
  - app/sign-up/[[...sign-up]]/page.tsx
  
  Related patterns:
  - Existing provider pattern in app/providers.tsx
  
  Decisions:
  - Using Clerk over Auth0 (faster setup, better DX)
  
  Environment:
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must be set
  - CLERK_SECRET_KEY must be set
</context>
```

### `<action>`

Step-by-step implementation. Be specific.

Guidelines:
- Number each step
- Include file paths in steps
- Include expected outcomes
- Don't assume knowledge

Example:
```xml
<action>
  1. Install Clerk: npm install @clerk/nextjs
  
  2. Create middleware.ts at project root:
     - Export clerkMiddleware()
     - Configure matcher for API and protected routes
  
  3. Update app/layout.tsx:
     - Import ClerkProvider from @clerk/nextjs
     - Wrap {children} with ClerkProvider
  
  4. Create sign-in page at app/sign-in/[[...sign-in]]/page.tsx:
     - Import SignIn from @clerk/nextjs
     - Return <SignIn /> component
  
  5. Create sign-up page at app/sign-up/[[...sign-up]]/page.tsx:
     - Import SignUp from @clerk/nextjs
     - Return <SignUp /> component
  
  6. Add environment variables to .env.local:
     - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     - CLERK_SECRET_KEY
     - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
     - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
</action>
```

### `<verify>`

How to confirm the task is complete. Must be runnable/checkable.

Types of verification:
- **Command output**: `npm run typecheck` passes
- **Visual check**: Page renders at /path
- **API test**: `curl localhost:3000/api/x` returns expected
- **Behavior**: Clicking X does Y

Example:
```xml
<verify>
  - [ ] npm run typecheck passes with no errors
  - [ ] npm run dev starts without errors
  - [ ] Visiting /sign-in shows Clerk sign-in form
  - [ ] Visiting /sign-up shows Clerk sign-up form  
  - [ ] Protected routes redirect to /sign-in when not authenticated
  - [ ] After sign-in, user can access protected routes
</verify>
```

### `<done>`

Commit message in conventional commit format.

Format: `type: description`

Types:
| Type | Use For |
|------|---------|
| feat | New feature |
| fix | Bug fix |
| refactor | Code restructuring |
| test | Test changes |
| docs | Documentation |
| chore | Maintenance/config |
| style | Formatting only |

Examples:
```xml
<done>feat: add Clerk authentication with protected routes</done>
<done>feat: create database schema for users and tasks</done>
<done>fix: resolve race condition in task updates</done>
<done>refactor: extract validation into shared utility</done>
<done>test: add integration tests for auth flow</done>
```

## Task Sizing

### Too Large
If action has more than 6-8 steps, split into multiple tasks.

### Too Small
If action has 1-2 trivial steps, combine with related work.

### Just Right
3-5 substantial steps that result in a meaningful, committable change.

## Task Dependencies

Tasks execute sequentially. Task 2 can reference Task 1's output.

```xml
<task id="1">
  <objective>Create user model and schema</objective>
  ...
</task>

<task id="2">
  <objective>Create task model with user relationship</objective>
  <context>
    Builds on Task 1's user schema.
    
    Files to modify:
    - convex/schema.ts (add tasks table with userId reference)
    ...
  </context>
  ...
</task>
```

## Context Window Efficiency

### Do
- Reference files by path, don't copy content
- Point to patterns, don't duplicate them
- Use "see X for pattern" instead of explaining

### Don't
- Copy large code blocks into context
- Repeat information from previous tasks
- Include unnecessary background

## Full Plan Example

```markdown
# Plan: Phase 01 - Foundation

> Phase 01 of DevTask
> Created: 2024-01-15

## Objective

Set up project foundation: Next.js with TypeScript, Clerk auth, and Convex database.

## Context

Greenfield project. Stack: Next.js 15, Convex, Clerk, Tailwind.
Mode: standard, Depth: interactive

## Tasks

<task id="1">
  <objective>Initialize Next.js project with TypeScript and Tailwind</objective>
  <context>
    Starting from empty directory.
    
    Files to create:
    - Standard Next.js App Router structure
    - Tailwind configuration
    
    Stack decisions:
    - Next.js 15 with App Router
    - TypeScript strict mode
    - Tailwind for styling
  </context>
  <action>
    1. Run: npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
       - Accept default options
    
    2. Verify package.json has correct dependencies
    
    3. Run: npm run dev
       - Confirm app starts on localhost:3000
  </action>
  <verify>
    - [ ] npm run dev starts without errors
    - [ ] localhost:3000 shows Next.js welcome page
    - [ ] TypeScript compilation succeeds
  </verify>
  <done>feat: initialize Next.js with TypeScript and Tailwind</done>
</task>

<task id="2">
  <objective>Set up Convex backend with initial configuration</objective>
  <context>
    Next.js app from Task 1 is ready.
    
    Files to create:
    - convex/ directory structure
    - app/providers.tsx for ConvexProvider
    
    Files to modify:
    - app/layout.tsx (add ConvexProvider)
    - package.json (add convex dependency)
  </context>
  <action>
    1. Install: npm install convex
    
    2. Run: npx convex dev
       - This creates convex/ directory
       - Creates initial configuration
    
    3. Create app/providers.tsx:
       - Import ConvexProvider and ConvexReactClient
       - Create and export provider component
    
    4. Update app/layout.tsx:
       - Wrap children with providers
  </action>
  <verify>
    - [ ] npm run dev starts without errors
    - [ ] npx convex dev connects successfully
    - [ ] No TypeScript errors in convex/ directory
  </verify>
  <done>feat: configure Convex backend</done>
</task>

<task id="3">
  <objective>Add Clerk authentication with protected routes</objective>
  <context>
    Next.js + Convex from Tasks 1-2.
    
    Files to create:
    - middleware.ts
    - app/sign-in/[[...sign-in]]/page.tsx
    - app/sign-up/[[...sign-up]]/page.tsx
    
    Files to modify:
    - app/layout.tsx (add ClerkProvider)
    - app/providers.tsx (integrate Clerk with Convex)
    
    Environment needed:
    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    - CLERK_SECRET_KEY
  </context>
  <action>
    1. Install: npm install @clerk/nextjs
    
    2. Create middleware.ts at project root:
       - Configure clerkMiddleware
       - Set up route matchers
    
    3. Add ClerkProvider to layout.tsx
    
    4. Create sign-in and sign-up pages
    
    5. Configure environment variables in .env.local
  </action>
  <verify>
    - [ ] npm run typecheck passes
    - [ ] /sign-in shows Clerk login
    - [ ] /sign-up shows Clerk registration
    - [ ] Protected routes redirect when not auth'd
  </verify>
  <done>feat: add Clerk authentication</done>
</task>

## Success Criteria

- [ ] Next.js app runs with TypeScript
- [ ] Convex backend connected
- [ ] Clerk authentication working
- [ ] Protected routes functional
```
