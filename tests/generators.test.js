import { generateGrid, generateFlex, generateGridItem, generateFlexItem } from '../src/generators.js';

describe('generateGrid', () => {
  test('generates basic grid with defaults', () => {
    const css = generateGrid({});
    expect(css).toContain('display: grid');
    expect(css).toContain('grid-template-columns: repeat(12, 1fr)');
    expect(css).toContain('gap: 1rem');
  });

  test('generates grid with custom columns', () => {
    const css = generateGrid({ columns: 6 });
    expect(css).toContain('grid-template-columns: repeat(6, 1fr)');
  });

  test('generates grid with string columns', () => {
    const css = generateGrid({ columns: '1fr 2fr 1fr' });
    expect(css).toContain('grid-template-columns: 1fr 2fr 1fr');
  });

  test('handles grid areas', () => {
    const css = generateGrid({
      areas: ['header header', 'sidebar main', 'footer footer']
    });
    expect(css).toContain('grid-template-areas');
    expect(css).toContain('"header header"');
  });

  test('handles empty areas array', () => {
    const css = generateGrid({ areas: [] });
    expect(css).not.toContain('grid-template-areas');
  });

  test('handles invalid areas entries', () => {
    const css = generateGrid({ areas: ['valid row', '', null, 'another row'] });
    expect(css).toContain('"valid row"');
    expect(css).toContain('"another row"');
  });

  test('clamps columns to valid range', () => {
    const css = generateGrid({ columns: 50 });
    expect(css).toContain('repeat(24, 1fr)');
  });

  test('handles empty string columns', () => {
    const css = generateGrid({ columns: '   ' });
    expect(css).toContain('grid-template-columns: repeat(12, 1fr)');
  });

  test('handles numeric rows', () => {
    const css = generateGrid({ rows: 3 });
    expect(css).toContain('grid-template-rows: repeat(3, 1fr)');
  });
});

describe('generateFlex', () => {
  test('generates basic flex with defaults', () => {
    const css = generateFlex({});
    expect(css).toContain('display: flex');
    expect(css).toContain('flex-direction: row');
    expect(css).toContain('flex-wrap: wrap');
  });

  test('generates flex with custom direction', () => {
    const css = generateFlex({ direction: 'column' });
    expect(css).toContain('flex-direction: column');
  });

  test('validates direction value', () => {
    const css = generateFlex({ direction: 'invalid' });
    expect(css).toContain('flex-direction: row');
  });

  test('validates wrap value', () => {
    const css = generateFlex({ wrap: 'invalid' });
    expect(css).toContain('flex-wrap: wrap');
  });

  test('generates flex with custom gap', () => {
    const css = generateFlex({ gap: '2rem' });
    expect(css).toContain('gap: 2rem');
  });
});

describe('generateGridItem', () => {
  test('generates basic grid item', () => {
    const css = generateGridItem({});
    expect(css).toContain('.grid-item');
  });

  test('generates grid item with span', () => {
    const css = generateGridItem({ colSpan: 3, rowSpan: 2 });
    expect(css).toContain('grid-column: span 3');
    expect(css).toContain('grid-row: span 2');
  });

  test('generates grid item with area', () => {
    const css = generateGridItem({ area: 'header' });
    expect(css).toContain('grid-area: header');
  });

  test('clamps span values', () => {
    const css = generateGridItem({ colSpan: 30 });
    expect(css).toContain('grid-column: span 24');
  });

  test('handles invalid colStart', () => {
    const css = generateGridItem({ colStart: -1 });
    expect(css).not.toContain('grid-column-start');
  });
});

describe('generateFlexItem', () => {
  test('generates basic flex item', () => {
    const css = generateFlexItem({});
    expect(css).toContain('.flex-item');
    expect(css).toContain('flex: 0 1 auto');
  });

  test('generates flex item with custom values', () => {
    const css = generateFlexItem({ grow: 1, shrink: 0, basis: '200px' });
    expect(css).toContain('flex: 1 0 200px');
  });

  test('generates flex item with order', () => {
    const css = generateFlexItem({ order: 2 });
    expect(css).toContain('order: 2');
  });

  test('handles null order', () => {
    const css = generateFlexItem({ order: null });
    expect(css).not.toContain('order');
  });
});
