/**
 * Tests for CSS generators
 */

import {
  generateGrid,
  generateFlex,
  generateGridItem,
  generateFlexItem,
  generateCSSRule,
  combineLayouts
} from '../src/generators.js';

describe('generateGrid', () => {
  test('generates basic grid with defaults', () => {
    const result = generateGrid();
    
    expect(result.className).toMatch(/^grid-/);
    expect(result.styles.display).toBe('grid');
    expect(result.styles.gridTemplateColumns).toBe('repeat(12, 1fr)');
    expect(result.styles.gap).toBe('1rem');
  });

  test('generates grid with custom columns', () => {
    const result = generateGrid({ columns: 3 });
    expect(result.styles.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });

  test('generates grid with string columns', () => {
    const result = generateGrid({ columns: '1fr 2fr 1fr' });
    expect(result.styles.gridTemplateColumns).toBe('1fr 2fr 1fr');
  });

  test('generates auto-fit grid with minColumnWidth', () => {
    const result = generateGrid({ minColumnWidth: '250px' });
    expect(result.styles.gridTemplateColumns).toBe('repeat(auto-fit, minmax(250px, 1fr))');
  });

  test('generates grid with areas', () => {
    const result = generateGrid({
      areas: ['header header', 'sidebar main', 'footer footer']
    });
    expect(result.styles.gridTemplateAreas).toBe('"header header" "sidebar main" "footer footer"');
  });

  test('generates grid with custom class name', () => {
    const result = generateGrid({ className: 'my-grid' });
    expect(result.className).toBe('my-grid');
  });

  test('generates valid CSS output', () => {
    const result = generateGrid({ columns: 3, gap: '20px' });
    expect(result.css).toContain('.grid-');
    expect(result.css).toContain('display: grid');
    expect(result.css).toContain('gap: 20px');
  });

  test('handles separate rowGap and columnGap', () => {
    const result = generateGrid({ rowGap: '10px', columnGap: '20px' });
    expect(result.styles.rowGap).toBe('10px');
    expect(result.styles.columnGap).toBe('20px');
    expect(result.styles.gap).toBeUndefined();
  });

  test('supports important flag for specificity', () => {
    const result = generateGrid({ columns: 3, important: true });
    expect(result.styles.display).toBe('grid !important');
    expect(result.styles.gridTemplateColumns).toBe('repeat(3, 1fr) !important');
  });
});

describe('generateFlex', () => {
  test('generates basic flex with defaults', () => {
    const result = generateFlex();
    
    expect(result.className).toMatch(/^flex-/);
    expect(result.styles.display).toBe('flex');
    expect(result.styles.flexDirection).toBe('row');
    expect(result.styles.flexWrap).toBe('wrap');
  });

  test('generates flex with custom direction', () => {
    const result = generateFlex({ direction: 'column' });
    expect(result.styles.flexDirection).toBe('column');
  });

  test('generates flex with justify and align', () => {
    const result = generateFlex({ justify: 'center', align: 'center' });
    expect(result.styles.justifyContent).toBe('center');
    expect(result.styles.alignItems).toBe('center');
  });

  test('handles separate rowGap and columnGap', () => {
    const result = generateFlex({ rowGap: '15px', columnGap: '30px' });
    expect(result.styles.rowGap).toBe('15px');
    expect(result.styles.columnGap).toBe('30px');
    expect(result.styles.gap).toBeUndefined();
  });

  test('supports important flag for specificity', () => {
    const result = generateFlex({ direction: 'column', important: true });
    expect(result.styles.display).toBe('flex !important');
    expect(result.styles.flexDirection).toBe('column !important');
  });
});

describe('generateGridItem', () => {
  test('generates basic grid item', () => {
    const result = generateGridItem();
    expect(result.className).toMatch(/^grid-item-/);
  });

  test('generates item with column span', () => {
    const result = generateGridItem({ colSpan: 2 });
    expect(result.styles.gridColumn).toBe('span 2');
  });

  test('generates item with row span', () => {
    const result = generateGridItem({ rowSpan: 3 });
    expect(result.styles.gridRow).toBe('span 3');
  });

  test('generates item with start position', () => {
    const result = generateGridItem({ colStart: 2, colSpan: 3 });
    expect(result.styles.gridColumn).toBe('2 / span 3');
  });

  test('generates item with grid area', () => {
    const result = generateGridItem({ area: 'header' });
    expect(result.styles.gridArea).toBe('header');
  });

  test('supports important flag', () => {
    const result = generateGridItem({ colSpan: 2, important: true });
    expect(result.styles.gridColumn).toBe('span 2 !important');
  });
});

describe('generateFlexItem', () => {
  test('generates basic flex item', () => {
    const result = generateFlexItem();
    expect(result.className).toMatch(/^flex-item-/);
    expect(result.styles.flexGrow).toBe('0');
    expect(result.styles.flexShrink).toBe('1');
    expect(result.styles.flexBasis).toBe('auto');
  });

  test('generates item with custom flex values', () => {
    const result = generateFlexItem({ grow: 1, shrink: 0, basis: '200px' });
    expect(result.styles.flexGrow).toBe('1');
    expect(result.styles.flexShrink).toBe('0');
    expect(result.styles.flexBasis).toBe('200px');
  });

  test('generates item with alignSelf', () => {
    const result = generateFlexItem({ alignSelf: 'center' });
    expect(result.styles.alignSelf).toBe('center');
  });

  test('generates item with order', () => {
    const result = generateFlexItem({ order: 2 });
    expect(result.styles.order).toBe('2');
  });

  test('supports important flag', () => {
    const result = generateFlexItem({ grow: 1, important: true });
    expect(result.styles.flexGrow).toBe('1 !important');
  });
});

describe('generateCSSRule', () => {
  test('generates valid CSS rule', () => {
    const css = generateCSSRule('test-class', {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)'
    });
    
    expect(css).toBe('.test-class {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}');
  });

  test('converts camelCase to kebab-case', () => {
    const css = generateCSSRule('test', { backgroundColor: 'red' });
    expect(css).toContain('background-color: red');
  });
});

describe('combineLayouts', () => {
  test('combines multiple layout configurations', () => {
    const result = combineLayouts([
      { type: 'grid', columns: 3 },
      { type: 'flex', direction: 'column' }
    ]);
    
    expect(result.layouts).toHaveLength(2);
    expect(result.css).toContain('display: grid');
    expect(result.css).toContain('display: flex');
  });

  test('handles grid and flex items', () => {
    const result = combineLayouts([
      { type: 'grid-item', colSpan: 2 },
      { type: 'flex-item', grow: 1 }
    ]);
    
    expect(result.layouts).toHaveLength(2);
  });

  test('filters out invalid types', () => {
    const result = combineLayouts([
      { type: 'grid', columns: 3 },
      { type: 'invalid' }
    ]);
    
    expect(result.layouts).toHaveLength(1);
  });
});
