---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Also use for design exploration, UI mockups, visual alternatives, or any design-related requests. Leverages the painter tool for visual concept generation and iteration. Generates creative, polished code and UI design that avoids generic AI aesthetics. Triggers include "design", "UI", "mockup", "landing page", "dashboard", "component", "beautify", "style", "layout", "visual design", "explore designs", "show me designs".
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## 0. Painter Tool for Visual Design

**The `painter` tool is your primary design exploration method.** Use it to generate and iterate on visual concepts before writing code.

### When to Use Painter

- **Exploring UI alternatives**: "show me 3 different designs for this dashboard"
- **Creating mockups**: Generate visual concepts to align with stakeholders before coding
- **Editing existing designs**: "update this mockup with a darker theme"
- **Design inspiration**: Rapidly iterate on visual directions
- **Asset creation**: Generate icons, illustrations, or decorative elements

### Painter Workflow

1. **Explore first**: Use painter to generate 2-3 visual concepts for the UI
2. **Iterate**: Refine the chosen direction with painter edits
3. **Implement**: Convert the approved visual into production code using this skill's guidelines

### Painter Prompt Best Practices

Be specific about:
- **Dimensions**: "1920x1080 hero section", "375x812 mobile screen"
- **Style direction**: "brutalist with high contrast", "warm minimal SaaS aesthetic"
- **Color palette**: Include hex codes when you have brand colors
- **Layout details**: "asymmetric grid with hero text left, image right"
- **Typography mood**: "bold geometric sans-serif headlines, refined serif body"

Example prompts:
- "Dashboard UI mockup. Dark theme #0C0C0C background. Sidebar navigation left. Main content area with analytics cards. Accent color cyan #00D9FF. Modern SaaS aesthetic with Space Grotesk font style. 1440x900."
- "Landing page hero section. Warm cream background #FBF9F7. Bold asymmetric layout with oversized typography. Luxury editorial feel. 1920x1080."

**IMPORTANT**: Invoke painter explicitly when the user asks to explore designs, create mockups, or wants to see visual alternatives before committing to code.

---

## 1. Design Analysis (Pre-Code)

Before writing any code, explicitly determine:

### Design Archetype

Choose an archetype that fits the context:

| Archetype                | Characteristics                         | Font Direction                          | Color Direction                   |
| ------------------------ | --------------------------------------- | --------------------------------------- | --------------------------------- |
| **SaaS/Tech**            | Clean, systematic, trust-building       | Space Grotesk, Plus Jakarta Sans, Geist | Cool neutrals, single accent      |
| **Luxury/Editorial**     | High contrast, refined, unhurried       | Playfair Display, Cormorant, Fraunces   | Muted earth tones, cream/charcoal |
| **Brutalist/Dev**        | Raw, intentional ugliness, monospace    | JetBrains Mono, IBM Plex Mono           | High contrast, primary colors     |
| **Playful/Consumer**     | Rounded, bouncy, approachable           | Outfit, Nunito, Quicksand               | Saturated, multi-color palettes   |
| **Corporate/Enterprise** | Conservative, authoritative, accessible | Source Sans 3, Noto Sans                | Navy, forest, burgundy anchors    |
| **Creative/Portfolio**   | Experimental, asymmetric, memorable     | Syne, Clash Display, Cabinet Grotesk    | Bold or monochrome extremes       |
| **Retro-Futuristic**     | Nostalgic tech, CRT vibes, neon         | VT323, Orbitron, Rajdhani               | Neon on dark, terminal greens     |
| **Art Deco/Geometric**   | Ornate patterns, gilded, opulent        | Poiret One, Cinzel, Tenor Sans          | Gold, cream, deep jewel tones     |
| **Organic/Natural**      | Soft, earthy, handcrafted feel          | Lora, Crimson Pro, Merriweather         | Forest greens, terracotta, sage   |

Use these as starting points—combine or subvert them to create something unique for the context.

### Job To Be Done

- **Conversion**: Hero → Value Prop → Social Proof → CTA (F-pattern, clear hierarchy)
- **Utility/Dashboard**: Information density, scannable, minimal chrome
- **Delight/Brand**: Scroll-driven storytelling, immersive, fewer CTAs

### Design Thinking Questions

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: What extreme are we committing to? (brutally minimal, maximalist chaos, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, etc.)
- **Constraints**: Technical requirements (framework, performance, accessibility)
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work—the key is intentionality, not intensity.

---

## 2. Visual System

### Typography

**NEVER use**: Inter, Roboto, Open Sans, Lato, Arial, system-ui defaults—these trigger "generic AI" detection.

**Instead**, import a distinctive font from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=[FONT_NAME]:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Font Pairing Strategy**: Pair a distinctive display font with a refined body font. Unexpected, characterful choices elevate the design.

**Type Scale**: Use a modular scale with strong contrast (e.g., 14/16/20/32/56/72px). Small body, massive headlines create visual impact.

