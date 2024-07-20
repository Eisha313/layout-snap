/**
 * CSS Grid and Flexbox layout generators
 */

import { generateClassName, mergeDeep, sanitizeValue, validateNumber } from './utils.js';

/**
 * Generate CSS Grid layout from configuration
 * @param {Object} config - Grid configuration
 * @returns {Object} - CSS styles and class name
 */
export function generateGrid(config = {}) {
  const {
    columns = 12,
    rows = 'auto',
    gap = '1rem',
    rowGap,
    columnGap,
    areas = null,
    alignItems = 'stretch',
    justifyItems = 'stretch',
    className = null,
    minColumnWidth = null,
    important = false
  } = config;

  const generatedClassName = className || generateClassName('grid');
  const imp = important ? ' !important' : '';
  
  let styles = {
    display: `grid${imp}`,
    alignItems: `${alignItems}${imp}`,
    justifyItems: `${justifyItems}${imp}`
  };

  // Handle gap with separate row/column gap support
  if (rowGap !== undefined || columnGap !== undefined) {
    if (rowGap !== undefined) {
      styles.rowGap = `${sanitizeValue(rowGap)}${imp}`;
    }
    if (columnGap !== undefined) {
      styles.columnGap = `${sanitizeValue(columnGap)}${imp}`;
    }
  } else if (gap) {
    styles.gap = `${sanitizeValue(gap)}${imp}`;
  }

  // Handle columns
  if (minColumnWidth) {
    styles.gridTemplateColumns = `repeat(auto-fit, minmax(${sanitizeValue(minColumnWidth)}, 1fr))${imp}`;
  } else if (typeof columns === 'number' && validateNumber(columns, 1, 24)) {
    styles.gridTemplateColumns = `repeat(${columns}, 1fr)${imp}`;
  } else if (typeof columns === 'string') {
    styles.gridTemplateColumns = `${columns}${imp}`;
  }

  // Handle rows
  if (typeof rows === 'number' && validateNumber(rows, 1, 100)) {
    styles.gridTemplateRows = `repeat(${rows}, 1fr)${imp}`;
  } else if (typeof rows === 'string' && rows !== 'auto') {
    styles.gridTemplateRows = `${rows}${imp}`;
  }

  // Handle grid areas
  if (areas && Array.isArray(areas)) {
    styles.gridTemplateAreas = areas.map(row => `"${row}"`).join(' ');
    if (important) {
      styles.gridTemplateAreas += ' !important';
    }
  }

  return {
    className: generatedClassName,
    styles,
    css: generateCSSRule(generatedClassName, styles)
  };
}

/**
 * Generate Flexbox layout from configuration
 * @param {Object} config - Flexbox configuration
 * @returns {Object} - CSS styles and class name
 */
export function generateFlex(config = {}) {
  const {
    direction = 'row',
    wrap = 'wrap',
    gap = '1rem',
    rowGap,
    columnGap,
    justify = 'flex-start',
    align = 'stretch',
    className = null,
    important = false
  } = config;

  const generatedClassName = className || generateClassName('flex');
  const imp = important ? ' !important' : '';
  
  let styles = {
    display: `flex${imp}`,
    flexDirection: `${direction}${imp}`,
    flexWrap: `${wrap}${imp}`,
    justifyContent: `${justify}${imp}`,
    alignItems: `${align}${imp}`
  };

  // Handle gap with separate row/column gap support
  if (rowGap !== undefined || columnGap !== undefined) {
    if (rowGap !== undefined) {
      styles.rowGap = `${sanitizeValue(rowGap)}${imp}`;
    }
    if (columnGap !== undefined) {
      styles.columnGap = `${sanitizeValue(columnGap)}${imp}`;
    }
  } else if (gap) {
    styles.gap = `${sanitizeValue(gap)}${imp}`;
  }

  return {
    className: generatedClassName,
    styles,
    css: generateCSSRule(generatedClassName, styles)
  };
}

/**
 * Generate a grid item configuration
 * @param {Object} config - Item configuration
 * @returns {Object} - CSS styles and class name
 */
export function generateGridItem(config = {}) {
  const {
    colSpan = 1,
    rowSpan = 1,
    colStart = null,
    rowStart = null,
    area = null,
    className = null,
    important = false
  } = config;

  const generatedClassName = className || generateClassName('grid-item');
  const imp = important ? ' !important' : '';
  let styles = {};

  if (area) {
    styles.gridArea = `${area}${imp}`;
  } else {
    if (colSpan > 1 || colStart) {
      if (colStart) {
        styles.gridColumn = `${colStart} / span ${colSpan}${imp}`;
      } else {
        styles.gridColumn = `span ${colSpan}${imp}`;
      }
    }

    if (rowSpan > 1 || rowStart) {
      if (rowStart) {
        styles.gridRow = `${rowStart} / span ${rowSpan}${imp}`;
      } else {
        styles.gridRow = `span ${rowSpan}${imp}`;
      }
    }
  }

  return {
    className: generatedClassName,
    styles,
    css: generateCSSRule(generatedClassName, styles)
  };
}

/**
 * Generate a flex item configuration
 * @param {Object} config - Item configuration
 * @returns {Object} - CSS styles and class name
 */
export function generateFlexItem(config = {}) {
  const {
    grow = 0,
    shrink = 1,
    basis = 'auto',
    alignSelf = null,
    order = null,
    className = null,
    important = false
  } = config;

  const generatedClassName = className || generateClassName('flex-item');
  const imp = important ? ' !important' : '';
  let styles = {
    flexGrow: `${grow}${imp}`,
    flexShrink: `${shrink}${imp}`,
    flexBasis: `${sanitizeValue(basis)}${imp}`
  };

  if (alignSelf) {
    styles.alignSelf = `${alignSelf}${imp}`;
  }

  if (order !== null) {
    styles.order = `${order}${imp}`;
  }

  return {
    className: generatedClassName,
    styles,
    css: generateCSSRule(generatedClassName, styles)
  };
}

/**
 * Generate CSS rule string from class name and styles
 * @param {string} className - CSS class name
 * @param {Object} styles - Style object
 * @returns {string} - CSS rule string
 */
export function generateCSSRule(className, styles) {
  const properties = Object.entries(styles)
    .map(([prop, value]) => {
      const cssProperty = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssProperty}: ${value};`;
    })
    .join('\n');

  return `.${className} {\n${properties}\n}`;
}

/**
 * Combine multiple layout configurations
 * @param {Array} configs - Array of layout configs
 * @returns {Object} - Combined CSS output
 */
export function combineLayouts(configs) {
  const results = configs.map(config => {
    if (config.type === 'grid') {
      return generateGrid(config);
    } else if (config.type === 'flex') {
      return generateFlex(config);
    } else if (config.type === 'grid-item') {
      return generateGridItem(config);
    } else if (config.type === 'flex-item') {
      return generateFlexItem(config);
    }
    return null;
  }).filter(Boolean);

  return {
    layouts: results,
    css: results.map(r => r.css).join('\n\n')
  };
}
