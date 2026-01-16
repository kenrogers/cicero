# TDD: Test-Driven Development

**name**: tdd
**description**: Test-Driven Development patterns and reference for the /work flow. All feature work uses TDD by default. This skill provides test patterns for React components, API routes, and Convex functions. Reference when writing tests or debugging test failures.

---

## Purpose

**TDD is the default execution pattern for all feature work.** This skill provides reference patterns and guidelines for the Red-Green-Refactor cycle used by `/work` and `/execute`.

```
🔴 RED    → Write failing test (no implementation knowledge)
🟢 GREEN  → Minimal code to pass (only sees the test)
🔵 REFACTOR → Clean up (fresh evaluation of working code)
```

## Why TDD Is Default

When AI writes tests and implementation together, it:
- Designs tests around the implementation it's already planning
- Skips edge cases the implementation doesn't handle
- Creates tests that verify implementation details, not behavior

**Phase isolation forces genuine TDD** - the test writer truly doesn't know how the code will be implemented.

## Testing Stack

This project uses **Vitest** with React Testing Library:

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (Vite-native, fast) |
| @testing-library/react | Component testing |
| @testing-library/user-event | User interaction simulation |
| jsdom | Browser environment simulation |

## When This Skill Is Used

TDD is automatically applied during:

1. **`/work`**: All feature execution uses TDD
2. **`/execute`**: Plan execution follows Red-Green-Refactor
3. **Any feature implementation**: TDD is the default, not optional

## The TDD Cycle

```
╔══════════════════════════════════════════════════════════════╗
║                    TDD CYCLE                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  🔴 RED PHASE                                           │ ║
║  │  Write a failing test that describes desired behavior   │ ║
║  │  • Focus ONLY on what the feature should do             │ ║
║  │  • DO NOT think about implementation                    │ ║
║  │  • Test must fail (proves it's testing something real)  │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  🟢 GREEN PHASE                                         │ ║
║  │  Write MINIMAL code to make the test pass               │ ║
║  │  • Only see the test, not test-writing decisions        │ ║
║  │  • No premature optimization                            │ ║
║  │  • "Fake it till you make it" is valid                  │ ║
║  └────────────────────────┬────────────────────────────────┘ ║
║                           ▼                                  ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  🔵 REFACTOR PHASE                                      │ ║
║  │  Improve code quality without changing behavior         │ ║
║  │  • Fresh evaluation of working code                     │ ║
║  │  • Extract utilities, improve naming                    │ ║
║  │  • Tests MUST still pass after refactoring              │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  Repeat for each feature/behavior                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Workflow

### Phase 1: 🔴 RED - Write Failing Test

**Goal**: Describe behavior without knowing implementation

```
CONSTRAINTS:
├─ Do NOT read implementation files
├─ Do NOT plan how to implement
├─ Focus ONLY on user-visible behavior
└─ Test MUST fail when run
```

**Process**:

1. Understand the feature requirement
2. Write test describing expected behavior
3. Run test - confirm it fails
4. Document why it fails

**Test Writing Guidelines**:

```typescript
// ✅ Good: Tests behavior
it('should display error message when login fails', async () => {
  render(<LoginForm />);
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.type(screen.getByLabelText('Password'), 'wrong');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
  
  expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
});

// ❌ Bad: Tests implementation
it('should call setError with "Invalid credentials"', () => {
  // This tests HOW, not WHAT
});
```

**Output**:

```
╔══════════════════════════════════════════════════════════════╗
║  🔴 RED PHASE COMPLETE                                       ║
╠══════════════════════════════════════════════════════════════╣
║  Test: should display workout details when card is clicked   ║
║  File: src/components/WorkoutList.test.tsx                   ║
║  Status: FAILING ✓ (expected)                                ║
║  Error: Unable to find element with text "Bench Press"       ║
╚══════════════════════════════════════════════════════════════╝

