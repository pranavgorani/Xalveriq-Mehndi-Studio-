# Requirements Specification

## 1. Visual Identity & Brand Styling
- **Palette**:
  - Primary Plum: `#412530` / `#472532`
  - Warm Ivory: `#faf7f1`
  - Muted Gold: `#e9be8c` / `#f0d5ac`
  - Henna Accent: `#965634` / `#955935`
- **Typography**: Georgia for display headings; clean Segoe UI / Arial sans-serif for interface controls and body text.
- **Atmosphere**: Contemporary henna atelier, respectful, tactile, uncluttered.

## 2. Pricing & Cost Model

### Coverage Base Rates (per person)
| Coverage Key | Label | Base Rate |
|---|---|---|
| `minimal` | Minimal · fingers or small motif | ₹800 |
| `half` | Half hand | ₹1,500 |
| `full` | Full hand | ₹2,500 |
| `bridal` | Full bridal · hands and feet | ₹8,000 |

### Occasion Multipliers
| Occasion Key | Label | Multiplier |
|---|---|---|
| `wedding` | Wedding / Bridal | ×1.60 |
| `engagement` | Engagement | ×1.25 |
| `festival` | Festival | ×1.10 |
| `party` | Party | ×1.05 |
| `everyday` | Everyday | ×1.00 |

### Style Multipliers
| Style Key | Label | Multiplier |
|---|---|---|
| `traditional` | Traditional / Indian | ×1.00 |
| `arabic` | Arabic | ×1.10 |
| `indo-arabic` | Indo-Arabic | ×1.15 |
| `minimal` | Minimal / contemporary | ×0.90 |
| `portrait` | Portrait / custom | ×1.35 |

### Travel Tiers (flat fee per enquiry)
| Distance / Region | Fee |
|---|---|
| Within Mumbai | ₹0 |
| Outside Mumbai · up to 50 km | ₹1,500 |
| Outside Mumbai · over 50 to 150 km | ₹3,500 |
| Destination / long distance | ₹6,000 |

### Calculation Formula
$$\text{Total} = \text{round}\left(\text{Base} \times \text{Occasion} \times \text{Style} \times \text{Guests} + 10^{-8}\right) + \text{Travel}$$

#### Canonical Reference Test Case
- Coverage: Half hand (`half` = ₹1,500)
- Occasion: Engagement (`engagement` = ×1.25)
- Style: Arabic (`arabic` = ×1.10)
- Guests: 2 people
- Travel: Outside Mumbai up to 50 km (₹1,500)
$$\text{Subtotal} = 1500 \times 1.25 \times 1.10 \times 2 = ₹4,125$$
$$\text{Total} = 4125 + 1500 = \mathbf{₹5,625}$$

If guest count changes to 3:
$$\text{Subtotal} = 1500 \times 1.25 \times 1.10 \times 3 = ₹6,187.50$$
$$\text{Total} = \text{round}(6187.50) + 1500 = 6188 + 1500 = \mathbf{₹7,688}$$

## 3. Data Integrity & Invalidation Rules
- Changing any input in `bookingForm` (people, occasion, coverage, style, travel, date) must immediately invalidate the calculated quote:
  - `#quote` is hidden.
  - `#wa` is hidden and loses its `href`.
  - `#message` is cleared.
- Date input must reject past dates (`min` set to current local date).
- Guest count must enforce min 1 and max 50.

## 4. WhatsApp Configuration
- Configured via `STUDIO_WHATSAPP` in `config.js`.
- If non-empty: generates direct link `https://wa.me/<NUMBER>?text=...` with label "Open studio chat on WhatsApp".
- If empty: generates `https://wa.me/?text=...` with label "Choose a contact on WhatsApp".
- Test requirement: Stop at the WhatsApp draft review; do not send real messages.
