/**
 * Breakpoint utilities for responsive layout generation
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
 * Validate breakpoint configuration
 * @param {Object} breakpoints - Breakpoint definitions
 * @returns {boolean} - Whether breakpoints are valid
 */
function validateBreakpoints(breakpoints) {
  if (!breakpoints || typeof breakpoints !== 'object') {
    return false;
  }
  
  const values = Object.values(breakpoints);
  return values.every(v => typeof v === 'number' && v >= 0 && Number.isFinite(v));
}

/**
 * Merge custom breakpoints with defaults
 * @param {Object} custom - Custom breakpoint definitions
 * @returns {Object} - Merged breakpoints
 */
function mergeBreakpoints(custom = {}) {
  if (!validateBreakpoints(custom)) {
    return { ...DEFAULT_BREAKPOINTS };
  }
  return { ...DEFAULT_BREAKPOINTS, ...custom };
}

/**
 * Sort breakpoints by value in ascending order for mobile-first approach
 * @param {Object} breakpoints - Breakpoint definitions
 * @returns {Array} - Sorted array of [name, value] pairs
 */
function sortBreakpoints(breakpoints) {
  return Object.entries(breakpoints)
    .filter(([, value]) => typeof value === 'number' && Number.isFinite(value))
    .sort((a, b) => a[1] - b[1]);
}

/**
 * Generate media query string for a breakpoint
 * @param {number} minWidth - Minimum width in pixels
 * @param {number|null} maxWidth - Maximum width in pixels (optional)
 * @returns {string} - Media query string
 */
function generateMediaQuery(minWidth, maxWidth = null) {
  if (minWidth === 0 && maxWidth === null) {
    return ''; // Base styles, no media query needed
  }
  
  if (minWidth === 0 && maxWidth !== null) {
    return `@media (max-width: ${maxWidth - 0.02}px)`;
  }
  
  if (maxWidth === null) {
    return `@media (min-width: ${minWidth}px)`;
  }
  
  return `@media (min-width: ${minWidth}px) and (max-width: ${maxWidth - 0.02}px)`;
}

/**
 * Generate responsive CSS with proper cascade order
 * @param {Object} config - Layout configuration with responsive settings
 * @param {Function} cssGenerator - Function that generates CSS for given config
 * @param {Object} customBreakpoints - Custom breakpoint definitions
 * @returns {string} - Complete responsive CSS
 */
function generateResponsiveCSS(config, cssGenerator, customBreakpoints = {}) {
  const breakpoints = mergeBreakpoints(customBreakpoints);
  const sortedBreakpoints = sortBreakpoints(breakpoints);
  const cssBlocks = [];
  
  // Generate base CSS (mobile-first)
  const baseCSS = cssGenerator(config.base || config);
  if (baseCSS && baseCSS.trim()) {
    cssBlocks.push(baseCSS);
  }
  
  // Generate responsive overrides in ascending order (mobile-first)
  if (config.responsive) {
    const responsiveKeys = Object.keys(config.responsive);
    
    // Sort responsive config keys by breakpoint value
    const sortedResponsiveKeys = responsiveKeys
      .filter(key => breakpoints[key] !== undefined)
      .sort((a, b) => breakpoints[a] - breakpoints[b]);
    
    for (const breakpointName of sortedResponsiveKeys) {
      const breakpointValue = breakpoints[breakpointName];
      const responsiveConfig = config.responsive[breakpointName];
      
      // Skip base breakpoint (0px) as it's already handled
      if (breakpointValue === 0) {
        continue;
      }
      
      const mediaQuery = generateMediaQuery(breakpointValue);
      const responsiveCSS = cssGenerator(responsiveConfig);
      
      if (responsiveCSS && responsiveCSS.trim() && mediaQuery) {
        cssBlocks.push(`${mediaQuery} {\n${responsiveCSS}\n}`);
      }
    }
  }
  
  return cssBlocks.join('\n\n');
}

/**
 * Get the active breakpoint for a given width
 * @param {number} width - Current viewport width
 * @param {Object} customBreakpoints - Custom breakpoint definitions
 * @returns {string} - Name of the active breakpoint
 */
function getActiveBreakpoint(width, customBreakpoints = {}) {
  if (typeof width !== 'number' || width < 0 || !Number.isFinite(width)) {
    return 'xs';
  }
  
  const breakpoints = mergeBreakpoints(customBreakpoints);
  const sorted = sortBreakpoints(breakpoints);
  
  let active = sorted[0]?.[0] || 'xs';
  
  for (const [name, value] of sorted) {
    if (width >= value) {
      active = name;
    } else {
      break;
    }
  }
  
  return active;
}

module.exports = {
  DEFAULT_BREAKPOINTS,
  validateBreakpoints,
  mergeBreakpoints,
  sortBreakpoints,
  generateMediaQuery,
  generateResponsiveCSS,
  getActiveBreakpoint
};