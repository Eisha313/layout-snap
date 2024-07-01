/**
 * Live preview mode with hot-reload support
 */

import { generateGridCSS, generateFlexboxCSS } from './generators.js';
import { injectBreakpoints } from './breakpoints.js';

class LivePreview {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('LivePreview: Invalid container element');
    }

    this.options = {
      debounceMs: 100,
      showOutlines: false,
      injectStyles: true,
      ...options
    };

    this.styleElement = null;
    this.currentConfig = null;
    this.debounceTimer = null;
    this.isDestroyed = false;

    this._init();
  }

  _init() {
    // Create style element for injecting CSS
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'layout-snap-preview-' + Date.now();
    document.head.appendChild(this.styleElement);

    // Add preview class to container
    this.container.classList.add('layout-snap-preview');

    if (this.options.showOutlines) {
      this._addOutlineStyles();
    }
  }

  _addOutlineStyles() {
    const outlineStyle = document.createElement('style');
    outlineStyle.id = 'layout-snap-outlines';
    outlineStyle.textContent = `
      .layout-snap-preview * {
        outline: 1px dashed rgba(0, 150, 255, 0.3);
      }
      .layout-snap-preview > * {
        outline: 2px solid rgba(0, 150, 255, 0.5);
      }
    `;
    document.head.appendChild(outlineStyle);
    this.outlineStyleElement = outlineStyle;
  }

  render(config) {
    if (this.isDestroyed) {
      throw new Error('LivePreview: Instance has been destroyed');
    }

    this.currentConfig = config;
    
    // Generate CSS based on layout type
    let css = '';
    const selector = `#${this.container.id || 'layout-snap-preview'}`;

    if (!this.container.id) {
      this.container.id = 'layout-snap-preview-' + Date.now();
    }

    const configWithSelector = { ...config, selector };

    if (config.type === 'grid' || config.columns || config.rows) {
      css = generateGridCSS(configWithSelector);
    } else if (config.type === 'flex' || config.direction) {
      css = generateFlexboxCSS(configWithSelector);
    } else {
      // Default to grid
      css = generateGridCSS(configWithSelector);
    }

    // Add responsive breakpoints if specified
    if (config.breakpoints || config.responsive) {
      css = injectBreakpoints(css, configWithSelector);
    }

    // Inject the CSS
    if (this.options.injectStyles) {
      this.styleElement.textContent = css;
    }

    // Generate placeholder children if requested
    if (config.generatePlaceholders && config.items) {
      this._generatePlaceholders(config.items);
    }

    return css;
  }

  update(configUpdates) {
    if (!this.currentConfig) {
      return this.render(configUpdates);
    }

    const newConfig = { ...this.currentConfig, ...configUpdates };
    return this.render(newConfig);
  }

  hotReload(config) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.render(config);
      this._emitEvent('reload', { config });
    }, this.options.debounceMs);
  }

  _generatePlaceholders(itemCount) {
    this.container.innerHTML = '';
    
    for (let i = 0; i < itemCount; i++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'layout-snap-placeholder';
      placeholder.textContent = `Item ${i + 1}`;
      placeholder.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, sans-serif;
        border-radius: 4px;
        min-height: 60px;
      `;
      this.container.appendChild(placeholder);
    }
  }

  _emitEvent(eventName, detail) {
    const event = new CustomEvent(`layoutsnap:${eventName}`, {
      detail,
      bubbles: true
    });
    this.container.dispatchEvent(event);
  }

  getCSS() {
    return this.styleElement ? this.styleElement.textContent : '';
  }

  getConfig() {
    return this.currentConfig ? { ...this.currentConfig } : null;
  }

  toggleOutlines(show) {
    if (show && !this.outlineStyleElement) {
      this._addOutlineStyles();
    } else if (!show && this.outlineStyleElement) {
      this.outlineStyleElement.remove();
      this.outlineStyleElement = null;
    }
  }

  destroy() {
    if (this.isDestroyed) return;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (this.styleElement) {
      this.styleElement.remove();
    }

    if (this.outlineStyleElement) {
      this.outlineStyleElement.remove();
    }

    this.container.classList.remove('layout-snap-preview');
    this.isDestroyed = true;
    this._emitEvent('destroy', {});
  }
}

/**
 * Create a live preview instance
 */
export function createPreview(container, options) {
  return new LivePreview(container, options);
}

/**
 * Quick preview - renders immediately without creating persistent instance
 */
export function quickPreview(container, config) {
  const preview = new LivePreview(container, { injectStyles: true });
  const css = preview.render(config);
  return {
    css,
    destroy: () => preview.destroy()
  };
}

export { LivePreview };
