# Test Simulator Style Guide

**Version:** 1.0
**Last Updated:** December 2025

A warm, autumnal design system for Test Simulator - inspired by cozy study sessions, soft natural light, and the gentle warmth of fall.

---

## Design Philosophy

### Core Principles

1. **Warm & Inviting** - Colors evoke autumn leaves, warm beverages, and comfortable study spaces
2. **Calm Focus** - Muted tones reduce visual strain during long study sessions
3. **Natural Harmony** - Teal greens and burnt oranges complement like nature's own palette
4. **Gentle Contrast** - Soft edges and subtle shadows create depth without harshness

### Mood & Inspiration

```
Think of: Late afternoon sunlight through autumn leaves
         A warm cup of tea beside your notes
         Worn leather journals and aged paper
         Forest greens meeting harvest oranges
```

---

## Color Palette

### Primary Colors

#### Burnt Orange (Primary Action)
The warm hearth - energizing yet comforting. The signature color of our autumnal palette.

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--color-claude-orange` | `rgba(204, 93, 52, 1)` | `#CC5D34` | **Light mode primary** |
| `--color-claude-orange-light` | `rgba(217, 119, 81, 1)` | `#D97751` | Hover state |
| `--color-claude-orange-dark` | `rgba(181, 72, 33, 1)` | `#B54821` | Pressed state |
| `--color-orange-400` | `rgba(230, 129, 97, 1)` | `#E68161` | **Dark mode primary** |
| `--color-orange-500` | `rgba(168, 75, 47, 1)` | `#A84B2F` | Deep accent |

```css
/* Usage */
.btn--primary {
  background: var(--color-primary); /* Maps to claude-orange */
}
```

#### Soft Green (Success & Accent)
A muted sage green that complements the warm oranges - like moss on autumn bark.

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--color-teal-500` | `rgba(33, 128, 141, 1)` | `#21808D` | Success states |
| `--color-teal-300` | `rgba(50, 184, 198, 1)` | `#32B8C6` | Dark mode success |
| `--color-teal-600` | `rgba(29, 116, 128, 1)` | `#1D7480` | Hover accent |

### Background Colors

#### Light Mode - Cream & Paper

| Token | Value | Hex | Feel |
|-------|-------|-----|------|
| `--color-cream-50` | `rgba(252, 252, 249, 1)` | `#FCFCF9` | Aged paper |
| `--color-cream-100` | `rgba(255, 255, 253, 1)` | `#FFFFFD` | Fresh page |
| `--color-claude-beige` | `rgba(245, 240, 235, 1)` | `#F5F0EB` | Warm parchment |
| `--color-claude-cream` | `rgba(255, 251, 247, 1)` | `#FFFBF7` | Soft candlelight |

#### Dark Mode - Charcoal & Earth

| Token | Value | Hex | Feel |
|-------|-------|-----|------|
| `--color-charcoal-700` | `rgba(31, 33, 33, 1)` | `#1F2121` | Deep evening |
| `--color-charcoal-800` | `rgba(38, 40, 40, 1)` | `#262828` | Warm shadow |
| `--color-claude-bg-dark` | `rgba(28, 25, 23, 1)` | `#1C1917` | Rich earth |
| `--color-claude-surface-dark` | `rgba(41, 37, 33, 1)` | `#292521` | Worn leather |

### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-text` | `--color-slate-900` | `--color-gray-200` | Primary text |
| `--color-text-secondary` | `--color-slate-500` | `rgba(gray-300, 0.7)` | Muted text |
| `--color-slate-900` | `rgba(19, 52, 59, 1)` | - | Deep blue-gray |
| `--color-brown-600` | `rgba(94, 82, 64, 1)` | - | Warm brown text |

### Semantic Colors

```css
/* Success - Forest teal */
--color-success: var(--color-teal-500);    /* Light */
--color-success: var(--color-teal-300);    /* Dark */

/* Error - Autumn red */
--color-error: var(--color-red-500);       /* Light: rgba(192, 21, 47, 1) */
--color-error: var(--color-red-400);       /* Dark: rgba(255, 84, 89, 1) */

/* Warning - Harvest orange */
--color-warning: var(--color-orange-500);  /* Light: rgba(168, 75, 47, 1) */
--color-warning: var(--color-orange-400);  /* Dark: rgba(230, 129, 97, 1) */

/* Info - Stone gray */
--color-info: var(--color-slate-500);      /* Light: rgba(98, 108, 113, 1) */
--color-info: var(--color-gray-300);       /* Dark: rgba(167, 169, 169, 1) */
```

