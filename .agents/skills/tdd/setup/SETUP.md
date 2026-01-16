# TDD Setup Instructions

Run this setup when first using TDD in this project.

## Quick Setup

```bash
# 1. Install dependencies
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react convex-test @vitest/coverage-v8

# 2. Copy config files
cp .agents/skills/tdd/setup/vitest.config.ts.template vitest.config.ts
cp .agents/skills/tdd/setup/vitest.setup.ts.template vitest.setup.ts

# 3. Add scripts to package.json
```

## Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## TypeScript Configuration

Add to `tsconfig.json` compilerOptions:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## Verify Setup

```bash
# Run a quick test to verify
npm run test:run
```

If tests run (even with 0 tests), setup is complete!
