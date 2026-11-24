# Acceptance Criteria

All criteria must pass deterministically at both **390px** (mobile) and **1440px** (desktop) viewport widths.

## 1. Layout & Viewports
- [x] Zero horizontal scrolling or overflow (`scrollWidth <= innerWidth`).
- [x] Skip link provided (`.skip`) to jump directly to primary content.
- [x] Responsive navigation drawer for mobile screens under 850px with clean keyboard focus traps and Escape key dismissal.
- [x] Brand typography, spacing grid, and color identity preserved across all sections.

## 2. Design Gallery & Dialog
- [x] Displays 3 signature styles: Bridal Heirloom, Arabic Florals, and Modern Minimal.
- [x] Keyboard accessible: Cards can be focused and opened via Enter/Space.
- [x] Modal dialog displays motif, placement, and coverage details.
- [x] Closing via Escape key restores focus to the triggering card.
- [x] "Plan with this style" closes dialog and pre-fills Style Finder preferences.

## 3. Natural-Language Style Finder
- [x] Generic descriptions without distinct motif triggers guide the user to provide visual details.
- [x] Specific prompts (e.g., "airy floral vines for my engagement") match Arabic Florals and automatically select Engagement occasion.
- [x] "Download artist brief" generates and downloads `Xalveriq-artist-brief.txt` containing full request details.
- [x] "Estimate this design" transitions directly to the booking section with occasion, style, and coverage pre-selected.

## 4. On-Device Mood Board
- [x] Keyword chips display sample references on demand.
- [x] File upload uses `<canvas>` processing on-device with zero network requests outside local origin.
- [x] Identifies color palette match and ranks closest reference first.
- [x] Gracefully handles invalid non-image files with clear error feedback.

## 5. Instant Rate Calculator
- [x] Rejects past booking dates using local calendar day boundary.
- [x] Rejects guest counts `< 1` or `> 50`.
- [x] Correctly calculates ₹5,625 for 2 guests, half-hand Arabic engagement mehndi with ₹1,500 travel.
- [x] Modifying guest count immediately invalidates the quote and hides stale WhatsApp drafts.
- [x] Recalculating with 3 guests produces ₹7,688.

## 6. WhatsApp Draft Generation
- [x] Enforces valid client name and phone number (7-15 digits).
- [x] Assembles editable draft containing occasion, style, collection, guests, and total amount.
- [x] Retains "Choose a contact on WhatsApp" when `STUDIO_WHATSAPP` is unset.
- [x] Edits to the draft immediately update the generated `wa.me` hyperlink.

## 7. Studio FAQ
- [x] Accurately answers questions on pricing, travel, booking, drying, aftercare, and availability.