### Color Palette Visualization

```
CLAUDE LIGHT                        CLAUDE DARK

Backgrounds                         Backgrounds
┌─────────────────────────┐        ┌─────────────────────────┐
│  #F5F0EB  claude-beige  │        │  #1C1917  claude-bg     │
│  Warm parchment         │        │  Rich earth             │
├─────────────────────────┤        ├─────────────────────────┤
│  #FFFBF7  claude-cream  │        │  #292521  claude-surface│
│  Soft candlelight       │        │  Worn leather           │
└─────────────────────────┘        └─────────────────────────┘

Primary (Burnt Orange)              Primary (Amber)
┌─────────────────────────┐        ┌─────────────────────────┐
│  #CC5D34  claude-orange │        │  #EA7B52  claude-orange │
│  Autumn hearth          │        │  Warm amber glow        │
└─────────────────────────┘        └─────────────────────────┘

Success (Soft Green)                Success (Soft Green)
┌─────────────────────────┐        ┌─────────────────────────┐
│  #21808D  teal-500      │        │  #32B8C6  teal-300      │
│  Forest moss            │        │  Bright sage            │
└─────────────────────────┘        └─────────────────────────┘

Text                                Text
┌─────────────────────────┐        ┌─────────────────────────┐
│  #2A2521  warm brown    │        │  #FAF5F0  warm cream    │
│  Rich espresso          │        │  Soft parchment         │
└─────────────────────────┘        └─────────────────────────┘
```

---

## Typography

### Font Stack

```css
/* System fonts for native feel */
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;

/* Monospace for code/inputs */
--font-family-mono: "Berkeley Mono", ui-monospace, SFMono-Regular, Menlo,
  Monaco, Consolas, monospace;
```

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 11px | Tiny labels, badges |
| `--font-size-sm` | 12px | Secondary text, captions |
| `--font-size-base` | 14px | Body text, inputs |
| `--font-size-md` | 14px | Standard UI text |
| `--font-size-lg` | 16px | Emphasized body |
| `--font-size-xl` | 18px | Section titles |
| `--font-size-2xl` | 20px | Card headers |
| `--font-size-3xl` | 24px | Page titles |
| `--font-size-4xl` | 30px | Hero text |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 550 | Buttons, labels |
| `--font-weight-bold` | 600 | Headings, important |

### Line Height

```css
--line-height-tight: 1.2;   /* Headings */
--line-height-normal: 1.5;  /* Body text */
```

### Typography Examples

```html
<!-- Page title -->
<h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold);">
  Test Library
</h1>

<!-- Section header -->
<h2 style="font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold);">
  Recent Tests
</h2>

<!-- Body text -->
<p style="font-size: var(--font-size-base); line-height: var(--line-height-normal);">
  Your saved tests will appear here.
</p>

<!-- Caption -->
<span style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
  Last updated 2 hours ago
</span>
```

---

## Spacing

### Spacing Scale

A harmonious scale based on 4px units.

| Token | Value | Common Uses |
|-------|-------|-------------|
| `--space-0` | 0 | Reset |
| `--space-1` | 1px | Hairline borders |
| `--space-2` | 2px | Tiny gaps |
| `--space-4` | 4px | Icon padding, tight spacing |
| `--space-6` | 6px | Button icon gaps |
| `--space-8` | 8px | Small internal padding |
| `--space-10` | 10px | Compact elements |
| `--space-12` | 12px | Standard element padding |
| `--space-16` | 16px | Card padding, section gaps |
| `--space-20` | 20px | Comfortable breathing room |
| `--space-24` | 24px | Section separations |
| `--space-32` | 32px | Major section breaks |

### Spacing Usage Guidelines

```css
/* Tight - internal component spacing */
padding: var(--space-8) var(--space-12);

/* Comfortable - card content */
padding: var(--space-16);

/* Generous - section spacing */
margin-bottom: var(--space-24);

/* Major - page sections */
padding: var(--space-32) 0;
```

