/**
 * Hot-reload support for live preview mode
 * Watches configuration changes and updates layouts in real-time
 */

import { createPreview, destroyPreview } from './preview.js';

/**
 * @typedef {Object} HotReloadInstance
 * @property {Function} update - Update configuration
 * @property {Function} destroy - Stop watching and cleanup
 * @property {Function} pause - Pause updates
 * @property {Function} resume - Resume updates
 * @property {boolean} isPaused - Whether updates are paused
 */

/**
 * @typedef {Object} HotReloadOptions
 * @property {number} [debounceMs=100] - Debounce delay for updates
 * @property {boolean} [animateChanges=true] - Animate layout transitions
 * @property {Function} [onUpdate] - Callback after each update
 * @property {Function} [onError] - Callback on error
 */

const DEFAULT_OPTIONS = {
  debounceMs: 100,
  animateChanges: true,
  onUpdate: null,
  onError: null
};

/**
 * Simple debounce utility
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(fn, ms) {
  let timeoutId = null;
  
  const debounced = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, ms);
  };
  
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}

/**
 * Deep compare two objects for equality
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} - Whether values are deeply equal
 */
function deepEqual(a, b) {
  if (a === b) return true;
  
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Add transition styles for smooth layout changes
 * @param {HTMLElement} container - Target container
 */
function addTransitionStyles(container) {
  const styleId = 'layout-snap-transitions';
  
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .layout-snap-animate * {
      transition: all 0.3s ease-out;
    }
    .layout-snap-animate {
      transition: all 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Remove transition styles
 */
function removeTransitionStyles() {
  const style = document.getElementById('layout-snap-transitions');
  if (style) {
    style.remove();
  }
}

/**
 * Create a hot-reloadable preview instance
 * @param {Object} initialConfig - Initial layout configuration
 * @param {HTMLElement|string} container - Target container or selector
 * @param {HotReloadOptions} [options={}] - Hot reload options
 * @returns {HotReloadInstance} - Hot reload controller
 */
export function createHotReload(initialConfig, container, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let currentConfig = { ...initialConfig };
  let previewInstance = null;
  let isPaused = false;
  let isDestroyed = false;
  let updateCount = 0;
  
  // Resolve container
  const targetContainer = typeof container === 'string'
    ? document.querySelector(container)
    : container;
  
  if (!targetContainer) {
    throw new Error('Hot reload container not found');
  }
  
  // Add transition styles if animations enabled
  if (opts.animateChanges) {
    addTransitionStyles(targetContainer);
    targetContainer.classList.add('layout-snap-animate');
  }
  
  /**
   * Apply configuration update
   * @param {Object} newConfig - New configuration
   */
  const applyUpdate = (newConfig) => {
    if (isDestroyed || isPaused) return;
    
    try {
      // Destroy existing preview if any
      if (previewInstance) {
        destroyPreview(previewInstance);
      }
      
      // Create new preview with updated config
      previewInstance = createPreview(newConfig, targetContainer, {
        injectStyles: true,
        generateContent: true
      });
      
      currentConfig = { ...newConfig };
      updateCount++;
      
      if (opts.onUpdate) {
        opts.onUpdate({
          config: currentConfig,
          updateCount,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      if (opts.onError) {
        opts.onError(error);
      } else {
        console.error('[layout-snap] Hot reload error:', error);
      }
    }
  };
  
  // Create debounced update function
  const debouncedUpdate = debounce(applyUpdate, opts.debounceMs);
  
  // Apply initial configuration
  applyUpdate(initialConfig);
  
  return {
    /**
     * Update configuration (triggers re-render)
     * @param {Object} newConfig - New configuration object
     * @param {boolean} [immediate=false] - Skip debounce
     */
    update(newConfig, immediate = false) {
      if (isDestroyed) {
        console.warn('[layout-snap] Cannot update destroyed hot reload instance');
        return;
      }
      
      // Skip if config hasn't changed
      if (deepEqual(currentConfig, newConfig)) {
        return;
      }
      
      if (immediate) {
        debouncedUpdate.cancel();
        applyUpdate(newConfig);
      } else {
        debouncedUpdate(newConfig);
      }
    },
    
    /**
     * Destroy hot reload instance and cleanup
     */
    destroy() {
      if (isDestroyed) return;
      
      isDestroyed = true;
      debouncedUpdate.cancel();
      
      if (previewInstance) {
        destroyPreview(previewInstance);
        previewInstance = null;
      }
      
      if (opts.animateChanges) {
        targetContainer.classList.remove('layout-snap-animate');
      }
    },
    
    /**
     * Pause updates (config changes will be ignored)
     */
    pause() {
      isPaused = true;
      debouncedUpdate.cancel();
    },
    
    /**
     * Resume updates
     */
    resume() {
      isPaused = false;
    },
    
    /**
     * Get current pause state
     */
    get isPaused() {
      return isPaused;
    },
    
    /**
     * Get current configuration
     */
    get config() {
      return { ...currentConfig };
    },
    
    /**
     * Get update count
     */
    get updateCount() {
      return updateCount;
    }
  };
}

/**
 * Create a configuration watcher that triggers updates
 * @param {Object} configObject - Object to watch for changes
 * @param {HotReloadInstance} hotReload - Hot reload instance to update
 * @returns {Object} - Proxy object that triggers updates on change
 */
export function watchConfig(configObject, hotReload) {
  const handler = {
    set(target, property, value) {
      target[property] = value;
      hotReload.update({ ...target });
      return true;
    },
    
    deleteProperty(target, property) {
      delete target[property];
      hotReload.update({ ...target });
      return true;
    }
  };
  
  return new Proxy({ ...configObject }, handler);
}

export default {
  createHotReload,
  watchConfig
};