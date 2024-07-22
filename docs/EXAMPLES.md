# Layout-Snap Examples

## Basic Examples

### Simple Grid Layout

```javascript
import { generateLayout } from 'layout-snap';

const css = generateLayout({
  type: 'grid',
  container: '.photo-gallery',
  columns: 4,
  gap: '10px'
});

// Output CSS:
// .photo-gallery {
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 10px;
// }
```

### Flexbox Navigation

```javascript
import { generateLayout } from 'layout-snap';

const css = generateLayout({
  type: 'flex',
  container: '.navbar',
  direction: 'row',
  justify: 'space-between',
  align: 'center',
  gap: '1rem',
  children: [
    { selector: '.logo', flex: '0 0 auto' },
    { selector: '.nav-links', flex: '1 1 auto', justify: 'center' },
    { selector: '.actions', flex: '0 0 auto' }
  ]
});
```

## Preset Examples

### Landing Page Hero

```javascript
import { generateLayout, presets } from 'layout-snap';

const heroCSS = generateLayout(presets.hero({
  container: '.landing-hero',
  minHeight: '80vh',
  contentWidth: '800px'
}));
```

### Feature Showcase

```javascript
import { generateLayout, presets } from 'layout-snap';

const featuresCSS = generateLayout(presets.featureGrid({
  container: '.features-section',
  columns: 3,
  gap: '2rem',
  cardPadding: '2rem'
}));
```

### Pricing Page

```javascript
import { generateLayout, presets } from 'layout-snap';

const pricingCSS = generateLayout(presets.pricingTable({
  container: '.pricing-section',
  columns: 3,
  highlightedScale: 1.08
}));
```

## Responsive Examples

### Responsive Blog Grid

```javascript
import { createResponsiveLayout } from 'layout-snap';

const blogGridCSS = createResponsiveLayout(
  {
    type: 'grid',
    container: '.blog-posts',
    columns: 3,
    gap: '2rem'
  },
  {
    tablet: {
      maxWidth: 1024,
      config: { columns: 2, gap: '1.5rem' }
    },
    mobile: {
      maxWidth: 640,
      config: { columns: 1, gap: '1rem' }
    }
  }
);
```

### Responsive Dashboard

```javascript
import { createResponsiveLayout } from 'layout-snap';

const dashboardCSS = createResponsiveLayout(
  {
    type: 'grid',
    container: '.dashboard',
    columns: '250px 1fr 300px',
    rows: '60px 1fr 40px',
    gap: '1rem',
    areas: [
      'header header header',
      'sidebar main aside',
      'footer footer footer'
    ]
  },
  {
    tablet: {
      maxWidth: 1024,
      config: {
        columns: '200px 1fr',
        areas: [
          'header header',
          'sidebar main',
          'footer footer'
        ]
      }
    },
    mobile: {
      maxWidth: 640,
      config: {
        columns: '1fr',
        areas: [
          'header',
          'main',
          'sidebar',
          'footer'
        ]
      }
    }
  }
);
```

## Live Preview Examples

### Interactive Layout Builder

```javascript
import { createPreview, enableHotReload, presets } from 'layout-snap';

// Create initial preview
const preview = createPreview('#layout-preview', presets.featureGrid());

// Enable hot reload
const hotReload = enableHotReload(preview, {
  debounce: 100,
  onChange: (css) => {
    document.getElementById('css-output').textContent = css;
  }
});

// Connect to UI controls
document.getElementById('columns-slider').addEventListener('input', (e) => {
  hotReload.update({ columns: parseInt(e.target.value) });
});

document.getElementById('gap-input').addEventListener('input', (e) => {
  hotReload.update({ gap: e.target.value });
});
```

### Preview with Custom Content

```javascript
import { createPreview } from 'layout-snap';

const preview = createPreview('#preview', {
  type: 'grid',
  container: '.card-grid',
  columns: 3,
  gap: '1rem',
  children: [
    { selector: '.card', content: '<div class="card">Card 1</div>' },
    { selector: '.card', content: '<div class="card">Card 2</div>' },
    { selector: '.card', content: '<div class="card">Card 3</div>' }
  ]
});
```

## Advanced Examples

### Complex Grid with Named Areas

```javascript
import { generateGridCSS } from 'layout-snap';

const appLayoutCSS = generateGridCSS({
  container: '.app-layout',
  columns: 'minmax(200px, 250px) 1fr minmax(200px, 300px)',
  rows: 'auto 1fr auto',
  gap: '0',
  areas: [
    'topbar topbar topbar',
    'nav content sidebar',
    'nav footer sidebar'
  ],
  children: [
    { selector: '.topbar', area: 'topbar', padding: '1rem' },
    { selector: '.nav', area: 'nav', background: '#f5f5f5' },
    { selector: '.content', area: 'content', padding: '2rem', overflow: 'auto' },
    { selector: '.sidebar', area: 'sidebar', padding: '1rem' },
    { selector: '.footer', area: 'footer', padding: '1rem' }
  ]
});
```

### Masonry-like Layout

```javascript
import { generateGridCSS } from 'layout-snap';

const masonryCSS = generateGridCSS({
  container: '.masonry',
  columns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1rem',
  autoFlow: 'dense',
  children: [
    { selector: '.item-tall', rowSpan: 2 },
    { selector: '.item-wide', colSpan: 2 },
    { selector: '.item-featured', colSpan: 2, rowSpan: 2 }
  ]
});
```

### Holy Grail Layout

```javascript
import { createResponsiveLayout } from 'layout-snap';

const holyGrailCSS = createResponsiveLayout(
  {
    type: 'grid',
    container: '.holy-grail',
    columns: '200px 1fr 200px',
    rows: 'auto 1fr auto',
    minHeight: '100vh',
    areas: [
      'header header header',
      'left main right',
      'footer footer footer'
    ]
  },
  {
    mobile: {
      maxWidth: 768,
      config: {
        columns: '1fr',
        areas: [
          'header',
          'main',
          'left',
          'right',
          'footer'
        ]
      }
    }
  }
);
```