---

## Border Radius

### Radius Scale

Soft, friendly corners that feel warm and approachable.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Buttons, inputs, badges |
| `--radius-base` | 8px | Cards, dropdowns |
| `--radius-md` | 10px | Larger cards |
| `--radius-lg` | 12px | Modals, panels |
| `--radius-full` | 9999px | Pills, avatars, toggles |

### Radius Examples

```css
/* Button - slightly rounded */
.btn {
  border-radius: var(--radius-sm);
}

/* Card - friendly corners */
.card {
  border-radius: var(--radius-base);
}

/* Modal - generous rounding */
.modal-content {
  border-radius: var(--radius-lg);
}

/* Badge - pill shape */
.badge {
  border-radius: var(--radius-full);
}
```

---

## Shadows

### Shadow Scale

Soft, warm shadows that suggest depth without harshness.

| Token | Effect | Usage |
|-------|--------|-------|
| `--shadow-xs` | Subtle lift | Hover hints |
| `--shadow-sm` | Soft elevation | Cards at rest |
| `--shadow-md` | Medium depth | Dropdowns, tooltips |
| `--shadow-lg` | Prominent | Modals, overlays |
| `--shadow-xl` | Strong lift | Floating elements |
| `--shadow-2xl` | Maximum depth | Hero cards |
| `--shadow-focus` | Focus ring + lift | Focused inputs |

### Shadow Values

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);

--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06),
             0 1px 2px rgba(0, 0, 0, 0.03);

--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08),
             0 2px 4px -1px rgba(0, 0, 0, 0.04);

--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

--shadow-focus: 0 0 0 3px var(--color-focus-ring),
                0 1px 2px rgba(0, 0, 0, 0.05);
```

### Inner Shadows

```css
/* Subtle inset for pressed states */
--shadow-inset-sm: inset 0 1px 0 rgba(255, 255, 255, 0.15),
                   inset 0 -1px 0 rgba(0, 0, 0, 0.03);
```

---

## Animation

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 100ms | Micro-interactions |
| `--duration-fast` | 150ms | Hover effects |
| `--duration-normal` | 250ms | Standard transitions |
| `--duration-slow` | 350ms | Elaborate animations |
| `--duration-slower` | 500ms | Page transitions |

### Easing Functions

| Token | Curve | Feel |
|-------|-------|------|
| `--ease-standard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Natural, responsive |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Accelerating |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Decelerating |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Balanced |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Snappy feedback |

### Animation Examples

```css
/* Hover transition */
.btn {
  transition: transform var(--duration-fast) var(--ease-standard),
              background-color var(--duration-fast) var(--ease-smooth);
}

/* Card entrance */
.test-card {
  animation: fadeInUp var(--duration-normal) var(--ease-standard);
}

/* Subtle bounce on success */
.success-icon {
  animation: bounce var(--duration-slow) var(--ease-spring);
}
```

---

## Components

### Buttons

#### Primary Button
The main call-to-action. Warm burnt orange with white text.

