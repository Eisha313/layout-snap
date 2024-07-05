/**
 * CSS generators for Grid and Flexbox layouts
 */

import { validateConfig, sanitizeCSSValue, toKebabCase } from './utils.js';

/**
 * Generates CSS Grid styles from configuration
 * @param {Object} config - Grid configuration
 * @returns {string} Generated CSS
 */
export function generateGrid(config) {
  const validated = validateConfig({ ...config, type: 'grid' });
  const { columns, gap, areas, className = 'layout-grid' } = validated;
  
  let css = `.${className} {\n`;
  css += `  display: grid;\n`;
  css += `  grid-template-columns: repeat(${sanitizeCSSValue(columns)}, 1fr);\n`;
  css += `  gap: ${sanitizeCSSValue(gap)};\n`;
  
  if (areas) {
    const areasStr = areas.map(row => `"${sanitizeCSSValue(row)}"`).join('\n    ');
    css += `  grid-template-areas:\n    ${areasStr};\n`;
  }
  
  css += `}\n`;
  
  // Generate item styles
  if (validated.items && validated.items.length > 0) {
    css += generateItemStyles(validated.items, className);
  }
  
  return css;
}

/**
 * Generates CSS Flexbox styles from configuration
 * @param {Object} config - Flexbox configuration
 * @returns {string} Generated CSS
 */
export function generateFlex(config) {
  const validated = validateConfig({ ...config, type: 'flex' });
  const { 
    direction = 'row', 
    wrap = 'wrap', 
    justify = 'flex-start', 
    align = 'stretch',
    gap,
    className = 'layout-flex' 
  } = validated;
  
  let css = `.${className} {\n`;
  css += `  display: flex;\n`;
  css += `  flex-direction: ${sanitizeCSSValue(direction)};\n`;
  css += `  flex-wrap: ${sanitizeCSSValue(wrap)};\n`;
  css += `  justify-content: ${sanitizeCSSValue(justify)};\n`;
  css += `  align-items: ${sanitizeCSSValue(align)};\n`;
  css += `  gap: ${sanitizeCSSValue(gap)};\n`;
  css += `}\n`;
  
  // Generate item styles
  if (validated.items && validated.items.length > 0) {
    css += generateFlexItemStyles(validated.items, className);
  }
  
  return css;
}

/**
 * Generates styles for grid items
 * @param {Array} items - Item configurations
 * @param {string} parentClass - Parent class name
 * @returns {string} Generated CSS
 */
function generateItemStyles(items, parentClass) {
  let css = '';
  
  items.forEach((item, index) => {
    const itemClass = item.className || `${parentClass}-item-${index + 1}`;
    css += `\n.${itemClass} {\n`;
    
    if (item.area) {
      css += `  grid-area: ${sanitizeCSSValue(item.area)};\n`;
    }
    if (item.column) {
      css += `  grid-column: ${sanitizeCSSValue(item.column)};\n`;
    }
    if (item.row) {
      css += `  grid-row: ${sanitizeCSSValue(item.row)};\n`;
    }
    
    // Add custom styles
    if (item.styles) {
      css += generateCustomStyles(item.styles);
    }
    
    css += `}\n`;
  });
  
  return css;
}

/**
 * Generates styles for flex items
 * @param {Array} items - Item configurations
 * @param {string} parentClass - Parent class name
 * @returns {string} Generated CSS
 */
function generateFlexItemStyles(items, parentClass) {
  let css = '';
  
  items.forEach((item, index) => {
    const itemClass = item.className || `${parentClass}-item-${index + 1}`;
    css += `\n.${itemClass} {\n`;
    
    if (item.flex) {
      css += `  flex: ${sanitizeCSSValue(item.flex)};\n`;
    }
    if (item.basis) {
      css += `  flex-basis: ${sanitizeCSSValue(item.basis)};\n`;
    }
    if (item.grow !== undefined) {
      css += `  flex-grow: ${sanitizeCSSValue(item.grow)};\n`;
    }
    if (item.shrink !== undefined) {
      css += `  flex-shrink: ${sanitizeCSSValue(item.shrink)};\n`;
    }
    if (item.order !== undefined) {
      css += `  order: ${sanitizeCSSValue(item.order)};\n`;
    }
    
    // Add custom styles
    if (item.styles) {
      css += generateCustomStyles(item.styles);
    }
    
    css += `}\n`;
  });
  
  return css;
}

/**
 * Generates custom CSS properties from an object
 * @param {Object} styles - Style object
 * @returns {string} Generated CSS properties
 */
function generateCustomStyles(styles) {
  let css = '';
  
  for (const [prop, value] of Object.entries(styles)) {
    const cssProp = toKebabCase(prop);
    css += `  ${cssProp}: ${sanitizeCSSValue(value)};\n`;
  }
  
  return css;
}

/**
 * Main generator function that routes to appropriate generator
 * @param {Object} config - Layout configuration
 * @returns {string} Generated CSS
 */
export function generate(config) {
  const validated = validateConfig(config);
  
  switch (validated.type) {
    case 'grid':
      return generateGrid(validated);
    case 'flex':
      return generateFlex(validated);
    default:
      throw new Error(`Unknown layout type: ${validated.type}`);
  }
}
