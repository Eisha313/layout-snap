/**
 * layout-snap - A lightweight JavaScript library for generating responsive CSS Grid and Flexbox layouts
 */

import { generateGridCSS, generateFlexCSS, generateLayout } from './generators.js';
import { getPreset, listPresets, PRESETS } from './presets.js';
import { generateResponsiveCSS, createMediaQuery, DEFAULT_BREAKPOINTS } from './breakpoints.js';
import { createPreview, destroyPreview, updatePreview } from './preview.js';
import { createHotReload, watchConfig } from './hot-reload.js';
import { mergeConfig, generateClassName, cssToObject, objectToCSS } from './utils.js';

// Main API
export {
  // Core generators
  generateGridCSS,
  generateFlexCSS,
  generateLayout,
  
  // Presets
  getPreset,
  listPresets,
  PRESETS,
  
  // Responsive utilities
  generateResponsiveCSS,
  createMediaQuery,
  DEFAULT_BREAKPOINTS,
  
  // Preview mode
  createPreview,
  destroyPreview,
  updatePreview,
  
  // Hot reload
  createHotReload,
  watchConfig,
  
  // Utilities
  mergeConfig,
  generateClassName,
  cssToObject,
  objectToCSS
};

// Default export with all functionality
export default {
  generateGridCSS,
  generateFlexCSS,
  generateLayout,
  getPreset,
  listPresets,
  PRESETS,
  generateResponsiveCSS,
  createMediaQuery,
  DEFAULT_BREAKPOINTS,
  createPreview,
  destroyPreview,
  updatePreview,
  createHotReload,
  watchConfig,
  mergeConfig,
  generateClassName,
  cssToObject,
  objectToCSS
};