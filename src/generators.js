/**
 * CSS generators for Grid and Flexbox layouts
 */

/**
 * Generate CSS Grid styles from configuration
 * @param {string} className - Base class name
 * @param {Object} config - Grid configuration
 * @param {Object} breakpoints - Responsive breakpoints
 * @returns {string} Generated CSS
 */
export function generateGridCSS(className, config, breakpoints) {
	const {
		columns = 'repeat(12, 1fr)',
		rows = 'auto',
		gap = '1rem',
		alignItems = 'stretch',
		justifyItems = 'stretch',
		minHeight,
		padding,
		areas
	} = config;

	let css = `.${className} {
	display: grid;
	grid-template-columns: ${columns};
	grid-template-rows: ${rows};
	gap: ${gap};
	align-items: ${alignItems};
	justify-items: ${justifyItems};`;

	if (minHeight) css += `\n\tmin-height: ${minHeight};`;
	if (padding) css += `\n\tpadding: ${padding};`;
	if (areas) css += `\n\tgrid-template-areas: ${areas};`;
	
	css += '\n}\n';

	// Generate item styles
	css += `.${className}-item {
	box-sizing: border-box;
}\n`;

	return css;
}

/**
 * Generate Flexbox styles from configuration
 * @param {string} className - Base class name
 * @param {Object} config - Flex configuration
 * @param {Object} breakpoints - Responsive breakpoints
 * @returns {string} Generated CSS
 */
export function generateFlexCSS(className, config, breakpoints) {
	const {
		direction = 'row',
		wrap = 'wrap',
		justifyContent = 'flex-start',
		alignItems = 'stretch',
		gap = '1rem',
		minHeight,
		padding
	} = config;

	let css = `.${className} {
	display: flex;
	flex-direction: ${direction};
	flex-wrap: ${wrap};
	justify-content: ${justifyContent};
	align-items: ${alignItems};
	gap: ${gap};`;

	if (minHeight) css += `\n\tmin-height: ${minHeight};`;
	if (padding) css += `\n\tpadding: ${padding};`;
	
	css += '\n}\n';

	// Generate item styles
	css += `.${className}-item {
	box-sizing: border-box;
	flex: 0 1 auto;
}\n`;

	return css;
}

/**
 * Generate auto-responsive grid that adapts to container width
 * @param {string} className - Base class name
 * @param {Object} config - Configuration with minItemWidth
 * @returns {string} Generated CSS
 */
export function generateAutoResponsiveGrid(className, config) {
	const { minItemWidth = '250px', gap = '1rem' } = config;

	return `.${className} {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${minItemWidth}, 1fr));
	gap: ${gap};
}\n`;
}