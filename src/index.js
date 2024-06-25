/**
 * layout-snap - Lightweight CSS Grid and Flexbox layout generator
 * @module layout-snap
 */

export { generateGridCSS, generateFlexCSS, generateLayoutCSS } from './generators.js';
export { presets, getPreset, registerPreset } from './presets.js';
export {
  createBreakpoints,
  getMediaQuery,
  generateResponsiveCSS,
  injectCSS,
  removeCSS,
  DEFAULT_BREAKPOINTS
} from './breakpoints.js';

/**
 * Create a complete layout with responsive support
 * @param {Object} config - Layout configuration
 * @param {Object} options - Additional options
 * @returns {Object} Generated CSS and utility functions
 */
export function createLayout(config, options = {}) {
  const {
    inject = false,
    id = 'layout-snap-' + Date.now()
  } = options;

  const { generateLayoutCSS } = require('./generators.js');
  const { injectCSS, removeCSS } = require('./breakpoints.js');

  const css = generateLayoutCSS(config);

  if (inject && typeof document !== 'undefined') {
    injectCSS(css, id);
  }

  return {
    css,
    id,
    inject: () => injectCSS(css, id),
    remove: () => removeCSS(id),
    update: (newConfig) => {
      const newCSS = generateLayoutCSS(newConfig);
      if (inject) {
        injectCSS(newCSS, id);
      }
      return newCSS;
    }
  };
}
