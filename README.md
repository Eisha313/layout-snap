# Layout-Snap

[![npm version](https://badge.fury.io/js/layout-snap.svg)](https://www.npmjs.com/package/layout-snap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight JavaScript library for generating responsive CSS Grid and Flexbox layouts from simple configuration objects.

## Features

- 📦 **Configuration-based** - Generate layouts from simple JavaScript objects
- 🎨 **Preset patterns** - Ready-to-use hero sections, feature grids, and pricing tables
- 📱 **Auto-responsive** - Built-in breakpoint system with customizable media queries
- 🔥 **Live preview** - Render layouts directly with hot-reload support
- 🪶 **Lightweight** - Zero dependencies, under 10KB gzipped

## Installation

```bash
npm install layout-snap
```

## Quick Start

```javascript
import { generateLayout, presets } from 'layout-snap';

// Generate a responsive feature grid
const css = generateLayout(presets.featureGrid({
  columns: 3,
  gap: '2rem'
}));

// Inject CSS
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

## Basic Usage

### Grid Layout

```javascript
import { generateLayout } from 'layout-snap';

const gridCSS = generateLayout({
  type: 'grid',
  container: '.my-grid',
  columns: 3,
  gap: '20px'
});
```

### Flexbox Layout

```javascript
import { generateLayout } from 'layout-snap';

const flexCSS = generateLayout({
  type: 'flex',
  container: '.my-flex',
  direction: 'row',
  justify: 'space-between',
  align: 'center'
});
```

### Using Presets

```javascript
import { generateLayout, presets } from 'layout-snap';

// Hero section
const heroCSS = generateLayout(presets.hero());

// Feature grid
const featuresCSS = generateLayout(presets.featureGrid({ columns: 4 }));

// Pricing table
const pricingCSS = generateLayout(presets.pricingTable());
```

### Responsive Layouts

```javascript
import { createResponsiveLayout } from 'layout-snap';

const responsiveCSS = createResponsiveLayout(
  {
    type: 'grid',
    container: '.cards',
    columns: 4,
    gap: '20px'
  },
  {
    tablet: { maxWidth: 1024, config: { columns: 2 } },
    mobile: { maxWidth: 640, config: { columns: 1 } }
  }
);
```

### Live Preview with Hot Reload

```javascript
import { createPreview, enableHotReload } from 'layout-snap';

const preview = createPreview('#preview-container', {
  type: 'grid',
  container: '.grid',
  columns: 3
});

const hotReload = enableHotReload(preview);

// Update on changes
hotReload.update({ columns: 4 });
```

## Documentation

- [API Documentation](./docs/API.md)
- [Examples](./docs/EXAMPLES.md)

## Browser Support

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

```bash
# Clone the repo
git clone https://github.com/example/layout-snap.git

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT © Layout-Snap Contributors
