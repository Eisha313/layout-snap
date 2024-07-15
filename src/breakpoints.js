/**
 * Responsive breakpoint management and media query generation
 */

import { generateGrid, generateFlex } from './generators.js';

/**
 * Default breakpoint definitions
 */
export const defaultBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

/**
 * Generate media query wrapper
 * @param {string} breakpoint - Breakpoint name
 * @param {string} css - CSS content
 * @param {Object} breakpoints - Breakpoint definitions
 * @returns {string} Media query wrapped CSS
 */
export function wrapInMediaQuery(breakpoint, css, breakpoints = defaultBreakpoints) {
  const minWidth = breakpoints[breakpoint];
  
  if (minWidth === undefined) {
    console.warn(`Unknown breakpoint: ${breakpoint}`);
    return css;
  }
  
  // For the smallest breakpoint (0), don't wrap in media query
  if (minWidth === 0) {
    return css;
  }
  
  return `@media (min-width: ${minWidth}px) {\n${css}}\n`;
}

/**
 * Generate responsive layout with multiple breakpoints
 * @param {Object} config - Layout configuration with breakpoint overrides
 * @returns {string} Complete responsive CSS
 */
export function generateResponsiveLayout(config) {
  const {
    type = 'grid',
    base = {},
    responsive = {},
    breakpoints = defaultBreakpoints
  } = config;

  const generator = type === 'flex' ? generateFlex : generateGrid;
  let css = '';
  
  // Generate base styles (mobile-first, no media query)
  css += generator(base);
  
  // Sort breakpoints by min-width to ensure proper cascade
  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([name]) => name);
  
  // Generate responsive overrides in order of breakpoint size
  for (const breakpoint of sortedBreakpoints) {
    if (responsive[breakpoint]) {
      const mergedConfig = { ...base, ...responsive[breakpoint] };
      const breakpointCss = generator(mergedConfig);
      const minWidth = breakpoints[breakpoint];
      
      // Skip wrapping for 0-width breakpoints (already covered by base)
      if (minWidth > 0) {
        css += wrapInMediaQuery(breakpoint, breakpointCss, breakpoints);
      }
    }
  }
  
  return css;
}

/**
 * Inject CSS into document with proper style element management
 * @param {string} css - CSS to inject
 * @param {string} id - Style element ID
 * @returns {HTMLStyleElement} The style element
 */
export function injectStyles(css, id = 'layout-snap-styles') {
  if (typeof document === 'undefined') {
    return null;
  }
  
  let styleEl = document.getElementById(id);
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = id;
    styleEl.setAttribute('data-layout-snap', 'true');
    
    // Insert at the end of head to ensure higher specificity
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(styleEl);
  }
  
  styleEl.textContent = css;
  
  return styleEl;
}

/**
 * Remove injected styles
 * @param {string} id - Style element ID
 */
export function removeStyles(id = 'layout-snap-styles') {
  if (typeof document === 'undefined') {
    return;
  }
  
  const styleEl = document.getElementById(id);
  if (styleEl) {
    styleEl.remove();
  }
}

/**
 * Create custom breakpoint set
 * @param {Object} customBreakpoints - Custom breakpoint definitions
 * @returns {Object} Merged breakpoints
 */
export function createBreakpoints(customBreakpoints) {
  return { ...defaultBreakpoints, ...customBreakpoints };
}
