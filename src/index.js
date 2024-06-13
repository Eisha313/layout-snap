/**
 * layout-snap: Responsive CSS Grid/Flexbox layout generator
 * Generates clean HTML and CSS from simple configuration objects
 */

import { generateGridCSS, generateFlexCSS } from './generators.js';
import { PRESETS } from './presets.js';

// Default responsive breakpoints
const DEFAULT_BREAKPOINTS = {
	mobile: 480,
	tablet: 768,
	desktop: 1024,
	wide: 1440
};

/**
 * Main LayoutSnap class for generating responsive layouts
 */
export class LayoutSnap {
	constructor(options = {}) {
		this.breakpoints = { ...DEFAULT_BREAKPOINTS, ...options.breakpoints };
		this.prefix = options.prefix || 'ls';
		this.hotReload = options.hotReload || false;
		this.styleElement = null;
	}

	/**
	 * Generate layout from configuration object
	 * @param {Object} config - Layout configuration
	 * @returns {Object} Generated HTML and CSS
	 */
	generate(config) {
		const { type = 'grid', preset, columns, rows, gap, items, responsive } = config;
		
		// Merge preset with custom config if specified
		const finalConfig = preset && PRESETS[preset] 
			? { ...PRESETS[preset], ...config }
			: config;

		const className = `${this.prefix}-${finalConfig.name || 'layout'}-${Date.now()}`;
		
		let css, html;
		
		if (type === 'grid') {
			css = generateGridCSS(className, finalConfig, this.breakpoints);
			html = this._generateGridHTML(className, finalConfig.items || []);
		} else {
			css = generateFlexCSS(className, finalConfig, this.breakpoints);
			html = this._generateFlexHTML(className, finalConfig.items || []);
		}

		// Inject responsive media queries
		if (responsive) {
			css += this._generateMediaQueries(className, responsive);
		}

		return { html, css, className };
	}

	/**
	 * Render layout directly into a target container
	 * @param {Object} config - Layout configuration
	 * @param {HTMLElement|string} target - Target container or selector
	 */
	render(config, target) {
		const container = typeof target === 'string' 
			? document.querySelector(target) 
			: target;

		if (!container) {
			throw new Error('Target container not found');
		}

		const { html, css, className } = this.generate(config);

		// Inject or update styles
		this._injectStyles(css, className);
		
		// Render HTML
		container.innerHTML = html;

		// Setup hot reload if enabled
		if (this.hotReload) {
			this._setupHotReload(config, container);
		}

		return { className, container };
	}

	/**
	 * Generate HTML for grid layout
	 */
	_generateGridHTML(className, items) {
		const itemsHTML = items.map((item, index) => {
			const itemClass = `${className}-item`;
			const style = item.gridArea ? `grid-area: ${item.gridArea};` : '';
			return `<div class="${itemClass}" style="${style}">${item.content || `Item ${index + 1}`}</div>`;
		}).join('\n\t\t');

		return `<div class="${className}">\n\t\t${itemsHTML}\n\t</div>`;
	}

	/**
	 * Generate HTML for flex layout
	 */
	_generateFlexHTML(className, items) {
		const itemsHTML = items.map((item, index) => {
			const itemClass = `${className}-item`;
			const style = item.flex ? `flex: ${item.flex};` : '';
			return `<div class="${itemClass}" style="${style}">${item.content || `Item ${index + 1}`}</div>`;
		}).join('\n\t\t');

		return `<div class="${className}">\n\t\t${itemsHTML}\n\t</div>`;
	}

	/**
	 * Generate responsive media queries
	 */
	_generateMediaQueries(className, responsive) {
		let mediaCSS = '';
		
		for (const [breakpoint, styles] of Object.entries(responsive)) {
			const maxWidth = this.breakpoints[breakpoint];
			if (maxWidth) {
				const rules = Object.entries(styles)
					.map(([prop, val]) => `\t\t${this._camelToKebab(prop)}: ${val};`)
					.join('\n');
				
				mediaCSS += `\n@media (max-width: ${maxWidth}px) {\n\t.${className} {\n${rules}\n\t}\n}`;
			}
		}
		
		return mediaCSS;
	}

	/**
	 * Inject styles into document head
	 */
	_injectStyles(css, className) {
		if (typeof document === 'undefined') return;

		// Remove existing style for this layout
		const existingStyle = document.getElementById(`ls-style-${className}`);
		if (existingStyle) {
			existingStyle.remove();
		}

		const style = document.createElement('style');
		style.id = `ls-style-${className}`;
		style.textContent = css;
		document.head.appendChild(style);
		this.styleElement = style;
	}

	/**
	 * Setup hot reload for live preview
	 */
	_setupHotReload(config, container) {
		this._currentConfig = config;
		this._currentContainer = container;
	}

	/**
	 * Update layout with new configuration (for hot reload)
	 */
	update(newConfig) {
		if (!this._currentContainer) {
			throw new Error('No active render session. Call render() first.');
		}
		
		const mergedConfig = { ...this._currentConfig, ...newConfig };
		return this.render(mergedConfig, this._currentContainer);
	}

	/**
	 * Convert camelCase to kebab-case
	 */
	_camelToKebab(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
}

// Factory function for quick usage
export function createLayout(config, options = {}) {
	const snap = new LayoutSnap(options);
	return snap.generate(config);
}

export { PRESETS } from './presets.js';
export default LayoutSnap;