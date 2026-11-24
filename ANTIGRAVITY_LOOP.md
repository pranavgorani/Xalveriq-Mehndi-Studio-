# Antigravity Engineering Loop

The Antigravity Loop is the disciplined cycle applied to develop, verify, and maintain the Xalveriq Mehndi Studio application.

```
       ┌─────────────────────────────┐
       │   1. Inspect & Reproduce    │
       │   - Read requirements       │
       │   - Run smoke/acceptance    │
       │   - Observe exact failure   │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │     2. Targeted Fix         │
       │   - Modify source code      │
       │   - Preserve working state  │
       │   - Adhere to design rules  │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │      3. Rerun Checks        │
       │   - Execute node checks.cjs │
       │   - Run test suite          │
       │   - Validate zero regress   │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │ 4. Multi-Viewport & A11y    │
       │   - Verify 390px & 1440px   │
       │   - Test keyboard & focus   │
       │   - Test overflow & states  │
       └─────────────────────────────┘
```

## Protocol Steps
1. **Reproduce**: Run `node tests/smoke.cjs` to establish baseline health. If an issue is reported, isolate the exact assertion, input condition, and viewport.
2. **Fix**: Apply surgical changes to `index.html`, `studio.js`, `studio.css`, or `mood.js`. Never introduce breaking changes or third-party tracking scripts.
3. **Verify**: Run the full CDP test suite across 390px and 1440px viewports to verify that all functional criteria, calculations, and accessibility checks pass.
4. **Document**: Record changed files, exact checks performed, calculation totals, and preview instructions.