```css
.btn--primary {
  background: var(--color-primary);
  color: var(--color-btn-primary-text);
  border-radius: var(--radius-sm);
  padding: var(--space-10) var(--space-16);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-standard);
}

.btn--primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

#### Secondary Button
Subtle, supportive action. Brown-tinted transparent background.

```css
.btn--secondary {
  background: var(--color-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

#### Outline Button
Minimal, tertiary action.

```css
.btn--outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}
```

#### Button Sizes

| Class | Padding | Font Size |
|-------|---------|-----------|
| `.btn--sm` | 8px 12px | 12px |
| `.btn` (default) | 10px 16px | 14px |
| `.btn--lg` | 12px 20px | 16px |

### Cards

Soft containers with warm shadows.

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-card-border);
  box-shadow: var(--shadow-sm);
  padding: var(--space-16);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Test Cards

Library items with colored backgrounds.

```css
.test-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-card-border);
  padding: var(--space-16);
  /* Staggered entrance animation */
  animation: fadeInUp var(--duration-normal) var(--ease-standard);
}

/* Colorful top accent based on position */
.test-card:nth-child(8n+1) { border-top-color: var(--color-bg-1); }
.test-card:nth-child(8n+2) { border-top-color: var(--color-bg-2); }
/* etc. */
```

### Modals

Centered overlay dialogs.

```css
.modal {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 480px;
  padding: var(--space-24);
}
```

### Form Inputs

```css
input, textarea, select {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-10) var(--space-12);
  font-size: var(--font-size-base);
  color: var(--color-text);
  transition: border-color var(--duration-fast),
              box-shadow var(--duration-fast);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}
```

---

## Themes

### Available Themes

#### Claude Light (`data-theme="claude-light"`)
The default theme - warm and inviting like a sunlit study.

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#F5F0EB` | Warm beige parchment |
| Surface | `#FFFBF7` | Soft cream cards |
| Primary | `#CC5D34` | Burnt orange |
| Text | `#2A2521` | Rich espresso brown |
| Text Secondary | `#735546` | Warm brown |

#### Claude Dark (`data-theme="claude-dark"`)
For late-night study sessions - cozy and easy on the eyes.

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#1C1917` | Rich earth |
| Surface | `#292521` | Worn leather |
| Primary | `#EA7B52` | Warm amber |
| Text | `#FAF5F0` | Soft parchment |
| Text Secondary | `#917364` | Muted brown |

### Theme Switching

```javascript
// Set light theme
document.documentElement.setAttribute('data-theme', 'claude-light');
document.documentElement.setAttribute('data-color-scheme', 'light');

// Set dark theme
document.documentElement.setAttribute('data-theme', 'claude-dark');
document.documentElement.setAttribute('data-color-scheme', 'dark');

// Store preference
localStorage.setItem('testSimulatorTheme', 'claude-light');
```

### Theme-Aware CSS

```css
/* Base styles use semantic tokens - automatically adapt to theme */
.element {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* Theme-specific overrides when needed */
[data-theme="claude-dark"] .special-element {
  /* Dark mode specific styling */
}
```

### Respecting System Preference

```javascript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDark ? 'claude-dark' : 'claude-light';
```

---

## Layout

### Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | 640px | Narrow content |
| `--container-md` | 768px | Standard content |
| `--container-lg` | 1024px | Wide content |
| `--container-xl` | 1280px | Full-width layouts |

### Responsive Breakpoints

```css
/* Mobile-first approach */
.element { /* Mobile styles */ }

@media (min-width: 640px) {
  .element { /* Tablet styles */ }
}

@media (min-width: 1024px) {
  .element { /* Desktop styles */ }
}
```

---

## Accessibility

### Focus States

All interactive elements must have visible focus indicators.

```css
.btn:focus-visible {
  outline: var(--focus-outline);
  box-shadow: var(--focus-ring);
}

/* Focus ring color - warm orange glow */
--color-focus-ring: rgba(var(--color-claude-orange-rgb), 0.4);
```

### Color Contrast

- Primary text on background: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icons

### Icon Sizes

| Context | Size |
|---------|------|
| Inline with text | 16px |
| Button icons | 18px |
| Card icons | 20px |
| Feature icons | 24px |

### Icon Styling

```css
.icon {
  stroke: currentColor;  /* Inherits text color */
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
```

---

## Best Practices

### Do's

- Use semantic color tokens (`--color-primary`) not primitive tokens (`--color-teal-500`)
- Apply consistent spacing using the scale
- Include hover, focus, and active states for all interactive elements
- Test in both light and dark modes
- Ensure sufficient color contrast

### Don'ts

- Don't use hard-coded colors - always use CSS variables
- Don't skip focus states for accessibility
- Don't use shadows that are too dark or harsh
- Don't use light mode colors in dark mode or vice versa
- Don't forget transition effects on state changes

---

## Quick Reference

### Common Patterns

```css
/* Card with hover effect */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-base);
  padding: var(--space-16);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Primary button */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-btn-primary-text);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-10) var(--space-16);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-standard);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

/* Input field */
.input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-10) var(--space-12);
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | Dec 2025 | Simplified to Claude Light/Dark themes only |
| 1.0 | Dec 2025 | Initial style guide |

---

*"The colors of autumn are warm and inviting - perfect for focused study."*
