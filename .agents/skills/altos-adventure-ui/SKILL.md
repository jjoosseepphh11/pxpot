---
name: altos-adventure-ui
description: Design principles and specifications for an Alto's Adventure-inspired minimalist, atmospheric flat vector UI aesthetic with fluid motion, dynamic lighting, soft pill geometry, and frosted glass depth.
license: MIT
---

# Alto's Adventure Atmospheric UI Design System

## 1. Core Visual Philosophy
- **Minimalist Flat Vector Atmosphere**: Clean silhouettes, soft multi-layered landscape planes, dynamic diurnal color transitions (Dawn Rose ➔ Solar Zenith ➔ Sunset Gold ➔ Midnight Obsidian).
- **Soft Pill & Continuous Curvature**: ZERO sharp box corners. All interactive cards, dialogs, media frames, and buttons use generous pill-inspired radii (`border-radius: clamp(16px, 2vw, 24px)` on cards; `border-radius: 9999px` on pills and action triggers).
- **Atmospheric Frosted Glass**: Translucent surfaces (`backdrop-filter: blur(20px)`) that let ambient sky gradients breathe through, unified by subtle 1px border lighting (`color-mix(in srgb, var(--theme-accent) 25%, var(--theme-border))`).
- **Restrained Typographic Hierarchy**: Clean, human sans-serif paired with crisp monospaced telemetry (`JetBrains Mono`). Generous vertical clearance and intentional breathing room.

## 2. Card Architecture (Inspired by Alto's Adventure Workshop & Reference Diagrams)
1. **Container Geometry**:
   - `border-radius: clamp(18px, 2.5vw, 26px)`
   - Soft elevated atmospheric drop shadow (`box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.16)`)
   - Subtle top-down edge glow highlighting the card top edge (`border-top: 1px solid rgba(255, 255, 255, 0.3)`)
2. **Media Framing**:
   - Framed media preview with matching rounded corners (`border-radius: clamp(12px, 1.6vw, 18px)`).
   - Uniform 16:10 aspect ratio with gentle hover zoom (`scale(1.03)` with `transform` only).
   - Clean category/status overlay chip docked at the bottom with frosted blur.
3. **Information Layout**:
   - **Header Row**: Pill badge tag (`MOMENT 0X`) + metadata pill tag (`DISCIPLINE`).
   - **Headline**: Bold, atmospheric title with tight letter-spacing.
   - **Summary**: Concise narrative copy (2 lines maximum) focusing on core impact.
   - **Telemetry Pill Chips**: Minimalist badge chips showing key technologies and metrics.
   - **Action Button**: Elegant frosted pill button (`border-radius: 9999px`) with arrow glyph (`↗`), expanding slightly on hover with tactile feedback.

## 3. Kinetic & Lighting Rules
- Transform and opacity ONLY for 60fps compositor locking.
- Micro-interactions: Cards elevate slightly on hover (`translateY(-4px)`), with edge glow brightening subtly.
- Full support for `prefers-reduced-motion` graceful degradation to simple opacity transitions.