Ready for GREEN phase? Say "green" or "continue".
```

### Phase 2: 🟢 GREEN - Make It Pass

**Goal**: Minimal implementation to satisfy the test

```
CONSTRAINTS:
├─ Only see the test file and its assertions
├─ Write MINIMAL code (no extras)
├─ "Fake it" is acceptable if it passes
├─ Do NOT refactor yet
└─ Test MUST pass when done
```

**Process**:

1. Read the failing test assertions
2. Write minimal code to pass
3. Run test - confirm it passes
4. Resist urge to optimize

**Output**:

```
╔══════════════════════════════════════════════════════════════╗
║  🟢 GREEN PHASE COMPLETE                                     ║
╠══════════════════════════════════════════════════════════════╣
║  Test: should display workout details when card is clicked   ║
║  Status: PASSING ✓                                           ║
║  Files Created:                                              ║
║  • src/components/WorkoutDetailView.tsx                      ║
║  • Modified: src/components/WorkoutList.tsx                  ║
╚══════════════════════════════════════════════════════════════╝

Ready for REFACTOR phase? Say "refactor" or "continue".
```

### Phase 3: 🔵 REFACTOR - Improve Quality

**Goal**: Clean up without changing behavior

```
CONSTRAINTS:
├─ Tests MUST still pass after changes
├─ Do NOT add new functionality
├─ Focus on code quality
└─ Extract reusable utilities
```

**Refactoring Checklist**:

- [ ] Remove duplication
- [ ] Improve naming
- [ ] Extract helper functions
- [ ] Simplify conditionals
- [ ] Add missing error handling
- [ ] Improve types

**Decision Framework**:

| Smell | Refactor Action |
|-------|-----------------|
| Duplicate code | Extract to utility |
| Long function | Split into smaller functions |
| Magic numbers | Extract to constants |
| Complex conditional | Use early returns or strategy pattern |
| Missing types | Add proper TypeScript types |
| No change needed | Skip refactor (valid!) |

**Output**:

```
╔══════════════════════════════════════════════════════════════╗
║  🔵 REFACTOR PHASE COMPLETE                                  ║
╠══════════════════════════════════════════════════════════════╣
║  Improvements Made:                                          ║
║  • Extracted useWorkoutDetail composable                     ║
║  • Created lib/formatters.ts for date/duration              ║
║  • Added keyboard navigation for accessibility               ║
║                                                              ║
║  Tests: Still passing ✓                                      ║
╚══════════════════════════════════════════════════════════════╝

TDD cycle complete! Another feature? Or say "done".
```

## Integration with /work

When TDD mode is active during `/work`:

```
/work (TDD mode)
├─ Learn from lessons (includes TDD-specific lessons)
├─ Oracle reviews plan (flags missing test cases)
├─ Execute with TDD cycle per feature:
│   ├─ 🔴 Write failing test
│   ├─ 🟢 Make it pass
│   ├─ 🔵 Refactor
│   └─ Commit (test + implementation together)
└─ Capture TDD learnings
```

### Commit Strategy

Each TDD cycle produces ONE atomic commit containing:
- The test file
- The implementation
- Any refactored utilities

```bash
git commit -m "feat: add workout detail view with tests"
```

## Test Patterns for This Stack

### Component Testing (React + Vitest)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ConvexProvider } from 'convex/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render content from database', async () => {
    // Arrange
    const mockClient = createMockConvexClient();
    
    // Act
    render(
      <ConvexProvider client={mockClient}>
        <MyComponent />
      </ConvexProvider>
    );
    
    // Assert
    expect(await screen.findByText('Expected content')).toBeInTheDocument();
  });
});
```

### API Route Testing (Next.js)

```typescript
import { describe, it, expect } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

describe('API Route', () => {
  it('should return data for authenticated user', async () => {
    const request = new NextRequest('http://localhost/api/endpoint', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer test-token' },
    });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
  });
});
```

### Convex Function Testing

```typescript
import { describe, it, expect } from 'vitest';
import { convexTest } from 'convex-test';
import { api } from '../convex/_generated/api';
import schema from '../convex/schema';

describe('Convex Functions', () => {
  it('should create a user', async () => {
    const t = convexTest(schema);
    
    const userId = await t.mutation(api.users.create, {
      name: 'Test User',
      email: 'test@example.com',
    });
    
    const user = await t.query(api.users.get, { id: userId });
    expect(user?.name).toBe('Test User');
  });
});
```

## Setup Requirements

If Vitest is not installed, run setup:

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react convex-test

