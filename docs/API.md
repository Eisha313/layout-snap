# Layout-Snap API Documentation

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core API](#core-api)
- [Generators](#generators)
- [Presets](#presets)
- [Breakpoints](#breakpoints)
- [Preview Mode](#preview-mode)
- [Hot Reload](#hot-reload)
- [Utilities](#utilities)

## Installation

```bash
npm install layout-snap
```

## Quick Start

```javascript
import { generateLayout, presets, createPreview } from 'layout-snap';

// Generate a hero section layout
const heroCSS = generateLayout(presets.hero());

// Inject into document
const style = document.createElement('style');
style.textContent = heroCSS;
document.head.appendChild(style);
```

## Core API

### `generateLayout(config)`

Generates CSS from a layout configuration object.

**Parameters:**
- `config` (Object): Layout configuration
  - `type` (String): 'grid' or 'flex'
  - `container` (String): CSS selector for container
  - `columns` (Number|String): Grid columns (grid only)
  - `rows` (Number|String): Grid rows (grid only)
  - `gap` (String): Gap between items
  - `direction` (String): Flex direction (flex only)
  - `wrap` (String): Flex wrap (flex only)
  - `justify` (String): Justify content
  - `align` (String): Align items
  - `areas` (Array): Grid template areas
  - `children` (Array): Child element configurations

**Returns:** String - Generated CSS

**Example:**
```javascript
const css = generateLayout({
  type: 'grid',
  container: '.my-grid',
  columns: 3,
  gap: '20px',
  children: [
    { selector: '.item', span: 2 }
  ]
});
```

## Generators

### `generateGridCSS(config)`

Generates CSS Grid layout styles.

**Parameters:**
- `config` (Object): Grid configuration
  - `container` (String): Container selector
  - `columns` (Number|String): Column definition
  - `rows` (Number|String): Row definition
  - `gap` (String): Grid gap
  - `areas` (Array): Named grid areas
  - `autoFlow` (String): Grid auto flow
  - `children` (Array): Child configurations

**Example:**
```javascript
import { generateGridCSS } from 'layout-snap';

const css = generateGridCSS({
  container: '.dashboard',
  columns: 'repeat(4, 1fr)',
  rows: 'auto 1fr auto',
  gap: '1rem',
  areas: [
    'header header header header',
    'sidebar main main main',
    'footer footer footer footer'
  ]
});
```

### `generateFlexCSS(config)`

Generates Flexbox layout styles.

**Parameters:**
- `config` (Object): Flex configuration
  - `container` (String): Container selector
  - `direction` (String): flex-direction value
  - `wrap` (String): flex-wrap value
  - `justify` (String): justify-content value
  - `align` (String): align-items value
  - `gap` (String): Gap between items
  - `children` (Array): Child configurations

**Example:**
```javascript
import { generateFlexCSS } from 'layout-snap';

const css = generateFlexCSS({
  container: '.nav',
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  gap: '1rem'
});
```

## Presets

### `presets.hero(options)`

Generates a hero section layout.

**Options:**
- `container` (String): Container selector (default: '.hero')
- `minHeight` (String): Minimum height (default: '100vh')
- `contentWidth` (String): Content max-width (default: '1200px')
- `textAlign` (String): Text alignment (default: 'center')

### `presets.featureGrid(options)`

Generates a feature grid layout.

**Options:**
- `container` (String): Container selector (default: '.features')
- `columns` (Number): Number of columns (default: 3)
- `gap` (String): Gap between items (default: '2rem')
- `cardPadding` (String): Card padding (default: '1.5rem')

### `presets.pricingTable(options)`

Generates a pricing table layout.

**Options:**
- `container` (String): Container selector (default: '.pricing')
- `columns` (Number): Number of pricing tiers (default: 3)
- `gap` (String): Gap between cards (default: '1.5rem')
- `highlightedScale` (Number): Scale for highlighted card (default: 1.05)

**Example:**
```javascript
import { presets, generateLayout } from 'layout-snap';

const pricingCSS = generateLayout(presets.pricingTable({
  columns: 4,
  gap: '2rem'
}));
```

## Breakpoints

### `createResponsiveLayout(config, breakpoints)`

Generates responsive CSS with media queries.

**Parameters:**
- `config` (Object): Base layout configuration
- `breakpoints` (Object): Breakpoint configurations

**Example:**
```javascript
import { createResponsiveLayout } from 'layout-snap';

const css = createResponsiveLayout(
  {
    type: 'grid',
    container: '.grid',
    columns: 4,
    gap: '20px'
  },
  {
    tablet: { maxWidth: 1024, config: { columns: 2 } },
    mobile: { maxWidth: 640, config: { columns: 1 } }
  }
);
```

### `injectMediaQueries(css, breakpoints)`

Injects media queries into existing CSS.

**Parameters:**
- `css` (String): Base CSS string
- `breakpoints` (Array): Breakpoint definitions

## Preview Mode

### `createPreview(container, config)`

Creates a live preview of a layout.

**Parameters:**
- `container` (String|Element): Target container
- `config` (Object): Layout configuration

**Returns:** Preview instance with methods:
- `update(newConfig)`: Update the preview
- `destroy()`: Remove preview and cleanup
- `getCSS()`: Get generated CSS
- `getHTML()`: Get generated HTML

**Example:**
```javascript
import { createPreview, presets } from 'layout-snap';

const preview = createPreview('#preview-container', presets.featureGrid());

// Update later
preview.update({ columns: 4 });

// Cleanup
preview.destroy();
```

## Hot Reload

### `enableHotReload(preview, options)`

Enables hot reload for a preview instance.

**Parameters:**
- `preview` (Object): Preview instance
- `options` (Object): Hot reload options
  - `debounce` (Number): Debounce delay in ms (default: 100)
  - `onChange` (Function): Callback on changes

**Returns:** Hot reload controller with methods:
- `update(config)`: Trigger an update
- `disable()`: Disable hot reload
- `enable()`: Re-enable hot reload

**Example:**
```javascript
import { createPreview, enableHotReload } from 'layout-snap';

const preview = createPreview('#app', config);
const hotReload = enableHotReload(preview, {
  debounce: 150,
  onChange: (css) => console.log('Updated:', css)
});

// Trigger updates
hotReload.update({ columns: 3 });
```

## Utilities

### `parseUnit(value)`

Parses a CSS unit value into number and unit.

### `mergeConfigs(base, ...overrides)`

Deep merges configuration objects.

### `validateConfig(config)`

Validates a layout configuration and returns errors.

### `sanitizeSelector(selector)`

Sanitizes a CSS selector string.

---

## TypeScript Support

Type definitions are included in the package.

```typescript
import { LayoutConfig, PresetOptions, generateLayout } from 'layout-snap';

const config: LayoutConfig = {
  type: 'grid',
  container: '.my-grid',
  columns: 3
};

const css: string = generateLayout(config);
```
