# Agent Browser Testing

**name**: agent-browser-testing
**description**: Browser-based UI testing using Vercel's agent-browser. Use for visual verification of UI features before committing. Integrated into the /work TDD flow for automated browser testing of UI changes. Triggers include "browser test", "visual test", "UI test", "agent browser", "test in browser", "verify UI".

---

## Purpose

Provides AI-driven browser testing using Vercel's agent-browser for visual verification of UI features. This is integrated into the TDD workflow to test UI changes in a real browser before committing.

## When to Use

Browser testing is triggered automatically in the /work flow when a task involves:
- **UI components**: Pages, layouts, forms, modals, dialogs
- **User interactions**: Buttons, links, navigation, form submissions
- **Visual changes**: Styling, responsive design, animations
- **User flows**: Authentication, checkout, onboarding

Browser testing is NOT needed for:
- Database/API-only changes
- Backend logic changes
- Type definitions or schemas
- Configuration files
- Documentation

## Integration with /work Flow

```
╔══════════════════════════════════════════════════════════════╗
║  TDD EXECUTION WITH BROWSER TESTING                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🔴 RED → 🟢 GREEN → 🔵 REFACTOR                              ║
║                           ▼                                  ║
║  🌐 BROWSER TEST (if UI relevant)                            ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  1. Start dev server if not running                     │ ║
║  │  2. Navigate to affected page                           │ ║
║  │  3. Get interactive snapshot                            │ ║
║  │  4. Verify expected elements exist                      │ ║
║  │  5. Test user interactions                              │ ║
║  │  6. Capture screenshot on failure                       │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ✓ COMMIT (only if browser test passes)                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Usage

### CLI Commands (Quick Reference)

```bash
# Navigate to a page
agent-browser open http://localhost:3000/page

# Get interactive elements (AI-optimized snapshot)
agent-browser snapshot -i --json

# Click element by ref
agent-browser click @e2

# Fill input by ref
agent-browser fill @e3 "test input"

# Get element text
agent-browser get text @e1

# Take screenshot
agent-browser screenshot test-result.png

# Check element visibility
agent-browser is visible "#submit-button"

# Wait for element
agent-browser wait "[data-testid='loading']"
agent-browser wait --text "Welcome"
```

### Workflow Pattern for UI Testing

```bash
# 1. Ensure dev server is running (in separate terminal)
# npm run dev

# 2. Open the page you want to test
agent-browser open http://localhost:3000/your-page

# 3. Get snapshot of interactive elements
agent-browser snapshot -i

# 4. Parse the snapshot, identify elements by refs (@e1, @e2, etc.)

# 5. Interact and verify
agent-browser click @e3              # Click button
agent-browser fill @e1 "test@test.com"  # Fill input
agent-browser get text @e2           # Verify text

# 6. Capture final state
agent-browser screenshot verify.png
```

### Session Isolation

Each test can use an isolated session:

```bash
# Create isolated session for this test
agent-browser --session test-auth open http://localhost:3000/login

# Use same session for subsequent commands
agent-browser --session test-auth fill @e1 "user@test.com"
agent-browser --session test-auth fill @e2 "password123"
agent-browser --session test-auth click @e3
```

## Decision Logic for Browser Testing

When completing a TDD task, evaluate:

```
SHOULD RUN BROWSER TEST?
├─ Does task modify app/ pages or routes? → YES
├─ Does task modify components/ UI components? → YES  
├─ Does task add new user-facing features? → YES
├─ Does task change styling or layout? → YES
├─ Does task modify forms or user inputs? → YES
├─ Is it a convex/ backend-only change? → NO
├─ Is it a lib/ utility-only change? → NO (unless UI-related)
├─ Is it docs or config only? → NO
└─ When in doubt → YES (better to verify)
```

## Example Browser Test Session

```
╔══════════════════════════════════════════════════════════════╗
║  🌐 BROWSER TEST: Login Page                                 ║
╠══════════════════════════════════════════════════════════════╣
║  Page: http://localhost:3000/sign-in                         ║
║                                                              ║
║  Verifying:                                                  ║
║  ✓ Email input visible (@e1)                                 ║
║  ✓ Password input visible (@e2)                              ║
║  ✓ Sign in button enabled (@e3)                              ║
║  ✓ "Forgot password?" link present (@e5)                     ║
║                                                              ║
║  Testing interaction:                                        ║
║  ✓ Filled email field                                        ║
║  ✓ Filled password field                                     ║
║  ✓ Submit button clickable                                   ║
║                                                              ║
║  Result: ✅ PASS                                             ║
╚══════════════════════════════════════════════════════════════╝
```

## Failure Handling

When browser test fails:

```
╔══════════════════════════════════════════════════════════════╗
║  🌐 BROWSER TEST: Failed                                     ║
╠══════════════════════════════════════════════════════════════╣
║  Page: http://localhost:3000/dashboard                       ║
║                                                              ║
║  ❌ Expected element not found: "Welcome, User"              ║
║  📸 Screenshot saved: .planning/test-failures/dashboard.png  ║
║                                                              ║
║  Consulting Oracle to debug...                               ║
╚══════════════════════════════════════════════════════════════╝
```

1. Screenshot captured for debugging
2. Oracle consulted with failure context
3. Fix applied and re-tested
4. Only commit after browser test passes

## Best Practices

1. **Always check dev server is running** before browser tests
2. **Use refs (@e1, @e2)** from snapshots for deterministic selection
3. **Capture screenshots** on failures for debugging
4. **Use isolated sessions** for auth-related tests
5. **Test the happy path** - browser tests verify functionality, not edge cases
6. **Keep tests fast** - just verify the feature works, don't exhaustive test

## Related Skills

- `gsd/work` - Main workflow that integrates browser testing
- `gsd/tdd` - TDD patterns and practices
- `security-testing` - Security verification testing