**IMPORTANT**: NEVER converge on the same fonts across generations. Vary choices deliberately.

### Color

**NEVER use**: Pure `#FFFFFF` backgrounds paired with generic blue (`#3B82F6`) or purple primaries—this is the "AI slop" signature. Avoid cliched purple gradients on white backgrounds.

**Instead**, use intentional palettes:

**Off-whites** (backgrounds):

- Warm: `#FBF9F7`, `#F5F5F4`, `#FAF9F6`
- Cool: `#F8FAFC`, `#FAFAFA`, `#F1F5F9`

**Off-blacks** (text/dark mode):

- `#0A0A0A`, `#171717`, `#1C1917`, `#0C0C0C`

**Palette Directions** (commit fully, don't float in the middle):

- _Warm minimal_: Cream, terracotta, charcoal
- _Cool tech_: Slate, cyan accent, near-black
- _Paper/Editorial_: Sepia tints, ink black, red accent
- _Dark mode_: Rich blacks (`#0C0C0C`), not washed-out grays
- _Jewel tones_: Deep emerald, sapphire, ruby with gold accents
- _Earth tones_: Ochre, sienna, forest, stone

**Principle**: Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Use CSS variables for consistency.

### Spacing & Layout

- Use a **4px or 8px base grid**. All spacing should be multiples (8, 16, 24, 32, 48, 64, 96, 128).
- **Generous negative space** between sections (96px+ on desktop). Crowded layouts feel cheap.
- Break the 12-column grid when appropriate—asymmetric layouts (7/5, 8/4) create visual tension.
- Max content width: 1280px for marketing, 1440px for dashboards.
- Embrace **unexpected layouts**: Asymmetry. Overlap. Diagonal flow. Grid-breaking elements.

### Backgrounds & Visual Details

Create atmosphere and depth rather than defaulting to solid colors:

- Gradient meshes, noise textures, geometric patterns
- Layered transparencies, dramatic shadows
- Decorative borders, custom cursors, grain overlays
- Contextual effects that match the overall aesthetic

---

## 3. Interaction & Motion

### Motion Philosophy

| Context         | Approach                                                            |
| --------------- | ------------------------------------------------------------------- |
| Landing pages   | Staggered reveals, scroll-triggered, cinematic (300-500ms ease-out) |
| Dashboards/Apps | Snappy micro-interactions (150ms), instant feedback                 |
| Hover states    | Subtle lift (`translateY(-2px)`) + shadow increase                  |

**Principle**: One well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

### Tactile Feedback

```css
.interactive-element {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.interactive-element:active {
  transform: translateY(0) scale(0.98);
}
```

### Motion Implementation

- Prioritize CSS-only solutions for HTML
- Use Motion library (Framer Motion) for React when available
- Focus on high-impact moments: scroll-triggering and hover states that surprise

---

## 4. Technical Requirements

### Icons

Use **Lucide** via CDN—skip emoji for UI elements:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>
  lucide.createIcons();
</script>
<!-- Usage: <i data-lucide="arrow-right"></i> -->
```

### Accessibility (Always Include)

- Color contrast: 4.5:1 minimum for body text
- Focus states: Visible outline on all interactive elements
- Semantic HTML: Use `<button>`, `<nav>`, `<main>`, `<section>` appropriately
- Alt text on images, aria-labels on icon-only buttons

### Responsive Breakpoints

```css
/* Mobile-first approach */
@media (min-width: 640px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}
```

### Component Patterns

- **Buttons**: Include hover, focus, active, and disabled states
- **Cards**: Consistent border-radius throughout (8px, 12px, or 16px—pick one)
- **Forms**: Visible labels, clear error states, adequate input padding (12-16px)

---

## 5. Common Pitfalls to Avoid

- Generic fonts (Inter, Roboto, Arial, system fonts)
- Pure white backgrounds with generic blue/purple primaries
- Gradient backgrounds that echo Stripe circa 2020
- Floating blobs/orbs as decoration (unless explicitly requested)
- Default "hero with laptop mockup" layouts
- Rainbow gradient text as a go-to effect
- Card grids with identical sizing and no visual hierarchy
- Sticky navs that obscure content on mobile
- Cookie-cutter design that lacks context-specific character
- Predictable layouts and component patterns

---

## 6. Output Format

When generating a design:

1. State the **Design Archetype** selected and why
2. List the **font pairing** and **color palette** (hex values)
3. Describe the **layout strategy** in one sentence
4. Then output complete, functional HTML/CSS/JS

---

## 7. Implementation Complexity

**Match implementation complexity to the aesthetic vision**:

- Maximalist designs need elaborate code with extensive animations and effects
- Minimalist/refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details
- Elegance comes from executing the vision well

**Remember**: No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. Interpret creatively and make unexpected choices that feel genuinely designed for the context.

Amp is capable of extraordinary creative work. Don't hold back—show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