# Create vitest.config.ts
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.next/', 'convex/_generated/'],
    },
  },
});
```

### Test Setup File

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Commands

| Command | Action |
|---------|--------|
| `/tdd [feature]` | Start TDD cycle for a feature |
| `red` | Start/continue RED phase |
| `green` | Start GREEN phase |
| `refactor` | Start REFACTOR phase |
| `skip refactor` | Skip if no refactoring needed |
| `done` | End TDD session |

## Example Session

```
User: /tdd implement user profile page

Agent: 🔧 Starting TDD session for: User Profile Page
       
       First, let me check if testing is set up...
       
       ✓ Vitest installed
       ✓ Testing library available
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔴 RED PHASE - Writing Failing Test                     ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Feature: User profile page displays user information    ║
       ╚══════════════════════════════════════════════════════════╝
       
       Writing test in app/profile/page.test.tsx...
       
       ```typescript
       describe('Profile Page', () => {
         it('should display user name and email', async () => {
           render(<ProfilePage />);
           
           expect(await screen.findByText('John Doe')).toBeInTheDocument();
           expect(screen.getByText('john@example.com')).toBeInTheDocument();
         });
       });
       ```
       
       Running test...
       
       ❌ FAIL: Cannot find element with text "John Doe"
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔴 RED PHASE COMPLETE                                   ║
       ║  Test is failing as expected. Ready for GREEN phase.     ║
       ╚══════════════════════════════════════════════════════════╝
       
       Say "green" to continue.

User: green

Agent: ╔══════════════════════════════════════════════════════════╗
       ║  🟢 GREEN PHASE - Minimal Implementation                 ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Goal: Make the test pass with minimal code              ║
       ╚══════════════════════════════════════════════════════════╝
       
       Creating app/profile/page.tsx...
       
       ```typescript
       export default function ProfilePage() {
         return (
           <div>
             <h1>John Doe</h1>
             <p>john@example.com</p>
           </div>
         );
       }
       ```
       
       Running test...
       
       ✓ PASS: Profile Page > should display user name and email
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🟢 GREEN PHASE COMPLETE                                 ║
       ║  Test passing! Ready for REFACTOR phase.                 ║
       ╚══════════════════════════════════════════════════════════╝
       
       Say "refactor" to improve, or "skip refactor" if clean.

User: refactor

Agent: ╔══════════════════════════════════════════════════════════╗
       ║  🔵 REFACTOR PHASE - Improving Quality                   ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Evaluating code for improvements...                     ║
       ╚══════════════════════════════════════════════════════════╝
       
       Identified improvements:
       • Hardcoded data → fetch from Clerk useUser()
       • No loading state → add skeleton
       • Missing error handling → add error boundary
       
       Refactoring...
       
       Running tests...
       
       ✓ PASS: Profile Page > should display user name and email
       ✓ PASS: Profile Page > should show loading state initially
       
       ╔══════════════════════════════════════════════════════════╗
       ║  🔵 REFACTOR PHASE COMPLETE                              ║
       ╠══════════════════════════════════════════════════════════╣
       ║  Improvements:                                           ║
       ║  • Integrated Clerk useUser() hook                       ║
       ║  • Added loading skeleton                                ║
       ║  • Added proper TypeScript types                         ║
       ║                                                          ║
       ║  Tests: 2/2 passing ✓                                    ║
       ╚══════════════════════════════════════════════════════════╝
       
       Committing: "feat: add user profile page with tests"
       
       ✓ TDD cycle complete!
       
       Another feature? Or say "done" to end session.
```

## Benefits

1. **Genuine Test-First**: Phase isolation prevents "cheating"
2. **Better Test Quality**: Tests describe behavior, not implementation
3. **Cleaner Code**: Refactor phase ensures quality
4. **Confidence**: Tests prove features work
5. **Documentation**: Tests serve as living documentation
6. **Regression Protection**: Changes break tests before they break users

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad | Better Approach |
|--------------|--------------|-----------------|
| Writing test + impl together | AI designs test around impl | Strict phase separation |
| Testing implementation details | Brittle tests | Test behavior/outcomes |
| Skipping RED phase | No proof test works | Always see test fail first |
| Over-testing | Slow tests, maintenance burden | Test behavior, not internals |
| Mocking everything | Tests don't prove real code works | Integration > unit mocks |
