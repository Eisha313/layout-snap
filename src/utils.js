/**
 * Utility functions for layout-snap
 */

/**
 * Validates that a value is a non-empty string
 * @param {*} value - Value to validate
 * @param {string} name - Name of the parameter for error messages
 * @returns {boolean}
 */
export function isValidString(value, name = 'value') {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }
  return true;
}

/**
 * Validates layout configuration object
 * @param {Object} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 * @returns {Object} Validated and normalized config
 */
export function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be a non-null object');
  }

  const validTypes = ['grid', 'flex'];
  if (config.type && !validTypes.includes(config.type)) {
    throw new Error(`Invalid layout type: ${config.type}. Must be one of: ${validTypes.join(', ')}`);
  }

  return {
    type: config.type || 'grid',
    columns: config.columns || 12,
    gap: config.gap || '1rem',
    areas: config.areas || null,
    items: config.items || [],
    responsive: config.responsive !== false,
    ...config
  };
}

/**
 * Validates breakpoint configuration
 * @param {Object} breakpoint - Breakpoint to validate
 * @returns {boolean}
 */
export function isValidBreakpoint(breakpoint) {
  if (!breakpoint || typeof breakpoint !== 'object') {
    return false;
  }
  if (typeof breakpoint.min !== 'number' && typeof breakpoint.max !== 'number') {
    return false;
  }
  return true;
}

/**
 * Deep merges two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (isPlainObject(source[key]) && isPlainObject(target[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

/**
 * Checks if value is a plain object
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Generates a unique ID for elements
 * @param {string} prefix - Prefix for the ID
 * @returns {string}
 */
export function generateId(prefix = 'ls') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Converts camelCase to kebab-case
 * @param {string} str - String to convert
 * @returns {string}
 */
export function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Sanitizes CSS value to prevent injection
 * @param {string} value - CSS value to sanitize
 * @returns {string}
 */
export function sanitizeCSSValue(value) {
  if (typeof value !== 'string') {
    return String(value);
  }
  // Remove potentially dangerous characters
  return value.replace(/[;<>{}]/g, '');
}
