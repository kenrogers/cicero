# Deep Questioning for Project Initialization

## Purpose

The questioning phase captures everything needed to maintain project context across sessions. Better questions → better PROJECT.md → better roadmap → faster execution.

## Questioning Philosophy

### Ask to Understand, Not to Document

Don't ask questions just to fill in a template. Ask questions that reveal:
- What success looks like
- What constraints exist
- What's explicitly out of scope
- What decisions have already been made

### The "One More Why" Technique

When you get an answer, ask one more "why" to get to the real requirement.

```
Q: "What's the main feature?"
A: "User authentication"
Q: "Why is auth the main feature?"
A: "Because we need to track per-user data"
→ Now you know: it's not about auth, it's about per-user data
```

### Silence Is Information

If the user struggles to answer, that's valuable:
- They might not have decided yet (help them decide)
- The question might be wrong (reframe it)
- This might be a risk area (flag it)

## Required Questions

Ask these for every project:

### 1. Vision
> "In one sentence, what does this project do when it's done?"

Why: Forces clarity. If they can't say it in one sentence, they don't know yet.

Good answers:
- "A task manager for developers that syncs with GitHub issues"
- "A CLI tool that generates database migrations from TypeScript"

Bad answers (dig deeper):
- "A platform for productivity" (too vague)
- "It does lots of things" (undefined scope)

### 2. Users
> "Who uses this and what's their primary workflow?"

Why: Reveals the core use case. Everything else is secondary.

Good format:
```
User: [type of user]
Workflow:
1. They open the app
2. They do [primary action]
3. They achieve [outcome]
```

### 3. Success Criteria
> "How will you know this project succeeded? What's the must-ship feature?"

Why: Defines done. Without this, scope creeps forever.

Push for measurable outcomes:
- ✅ "Users can create and complete tasks"
- ❌ "Users like it" (not measurable)

### 4. Constraints
> "What technical constraints exist? (existing stack, hosting, budget, timeline)"

Why: Constraints shape solutions. Knowing them early prevents rework.

Look for:
- Required technologies
- Hosting restrictions
- Timeline pressure
- Budget limits
- Integration requirements

### 5. Scope Control
> "What are you explicitly NOT building in v1?"

Why: The hardest question but the most important. No project fails from too little scope.

Push for specifics:
- ✅ "No mobile app, no team features, no analytics dashboard"
- ❌ "We'll keep it simple" (not specific)

## Contextual Questions

Pick 2-3 based on the project type:

### For Web Applications
- "What's the deployment target?" (Vercel, AWS, self-hosted)
- "Any authentication requirements?" (OAuth, email, none)
- "What's the data model look like at a high level?"
- "Will this need real-time features?"

### For APIs
- "Who consumes this API?" (internal, partners, public)
- "What's the expected load?"
- "Are there existing APIs to stay compatible with?"
- "What's the auth strategy?"

### For CLI Tools
- "What's the primary command structure?"
- "Does it need configuration files?"
- "What's the installation method?"
- "Does it need to run in CI?"

### For Integrations
- "What APIs are we integrating with?"
- "Are there rate limits or quotas?"
- "How do we handle API failures?"
- "What's the authentication flow?"

### For Brownfield Projects
- "What's already built vs what needs building?"
- "What are the pain points in the current codebase?"
- "Any technical debt we need to address?"
- "Are there patterns we should follow or avoid?"

## Handling Unclear Answers

### When They Don't Know

Help them decide:
```
"Sounds like that's still open. Let me offer some options:
A) [option 1] - good for [scenario]
B) [option 2] - good for [scenario]
Which feels closer to what you need?"
```

### When They Over-Scope

Redirect gently:
```
"That's ambitious! For v1, which of these is the must-have:
- [feature A]
- [feature B]
- [feature C]

We can roadmap the others for later phases."
```

### When They Under-Specify

Dig deeper:
```
"When you say 'task management', can you walk me through 
a specific example of what a user would do?"
```

## Brownfield Detection Questions

For existing codebases:

1. **Orientation**: "Can you give me a quick tour of the codebase structure?"
2. **Patterns**: "What patterns or conventions are already established?"
3. **Pain Points**: "What's painful about working in this codebase?"
4. **Off-Limits**: "Is there code we shouldn't touch or refactor?"
5. **Tests**: "What's the testing situation?"

## Question Order Strategy

1. Start broad (vision, users)
2. Get specific (success criteria, constraints)
3. Define boundaries (what's out of scope)
4. Fill gaps (contextual questions)
5. Confirm understanding

## The Summary Confirm

After questioning, confirm understanding:

```
"Let me make sure I've got this:

You're building [vision] for [users] who want to [workflow].

Success means [criteria]. You're constrained by [constraints].

Explicitly not in v1: [out of scope items].

Did I miss anything?"
```

This gives them a chance to correct misunderstandings before you commit to planning.

## Anti-Patterns

### Don't Ask
- Obvious questions (things you can see in the codebase)
- Multiple questions at once (one at a time)
- Leading questions ("You want auth, right?")
- Technical questions before understanding requirements

### Don't Assume
- Technology choices (ask about constraints first)
- User preferences (ask what they want)
- Scope (always ask what's out)
- Timeline (ask about constraints)

## Example Questioning Session

```
Agent: Let's capture your project vision. In one sentence, 
       what does this project do when it's done?

User: It's a task management app for developers

Agent: Got it. Who uses this and what's their primary workflow?

User: Developers who want to track tasks alongside their GitHub repos

Agent: So the core workflow is: developer opens app, sees tasks 
       linked to their repos, and manages them. Is that right?

User: Yes, exactly

Agent: How will you know this succeeded? What's the must-ship feature?

User: If users can create tasks and link them to GitHub issues

Agent: What technical constraints exist? Any required tech or timeline?

User: Using Next.js and Convex, deploying to Vercel. 
      Want MVP in a few weeks.

Agent: Last question - what are you explicitly NOT building in v1?

User: No mobile app, no team features, no notifications

Agent: Perfect. Let me confirm:

       You're building a task manager for developers that links 
       tasks to GitHub issues. Success = creating tasks and linking 
       to issues. Stack is Next.js/Convex/Vercel. Timeline is MVP 
       in a few weeks. No mobile, teams, or notifications in v1.
       
       Ready to create PROJECT.md?
```
