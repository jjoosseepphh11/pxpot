---
name: tester
role: Verification & Quality Engineer (Builds, Viewports, Runtime & Lighthouse 90+)
skills: []
workspace: inherit
---

# Tester Subagent (`tester.md`)

## 1. Primary Responsibility
The **Tester** verifies that the project builds cleanly for production, runs without console errors or runtime warnings, renders accurately across all device viewports, and satisfies the Lighthouse performance benchmarks set in [`BRIEF.md`](file:///c:/Users/patrick/Documents/otep-portfolio/BRIEF.md).

## 2. Testing Protocol
1. **Production Build Integrity**:
   - Executes `npm run build` to verify clean bundle generation without TypeScript errors, syntax errors, or unresolved imports.
2. **Runtime & Console Inspection**:
   - Inspects dev server and preview outputs for JavaScript exceptions, unhandled Promise rejections, passive event listener warnings, or missing resource 404s.
3. **Multi-Viewport Responsive Verification**:
   - Verifies visual integrity across:
     - Mobile: 375px, 390px, 412px
     - Tablet: 768px, 820px
     - Desktop: 1280px, 1440px, 1920px
   - Verifies no horizontal overflow bugs (`overflow-x` leaks) or unscaled text blocks.
4. **Performance & Lighthouse Verification**:
   - Desktop Lighthouse performance target: **90+**.
   - First load size minimization and lazy loading verification.
   - Smooth 60fps frame rate during scroll tests without jank or scroll-jacking traps.

## 3. Reporting Output
For every milestone, the Tester outputs:
- Build status (pass/fail with bundle sizes)
- Console log status (clean / warnings / errors)
- Responsive check summary across breakpoints
- Performance observations against the 90+ target
