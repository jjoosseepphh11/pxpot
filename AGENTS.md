# Multi-Agent Workflow & Governance (`AGENTS.md`)

This document defines the roles, operating rules, constraints, and execution lifecycle for building this personal portfolio website. All agents and subagents working in this repository must strictly adhere to the standards established here and in [`BRIEF.md`](file:///c:/Users/patrick/Documents/otep-portfolio/BRIEF.md).

---

## 1. Core Operating Principles & Hard Constraints

Every agent is bound by the following non-negotiable constraints from [`BRIEF.md`](file:///c:/Users/patrick/Documents/otep-portfolio/BRIEF.md):

1. **No External Assets**:
   - Do NOT import or reference downloaded 3D models, stock images, video files, or external CDN assets.
   - Everything visual must be generated with code (CSS, SVG, HTML canvas, or procedural Three.js).
   - Project media slots must use structured, clearly marked code placeholders until the user provides final assets.
2. **Transform & Opacity Only (Zero Layout Thrashing)**:
   - All motion and interactive animations must be strictly constrained to `transform` and `opacity`.
   - Never animate properties that trigger browser reflow/layout recalculation (e.g., `width`, `height`, `top`, `left`, `margin`, `padding`).
   - Every animation must feel calm, restrained, and smooth. If an effect hurts readability or frame rate, remove it.
3. **Strictly Pinned Dependencies**:
   - Every entry in `package.json` must be exact and pinned (no `^` or `~` ranges).
   - Never add or install new libraries without explicit prior approval from the user.
4. **Mandatory `prefers-reduced-motion` Fallbacks**:
   - Every animation, transition, and dynamic scroll effect must provide a complete, elegant fallback for users who prefer reduced motion (gracefully degrading to simple opacity crossfades or static states).
5. **Zero Invented Personal Content**:
   - Never hallucinate, invent, or assume personal details, bio copy, client names, project summaries, or contact info.
   - Use standardized, prominent placeholders (e.g., `[PROJECT_TITLE_PLACEHOLDER]`, `[BIO_PLACEHOLDER]`) or ask the user directly.
6. **Strict Milestone Approval Gates**:
   - Work must proceed strictly milestone by milestone as defined in [`BRIEF.md`](file:///c:/Users/patrick/Documents/otep-portfolio/BRIEF.md).
   - Stop and request user review and approval at the end of each milestone. Never proceed to the next milestone until explicit user sign-off is received.

---

## 2. Multi-Agent Roster & Skill Wirings

Four specialized subagents operate within this workspace, located in `.agents/agents/`:

| Agent | File | Responsibilities | Wired Skills (`.agents/skills/`) | Scope Boundary |
|---|---|---|---|---|
| **Manager** | Orchestrator | Design critique, spacing/padding triage, element collision prevention, subagent governance | `design-manager`, `frontend-design`, `impeccable` | Workspace-wide architectural and design quality gatekeeper |
| **Builder** | [`.agents/agents/builder.md`](file:///c:/Users/patrick/Documents/otep-portfolio/.agents/agents/builder.md) | Milestone implementation, HTML/CSS/TS, layout, theme tokens, GSAP/Lenis setup | `frontend-design`, `gsap-core`, `gsap-scrolltrigger` | Only edits files assigned to the active milestone |
| **Furnisher** | [`.agents/agents/furnisher.md`](file:///c:/Users/patrick/Documents/otep-portfolio/.agents/agents/furnisher.md) | Motion polish, typography hierarchy, easing curves, day-to-night shifts, micro-interactions | `impeccable`, `gsap-performance` | Focuses purely on visual restraint, spacing, and silky transitions |
| **Auditor** | [`.agents/agents/auditor.md`](file:///c:/Users/patrick/Documents/otep-portfolio/.agents/agents/auditor.md) | Accessibility (a11y), WCAG contrast across shifts, reduced-motion fallback, brief compliance | `web-design-guidelines`, `accessible-animation` | Read-only inspection; flags violations of brief or a11y standards |
| **Tester** | [`.agents/agents/tester.md`](file:///c:/Users/patrick/Documents/otep-portfolio/.agents/agents/tester.md) | Production build verification, console/runtime errors, responsive viewports, Lighthouse 90+ | Production build tools, headless testing | Validates zero build/runtime errors and performance budgets |

---

## 3. Milestone Execution Lifecycle

For every milestone, all agents must execute the following structured 4-phase loop:

```
[Phase 1: Builder]
  └── Implements the scoped milestone files (tokens, semantic markup, core GSAP/Lenis logic)
         │
         ▼
[Phase 2: Furnisher]
  └── Polishes typography, micro-interactions, easing, and day-to-night transitions (transform/opacity only)
         │
         ▼
[Phase 3: Parallel Audit & Test]
  ├── Auditor: Checks a11y (WCAG contrast, semantic HTML, keyboard nav, reduced motion) & brief constraints
  └── Tester: Runs production build, checks console/runtime errors, tests viewports, audits Lighthouse
         │
         ▼
[Phase 4: Synthesis & Milestone Gate]
  ├── Address and resolve any findings from Auditor or Tester
  └── STOP and present the Milestone Report to the user:
        (a) Summary of changes
        (b) How to run and view locally
        (c) Audit & test verification results
        (d) Specific checklist of items for the user to review
  └── WAIT for explicit user approval before touching the next milestone
```
