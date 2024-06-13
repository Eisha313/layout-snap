# layout-snap

A lightweight JavaScript library for generating responsive CSS Grid and Flexbox layouts from simple configuration objects. Simplifies complex responsive layouts into reusable, configurable functions.

## Installation

```bash
npm install
```

## Usage

### Basic Layout Generation

```javascript
import { LayoutSnap, createLayout, PRESETS } from 'layout-snap';

// Quick generation with factory function
const { html, css } = createLayout({
  type: 'grid',
  columns: 'repeat(3, 1fr)',
  gap: '1rem',
  items: [
    { content: 'Item 1' },
    { content: 'Item 2' },
    { content: 'Item 3' }
  ]
});
```

### Using Presets

```javascript
const snap = new LayoutSnap();

// Use a preset layout
const { html, css } = snap.generate({ preset: 'featureGrid' });

// Available presets: heroSection, featureGrid, pricingTable, twoColumn, cardGrid, navbar
```

### Live Preview with Hot Reload

```javascript
const snap = new LayoutSnap({ hotReload: true });

// Render directly into a container
snap.render({
  preset: 'pricingTable',
  gap: '2rem'
}, '#app');

// Update layout dynamically
snap.update({ gap: '3rem' });
```

### Custom Responsive Breakpoints

```javascript
const snap = new LayoutSnap({
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  }
});

const { html, css } = snap.generate({
  type: 'grid',
  columns: 'repeat(4, 1fr)',
  responsive: {
    tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
    mobile: { gridTemplateColumns: '1fr' }
  },
  items: [{ content: 'A' }, { content: 'B' }, { content: 'C' }, { content: 'D' }]
});
```

## API

### `new LayoutSnap(options)`
- `breakpoints` - Custom responsive breakpoints
- `prefix` - CSS class prefix (default: 'ls')
- `hotReload` - Enable live preview updates

### `snap.generate(config)` → `{ html, css, className }`
### `snap.render(config, target)` → Renders into DOM
### `snap.update(newConfig)` → Hot reload with new config

## License

MIT