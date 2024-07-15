/**
 * @module breakpoints
 * @description Responsive breakpoint management and media query generation
 */

import { deepMerge, sanitizeValue } from './utils.js';

/**
 * Default breakpoint values following common device widths
 * @type {Object.<string, string>}
 * @property {string} xs - Extra small devices (portrait phones)
 * @property {string} sm - Small devices (landscape phones)
 * @property {string} md - Medium devices (tablets)
 * @property {string} lg - Large devices (desktops)
 * @property {string} xl - Extra large devices (large desktops)
 * @property {string} xxl - Extra extra large devices (larger desktops)
 */
export const defaultBreakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

/**
 * Stores custom breakpoint configurations
 * @type {Object.<string, string>}
 * @private
 */
let customBreakpoints = { ...defaultBreakpoints };

/**
 * Sets custom breakpoint values, merging with defaults
 * @param {Object.<string, string>} breakpoints - Custom breakpoint definitions
 * @returns {Object.<string, string>} The merged breakpoint configuration
 * @example
 * setBreakpoints({ md: '800px', lg: '1024px' });
 */
export function setBreakpoints(breakpoints) {
  customBreakpoints = deepMerge(defaultBreakpoints, breakpoints);
  return customBreakpoints;
}

/**
 * Gets the current breakpoint configuration
 * @returns {Object.<string, string>} Current breakpoint values
 * @example
 * const breakpoints = getBreakpoints();
 * console.log(breakpoints.md); // '768px'
 */
export function getBreakpoints() {
  return { ...customBreakpoints };
}

/**
 * Resets breakpoints to default values
 * @returns {Object.<string, string>} The default breakpoint configuration
 */
export function resetBreakpoints() {
  customBreakpoints = { ...defaultBreakpoints };
  return customBreakpoints;
}

/**
 * Generates a media query string for a minimum width breakpoint
 * @param {string} breakpoint - The breakpoint name (e.g., 'md', 'lg')
 * @returns {string} Media query string
 * @throws {Error} If the breakpoint name is not defined
 * @example
 * mediaUp('md'); // Returns '@media (min-width: 768px)'
 */
export function mediaUp(breakpoint) {
  const value = customBreakpoints[breakpoint];
  if (!value) {
    throw new Error(`Breakpoint '${breakpoint}' is not defined`);
  }
  return `@media (min-width: ${value})`;
}

/**
 * Generates a media query string for a maximum width breakpoint
 * @param {string} breakpoint - The breakpoint name (e.g., 'md', 'lg')
 * @returns {string} Media query string
 * @throws {Error} If the breakpoint name is not defined
 * @example
 * mediaDown('md'); // Returns '@media (max-width: 767.98px)'
 */
export function mediaDown(breakpoint) {
  const value = customBreakpoints[breakpoint];
  if (!value) {
    throw new Error(`Breakpoint '${breakpoint}' is not defined`);
  }
  const numValue = parseFloat(value) - 0.02;
  return `@media (max-width: ${numValue}px)`;
}

/**
 * Generates a media query string for a range between two breakpoints
 * @param {string} lower - The lower breakpoint name
 * @param {string} upper - The upper breakpoint name
 * @returns {string} Media query string for the range
 * @throws {Error} If either breakpoint name is not defined
 * @example
 * mediaBetween('sm', 'lg');
 * // Returns '@media (min-width: 576px) and (max-width: 991.98px)'
 */
export function mediaBetween(lower, upper) {
  const lowerValue = customBreakpoints[lower];
  const upperValue = customBreakpoints[upper];
  
  if (!lowerValue) {
    throw new Error(`Breakpoint '${lower}' is not defined`);
  }
  if (!upperValue) {
    throw new Error(`Breakpoint '${upper}' is not defined`);
  }
  
  const upperNum = parseFloat(upperValue) - 0.02;
  return `@media (min-width: ${lowerValue}) and (max-width: ${upperNum}px)`;
}

/**
 * Generates responsive CSS with styles for different breakpoints
 * @param {string} selector - CSS selector for the rule
 * @param {Object.<string, Object>} responsiveStyles - Object mapping breakpoint names to style objects
 * @returns {string} Complete CSS string with media queries
 * @example
 * generateResponsiveCSS('.grid', {
 *   base: { gridTemplateColumns: 'repeat(1, 1fr)' },
 *   md: { gridTemplateColumns: 'repeat(2, 1fr)' },
 *   lg: { gridTemplateColumns: 'repeat(4, 1fr)' }
 * });
 */
export function generateResponsiveCSS(selector, responsiveStyles) {
  const cssRules = [];
  
  // Handle base styles (no media query)
  if (responsiveStyles.base) {
    const baseCSS = generateCSSBlock(selector, responsiveStyles.base);
    cssRules.push(baseCSS);
  }
  
  // Handle breakpoint-specific styles
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  
  for (const bp of breakpointOrder) {
    if (responsiveStyles[bp] && bp !== 'xs') {
      const mediaQuery = mediaUp(bp);
      const cssBlock = generateCSSBlock(selector, responsiveStyles[bp]);
      cssRules.push(`${mediaQuery} { ${cssBlock} }`);
    } else if (responsiveStyles[bp] && bp === 'xs') {
      // xs is treated as base/mobile-first
      const cssBlock = generateCSSBlock(selector, responsiveStyles[bp]);
      cssRules.push(cssBlock);
    }
  }
  
  return cssRules.join('\n');
}

/**
 * Generates a CSS block from a selector and styles object
 * @param {string} selector - CSS selector
 * @param {Object} styles - Style properties and values
 * @returns {string} CSS rule block
 * @private
 */
function generateCSSBlock(selector, styles) {
  const declarations = Object.entries(styles)
    .map(([prop, value]) => {
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProp}: ${sanitizeValue(value)}`;
    })
    .join('; ');
  
  return `${selector} { ${declarations}; }`;
}
