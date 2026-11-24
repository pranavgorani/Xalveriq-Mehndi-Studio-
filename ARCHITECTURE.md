# Architecture & Design

## System Architecture

Xalveriq Mehndi Studio is built as a zero-dependency, high-performance, offline-capable single-page application (SPA).

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                     index.html                      │   │
│   │   - Semantic HTML5 landmarks & dialogs              │   │
│   │   - Mobile-first responsive architecture            │   │
│   └─────────────────────────────────────────────────────┘   │
│         │                         │               │         │
│   ┌─────────────┐          ┌─────────────┐ ┌─────────────┐  │
│   │ studio.css  │          │  studio.js  │ │   mood.js   │  │
│   │ Design tokens          │ Booking &   │ │ On-device   │  │
│   │ Responsive             │ Style logic │ │ Canvas RGB  │  │
│   └─────────────┘          └─────────────┘ └─────────────┘  │
│                                   │                         │
│                            ┌─────────────┐                  │
│                            │  config.js  │                  │
│                            │ Studio num  │                  │
│                            └─────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
               HTTP Static (Zero Network Calls)
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Local Static Server                      │
│                  (serve.cjs / port 4173)                    │
│   Serves assets/*.webp, html, css, js without 3rd parties   │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Components

### 1. Style Finder Engine (`studio.js`)
- **Natural-Language Analysis**: Tokenizes user preferences into lowercase word sets.
- **Scoring**: Calculates keyword overlap against defined style terms (`terms`).
- **Disambiguation**: If top score is 0 or ties with the second ranked style, prompts the client to add a visual detail (e.g., paisley, vine, dots).
- **Handoff**: Automatically sets suggested occasion, preselects coverage tier, and syncs style into the booking calculator.

### 2. On-Device Mood Board & Palette Matcher (`mood.js`)
- **Privacy-First Processing**: Uses the HTML5 `<canvas>` API to process uploaded inspiration photos entirely in memory (`URL.createObjectURL`).
- **Quantization**: Resizes the image to 40×40 pixels and bins pixels into a 64-bin RGB color histogram (`(r >> 6) * 16 + (g >> 6) * 4 + (b >> 6)`).
- **L1 Distance Matching**: Compares inspiration histogram against pre-computed histograms of studio collections, ranking the closest visual aesthetic first.
- **Safety**: Rejects non-image files or files exceeding 15MB with friendly error messaging and releases object URLs in `finally`.

### 3. Transparent Quote Calculator (`studio.js`)
- Formulates quotes using deterministic mathematical rules:
  $$\text{Total} = \text{round}(\text{Base} \times \text{Occasion} \times \text{Style} \times \text{Guests}) + \text{Travel}$$
- Real-time invalidation: Any change to guest count, date, occasion, coverage, style, or travel immediately hides stale quotes and WhatsApp links.

### 4. WhatsApp Draft & Handoff
- Assembles complete appointment context (Date, Occasion, Collection, Coverage, Style, People count, Travel rate, Estimated Total, Client Name, and Contact).
- Generates `https://wa.me/<NUMBER>?text=<DRAFT>`. If `STUDIO_WHATSAPP` is blank, links to `https://wa.me/?text=...` to trigger WhatsApp's native contact chooser.
