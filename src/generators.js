/**
 * @module generators
 * @description CSS Grid and Flexbox layout generators
 */

import { generateClassName, sanitizeValue, deepMerge } from './utils.js';

/**
 * Default grid configuration options
 * @type {Object}
 */
const defaultGridConfig = {
  columns: 12,
  gap: '1rem',
  rowGap: null,
  columnGap: null,
  minColumnWidth: null,
  autoFit: false,
  autoFill: false,
  alignItems: 'stretch',
  justifyItems: 'stretch'
};

/**
 * Default flexbox configuration options
 * @type {Object}
 */
const defaultFlexConfig = {
  direction: 'row',
  wrap: 'wrap',
  justify: 'flex-start',
  align: 'stretch',
  gap: '1rem'
};

/**
 * Generates CSS Grid layout styles from configuration
 * @param {Object} config - Grid configuration object
 * @param {number|string} [config.columns=12] - Number of columns or template string
 * @param {string} [config.gap='1rem'] - Gap between grid items
 * @param {string} [config.rowGap] - Row gap (overrides gap for rows)
 * @param {string} [config.columnGap] - Column gap (overrides gap for columns)
 * @param {string} [config.minColumnWidth] - Minimum column width for auto-fit/fill
 * @param {boolean} [config.autoFit=false] - Use auto-fit for responsive columns
 * @param {boolean} [config.autoFill=false] - Use auto-fill for responsive columns
 * @param {string} [config.alignItems='stretch'] - Align items vertically
 * @param {string} [config.justifyItems='stretch'] - Justify items horizontally
 * @param {string} [config.className] - Custom class name
 * @returns {Object} Generated CSS object with className and styles
 * @example
 * const grid = generateGrid({ columns: 3, gap: '2rem' });
 * // Returns: { className: 'ls-grid-xxx', css: '.ls-grid-xxx { ... }' }
 */
export function generateGrid(config = {}) {
  const options = deepMerge(defaultGridConfig, config);
  const className = options.className || generateClassName('grid');
  
  let gridTemplateColumns;
  
  if (options.autoFit && options.minColumnWidth) {
    gridTemplateColumns = `repeat(auto-fit, minmax(${sanitizeValue(options.minColumnWidth)}, 1fr))`;
  } else if (options.autoFill && options.minColumnWidth) {
    gridTemplateColumns = `repeat(auto-fill, minmax(${sanitizeValue(options.minColumnWidth)}, 1fr))`;
  } else if (typeof options.columns === 'string') {
    gridTemplateColumns = options.columns;
  } else {
    gridTemplateColumns = `repeat(${options.columns}, 1fr)`;
  }
  
  const styles = {
    display: 'grid',
    gridTemplateColumns,
    gap: sanitizeValue(options.gap),
    alignItems: options.alignItems,
    justifyItems: options.justifyItems
  };
  
  if (options.rowGap) {
    styles.rowGap = sanitizeValue(options.rowGap);
  }
  
  if (options.columnGap) {
    styles.columnGap = sanitizeValue(options.columnGap);
  }
  
  const css = generateCSSRule(className, styles);
  
  return { className, css, styles };
}

/**
 * Generates Flexbox layout styles from configuration
 * @param {Object} config - Flexbox configuration object
 * @param {string} [config.direction='row'] - Flex direction
 * @param {string} [config.wrap='wrap'] - Flex wrap behavior
 * @param {string} [config.justify='flex-start'] - Justify content
 * @param {string} [config.align='stretch'] - Align items
 * @param {string} [config.gap='1rem'] - Gap between flex items
 * @param {string} [config.className] - Custom class name
 * @returns {Object} Generated CSS object with className and styles
 * @example
 * const flex = generateFlex({ direction: 'column', justify: 'center' });
 */
export function generateFlex(config = {}) {
  const options = deepMerge(defaultFlexConfig, config);
  const className = options.className || generateClassName('flex');
  
  const styles = {
    display: 'flex',
    flexDirection: options.direction,
    flexWrap: options.wrap,
    justifyContent: options.justify,
    alignItems: options.align,
    gap: sanitizeValue(options.gap)
  };
  
  const css = generateCSSRule(className, styles);
  
  return { className, css, styles };
}

/**
 * Generates a CSS rule string from a class name and styles object
 * @param {string} className - CSS class name (without dot prefix)
 * @param {Object} styles - Object containing CSS property-value pairs
 * @returns {string} Complete CSS rule string
 * @example
 * generateCSSRule('my-class', { display: 'flex', gap: '1rem' });
 * // Returns: '.my-class { display: flex; gap: 1rem; }'
 */
export function generateCSSRule(className, styles) {
  const declarations = Object.entries(styles)
    .filter(([, value]) => value != null)
    .map(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value}`;
    })
    .join('; ');
  
  return `.${className} { ${declarations}; }`;
}

/**
 * Generates CSS for grid item placement
 * @param {Object} config - Grid item configuration
 * @param {number|string} [config.colStart] - Column start position
 * @param {number|string} [config.colEnd] - Column end position
 * @param {number} [config.colSpan] - Number of columns to span
 * @param {number|string} [config.rowStart] - Row start position
 * @param {number|string} [config.rowEnd] - Row end position
 * @param {number} [config.rowSpan] - Number of rows to span
 * @param {string} [config.className] - Custom class name
 * @returns {Object} Generated CSS object for grid item
 */
export function generateGridItem(config = {}) {
  const className = config.className || generateClassName('grid-item');
  const styles = {};
  
  if (config.colStart) {
    styles.gridColumnStart = config.colStart;
  }
  
  if (config.colEnd) {
    styles.gridColumnEnd = config.colEnd;
  } else if (config.colSpan) {
    styles.gridColumnEnd = `span ${config.colSpan}`;
  }
  
  if (config.rowStart) {
    styles.gridRowStart = config.rowStart;
  }
  
  if (config.rowEnd) {
    styles.gridRowEnd = config.rowEnd;
  } else if (config.rowSpan) {
    styles.gridRowEnd = `span ${config.rowSpan}`;
  }
  
  const css = generateCSSRule(className, styles);
  
  return { className, css, styles };
}

/**
 * Generates CSS for flex item properties
 * @param {Object} config - Flex item configuration
 * @param {number|string} [config.grow=0] - Flex grow factor
 * @param {number|string} [config.shrink=1] - Flex shrink factor
 * @param {string} [config.basis='auto'] - Flex basis
 * @param {number} [config.order] - Item order
 * @param {string} [config.alignSelf] - Align self override
 * @param {string} [config.className] - Custom class name
 * @returns {Object} Generated CSS object for flex item
 */
export function generateFlexItem(config = {}) {
  const className = config.className || generateClassName('flex-item');
  const styles = {};
  
  if (config.grow !== undefined) {
    styles.flexGrow = config.grow;
  }
  
  if (config.shrink !== undefined) {
    styles.flexShrink = config.shrink;
  }
  
  if (config.basis) {
    styles.flexBasis = sanitizeValue(config.basis);
  }
  
  if (config.order !== undefined) {
    styles.order = config.order;
  }
  
  if (config.alignSelf) {
    styles.alignSelf = config.alignSelf;
  }
  
  const css = generateCSSRule(className, styles);
  
  return { className, css, styles };
}
