/**
 * @module utils
 * @description Utility functions for layout-snap library
 */

/**
 * Counter for generating unique class names
 * @type {number}
 * @private
 */
let classCounter = 0;

/**
 * Generates a unique class name with an optional prefix
 * @param {string} [prefix='ls'] - Prefix for the class name
 * @returns {string} Unique class name in format 'prefix-counter'
 * @example
 * generateClassName('grid'); // Returns 'ls-grid-1'
 * generateClassName('flex'); // Returns 'ls-flex-2'
 */
export function generateClassName(prefix = 'ls') {
  classCounter++;
  return `ls-${prefix}-${classCounter}`;
}

/**
 * Resets the class name counter (primarily for testing)
 * @returns {void}
 */
export function resetClassCounter() {
  classCounter = 0;
}

/**
 * Sanitizes a CSS value by ensuring proper units
 * Adds 'px' suffix to numeric values, passes strings through unchanged
 * @param {string|number} value - The value to sanitize
 * @returns {string} Sanitized CSS value with appropriate units
 * @example
 * sanitizeValue(16);      // Returns '16px'
 * sanitizeValue('2rem');  // Returns '2rem'
 * sanitizeValue('100%');  // Returns '100%'
 */
export function sanitizeValue(value) {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return String(value);
}

/**
 * Deep merges two objects, with source values overriding target values
 * Creates a new object without mutating the inputs
 * @param {Object} target - The base object with default values
 * @param {Object} source - The object with override values
 * @returns {Object} New merged object
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } });
 * // Returns { a: 1, b: { c: 2, d: 3 } }
 */
export function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isPlainObject(source[key]) && isPlainObject(target[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

/**
 * Checks if a value is a plain JavaScript object
 * Returns false for null, arrays, and other non-plain objects
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a plain object
 * @example
 * isPlainObject({});           // Returns true
 * isPlainObject({ a: 1 });     // Returns true
 * isPlainObject([]);           // Returns false
 * isPlainObject(null);         // Returns false
 * isPlainObject(new Date());   // Returns false
 */
export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Converts a camelCase string to kebab-case
 * Used for converting JavaScript property names to CSS property names
 * @param {string} str - The camelCase string to convert
 * @returns {string} The kebab-case version of the string
 * @example
 * camelToKebab('backgroundColor');  // Returns 'background-color'
 * camelToKebab('gridTemplateColumns'); // Returns 'grid-template-columns'
 */
export function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Debounces a function call
 * Delays invoking the function until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 * @example
 * const debouncedUpdate = debounce(() => updateLayout(), 100);
 * window.addEventListener('resize', debouncedUpdate);
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes at most once per wait period
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle
 * @returns {Function} The throttled function
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, wait) {
  let lastTime = 0;
  
  return function executedFunction(...args) {
    const now = Date.now();
    
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}
