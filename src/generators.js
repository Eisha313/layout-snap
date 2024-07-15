/**
 * CSS Grid and Flexbox layout generators
 */

import { sanitizeValue, clamp, isValidUnit } from './utils.js';

/**
 * Generate CSS Grid layout from configuration
 * @param {Object} config - Grid configuration
 * @returns {string} CSS string
 */
export function generateGrid(config) {
  const {
    columns = 12,
    rows = 'auto',
    gap = '1rem',
    areas = null,
    alignItems = 'stretch',
    justifyItems = 'stretch',
    className = 'grid-layout'
  } = config;

  const sanitizedClassName = sanitizeValue(className);
  const sanitizedGap = isValidUnit(gap) ? gap : '1rem';
  
  let css = `.${sanitizedClassName} {\n`;
  css += `  display: grid;\n`;
  
  // Handle columns - support both number and string formats
  if (typeof columns === 'number') {
    const clampedColumns = clamp(columns, 1, 24);
    css += `  grid-template-columns: repeat(${clampedColumns}, 1fr);\n`;
  } else if (typeof columns === 'string' && columns.trim()) {
    css += `  grid-template-columns: ${columns};\n`;
  } else {
    css += `  grid-template-columns: repeat(12, 1fr);\n`;
  }
  
  // Handle rows - support both number and string formats
  if (typeof rows === 'number') {
    const clampedRows = clamp(rows, 1, 24);
    css += `  grid-template-rows: repeat(${clampedRows}, 1fr);\n`;
  } else if (rows !== 'auto' && typeof rows === 'string' && rows.trim()) {
    css += `  grid-template-rows: ${rows};\n`;
  }
  
  css += `  gap: ${sanitizedGap};\n`;
  
  if (areas && Array.isArray(areas) && areas.length > 0) {
    const validAreas = areas.filter(row => typeof row === 'string' && row.trim());
    if (validAreas.length > 0) {
      const areasStr = validAreas.map(row => `"${row}"`).join('\n    ');
      css += `  grid-template-areas:\n    ${areasStr};\n`;
    }
  }
  
  if (alignItems !== 'stretch') {
    css += `  align-items: ${alignItems};\n`;
  }
  
  if (justifyItems !== 'stretch') {
    css += `  justify-items: ${justifyItems};\n`;
  }
  
  css += `}\n`;
  
  return css;
}

/**
 * Generate CSS Flexbox layout from configuration
 * @param {Object} config - Flexbox configuration
 * @returns {string} CSS string
 */
export function generateFlex(config) {
  const {
    direction = 'row',
    wrap = 'wrap',
    gap = '1rem',
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    className = 'flex-layout'
  } = config;

  const sanitizedClassName = sanitizeValue(className);
  const sanitizedGap = isValidUnit(gap) ? gap : '1rem';
  
  const validDirections = ['row', 'row-reverse', 'column', 'column-reverse'];
  const validWrap = ['nowrap', 'wrap', 'wrap-reverse'];
  
  const safeDirection = validDirections.includes(direction) ? direction : 'row';
  const safeWrap = validWrap.includes(wrap) ? wrap : 'wrap';
  
  let css = `.${sanitizedClassName} {\n`;
  css += `  display: flex;\n`;
  css += `  flex-direction: ${safeDirection};\n`;
  css += `  flex-wrap: ${safeWrap};\n`;
  css += `  gap: ${sanitizedGap};\n`;
  css += `  align-items: ${alignItems};\n`;
  css += `  justify-content: ${justifyContent};\n`;
  css += `}\n`;
  
  return css;
}

/**
 * Generate child item styles for grid placement
 * @param {Object} config - Item configuration
 * @returns {string} CSS string
 */
export function generateGridItem(config) {
  const {
    className = 'grid-item',
    colSpan = 1,
    rowSpan = 1,
    colStart = null,
    rowStart = null,
    area = null
  } = config;

  const sanitizedClassName = sanitizeValue(className);
  
  let css = `.${sanitizedClassName} {\n`;
  
  if (area && typeof area === 'string' && area.trim()) {
    css += `  grid-area: ${area};\n`;
  } else {
    if (colStart !== null && typeof colStart === 'number' && colStart > 0) {
      css += `  grid-column-start: ${colStart};\n`;
    }
    if (rowStart !== null && typeof rowStart === 'number' && rowStart > 0) {
      css += `  grid-row-start: ${rowStart};\n`;
    }
    if (colSpan > 1) {
      const clampedColSpan = clamp(colSpan, 1, 24);
      css += `  grid-column: span ${clampedColSpan};\n`;
    }
    if (rowSpan > 1) {
      const clampedRowSpan = clamp(rowSpan, 1, 24);
      css += `  grid-row: span ${clampedRowSpan};\n`;
    }
  }
  
  css += `}\n`;
  
  return css;
}

/**
 * Generate flex item styles
 * @param {Object} config - Item configuration
 * @returns {string} CSS string
 */
export function generateFlexItem(config) {
  const {
    className = 'flex-item',
    grow = 0,
    shrink = 1,
    basis = 'auto',
    alignSelf = null,
    order = null
  } = config;

  const sanitizedClassName = sanitizeValue(className);
  
  let css = `.${sanitizedClassName} {\n`;
  css += `  flex: ${grow} ${shrink} ${basis};\n`;
  
  if (alignSelf) {
    css += `  align-self: ${alignSelf};\n`;
  }
  
  if (order !== null && typeof order === 'number') {
    css += `  order: ${order};\n`;
  }
  
  css += `}\n`;
  
  return css;
}
