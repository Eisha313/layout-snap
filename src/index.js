/**
 * layout-snap
 * A lightweight JavaScript library for generating responsive CSS Grid and Flexbox layouts
 */

import { generateGridCSS, generateFlexboxCSS, generateLayoutCSS } from './generators.js';
import { presets, getPreset, registerPreset } from './presets.js';
import { createBreakpoints, injectBreakpoints, defaultBreakpoints } from './breakpoints.js';
import { createPreview, quickPreview, LivePreview } from './preview.js';

// Main API
export {
  // Generators
  generateGridCSS,
  generateFlexboxCSS,
  generateLayoutCSS,
  
  // Presets
  presets,
  getPreset,
  registerPreset,
  
  // Breakpoints
  createBreakpoints,
  injectBreakpoints,
  defaultBreakpoints,
  
  // Live Preview
  createPreview,
  quickPreview,
  LivePreview
};

// Default export with all utilities
export default {
  generateGridCSS,
  generateFlexboxCSS,
  generateLayoutCSS,
  presets,
  getPreset,
  registerPreset,
  createBreakpoints,
  injectBreakpoints,
  defaultBreakpoints,
  createPreview,
  quickPreview,
  LivePreview
};
