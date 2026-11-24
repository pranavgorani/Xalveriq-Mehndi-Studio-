# Xalveriq Mehndi Studio

A contemporary henna atelier web application crafted with a warm, editorial aesthetic in plum (`#412530`), ivory (`#faf7f1`), and muted gold (`#e9be8c`).

## Overview

Xalveriq Mehndi Studio offers an end-to-end client consultation experience for planning bespoke mehndi appointments in Mumbai and destination venues:
- **Design Inspiration Gallery**: Explore signature collections (Bridal Heirloom, Arabic Florals, Modern Minimal) with full motif and placement details.
- **Natural-Language Style Finder**: On-device keyword matcher translating design descriptions into tailored collection suggestions and downloadable artist briefs.
- **Visual Mood Board**: On-device RGB 64-bin palette extraction matching client inspiration photos directly against collection imagery with zero network upload leaks.
- **Appointment Estimator**: Itemised, transparent pricing calculator adhering strictly to Mumbai studio rates, coverage bases, occasion multipliers, and travel tiers.
- **WhatsApp Enquiry Handoff**: Formatted booking message preview with dynamic link generation supporting direct studio chat or the system contact chooser.
- **Studio FAQ Assistant**: Instant answers for scheduling, travel radii, aftercare instructions, and rate transparency.

## Getting Started

### Prerequisites
- Node.js 18+ (tested with Node.js 22+)
- Google Chrome or Chromium installed

### Starting the Local Server
```bash
node serve.cjs
```
The studio web app runs at `http://127.0.0.1:4173`.

### Running Smoke & Acceptance Tests
```bash
node tests/smoke.cjs
```
or directly:
```bash
node checks.cjs
```
The automated test suite runs a complete end-to-end CDP audit across mobile (390px) and desktop (1440px) viewports.

## Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture, components, privacy, and data flow.
- [REQUIREMENTS.md](REQUIREMENTS.md) - Detailed pricing matrices, rules, and functional specifications.
- [ACCEPTANCE.md](ACCEPTANCE.md) - Acceptance criteria and test coverage checklist.
- [ANTIGRAVITY_LOOP.md](ANTIGRAVITY_LOOP.md) - Reproduce-fix-verify development loop.
