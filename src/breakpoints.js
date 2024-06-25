/**
 * Responsive breakpoint system for layout-snap
 * Handles media query generation and injection
 */

const DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

/**
 * Create a breakpoint configuration
 * @param {Object} customBreakpoints - Custom breakpoint values
 * @returns {Object} Merged breakpoint configuration
 */
export function createBreakpoints(customBreakpoints = {}) {
  return { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };
}

/**
 * Generate media query string for a breakpoint
 * @param {string} breakpoint - Breakpoint name
 * @param {Object} breakpoints - Breakpoint configuration
 * @param {string} direction - 'up' or 'down'
 * @returns {string} Media query string
 */
export function getMediaQuery(breakpoint, breakpoints = DEFAULT_BREAKPOINTS, direction = 'up') {
  const value = breakpoints[breakpoint];
  
  if (value === undefined) {
    throw new Error(`Unknown breakpoint: ${breakpoint}`);
  }
  
  if (direction === 'up') {
    return value === 0 ? '' : `@media (min-width: ${value}px)`;
  }
  
  return `@media (max-width: ${value - 0.02}px)`;
}

/**
 * Generate responsive CSS rules
 * @param {Object} responsiveConfig - Configuration with breakpoint keys
 * @param {Function} ruleGenerator - Function that generates CSS for each breakpoint
 * @param {Object} breakpoints - Breakpoint configuration
 * @returns {string} Complete CSS with media queries
 */
export function generateResponsiveCSS(responsiveConfig, ruleGenerator, breakpoints = DEFAULT_BREAKPOINTS) {
  const cssBlocks = [];
  
  // Sort breakpoints by value (mobile-first)
  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([name]) => name);
  
  for (const bp of sortedBreakpoints) {
    if (responsiveConfig[bp]) {
      const rules = ruleGenerator(responsiveConfig[bp], bp);
      const mediaQuery = getMediaQuery(bp, breakpoints, 'up');
      
      if (mediaQuery) {
        cssBlocks.push(`${mediaQuery} {\n${rules}\n}`);
      } else {
        cssBlocks.push(rules);
      }
    }
  }
  
  return cssBlocks.join('\n\n');
}

/**
 * Inject CSS into the document
 * @param {string} css - CSS string to inject
 * @param {string} id - Unique identifier for the style element
 * @returns {HTMLStyleElement} The created/updated style element
 */
export function injectCSS(css, id = 'layout-snap-styles') {
  if (typeof document === 'undefined') {
    return null;
  }
  
  let styleElement = document.getElementById(id);
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.setAttribute('data-layout-snap', 'true');
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = css;
  return styleElement;
}

/**
 * Remove injected CSS
 * @param {string} id - Identifier of the style element to remove
 */
export function removeCSS(id = 'layout-snap-styles') {
  if (typeof document === 'undefined') {
    return;
  }
  
  const styleElement = document.getElementById(id);
  if (styleElement) {
    styleElement.remove();
  }
}

export { DEFAULT_BREAKPOINTS };
