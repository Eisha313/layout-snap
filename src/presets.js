/**
 * Preset layout configurations for common patterns
 */

export const PRESETS = {
	/**
	 * Hero section with centered content
	 */
	heroSection: {
		type: 'grid',
		name: 'hero',
		columns: '1fr',
		rows: '1fr',
		minHeight: '60vh',
		padding: '2rem',
		alignItems: 'center',
		justifyItems: 'center',
		items: [
			{ content: '<h1>Hero Title</h1><p>Hero subtitle text</p>' }
		],
		responsive: {
			tablet: {
				minHeight: '50vh',
				padding: '1.5rem'
			},
			mobile: {
				minHeight: '40vh',
				padding: '1rem'
			}
		}
	},

	/**
	 * Feature grid with 3 columns
	 */
	featureGrid: {
		type: 'grid',
		name: 'features',
		columns: 'repeat(3, 1fr)',
		gap: '2rem',
		padding: '2rem',
		items: [
			{ content: '<h3>Feature 1</h3><p>Description</p>' },
			{ content: '<h3>Feature 2</h3><p>Description</p>' },
			{ content: '<h3>Feature 3</h3><p>Description</p>' }
		],
		responsive: {
			tablet: {
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: '1.5rem'
			},
			mobile: {
				gridTemplateColumns: '1fr',
				gap: '1rem'
			}
		}
	},

	/**
	 * Pricing table with 3 tiers
	 */
	pricingTable: {
		type: 'flex',
		name: 'pricing',
		direction: 'row',
		wrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'stretch',
		gap: '1.5rem',
		padding: '2rem',
		items: [
			{ flex: '1 1 300px', content: '<h3>Basic</h3><p class="price">$9/mo</p><ul><li>Feature A</li></ul>' },
			{ flex: '1 1 300px', content: '<h3>Pro</h3><p class="price">$29/mo</p><ul><li>Feature A</li><li>Feature B</li></ul>' },
			{ flex: '1 1 300px', content: '<h3>Enterprise</h3><p class="price">$99/mo</p><ul><li>All Features</li></ul>' }
		],
		responsive: {
			mobile: {
				flexDirection: 'column',
				gap: '1rem'
			}
		}
	},

	/**
	 * Two-column layout (content + sidebar)
	 */
	twoColumn: {
		type: 'grid',
		name: 'two-col',
		columns: '2fr 1fr',
		gap: '2rem',
		padding: '1rem',
		items: [
			{ content: '<main>Main Content</main>' },
			{ content: '<aside>Sidebar</aside>' }
		],
		responsive: {
			tablet: {
				gridTemplateColumns: '1fr',
				gap: '1rem'
			}
		}
	},

	/**
	 * Card grid with auto-fit responsive behavior
	 */
	cardGrid: {
		type: 'grid',
		name: 'cards',
		columns: 'repeat(auto-fit, minmax(280px, 1fr))',
		gap: '1.5rem',
		padding: '1rem',
		items: [
			{ content: '<article><h3>Card 1</h3><p>Card content</p></article>' },
			{ content: '<article><h3>Card 2</h3><p>Card content</p></article>' },
			{ content: '<article><h3>Card 3</h3><p>Card content</p></article>' },
			{ content: '<article><h3>Card 4</h3><p>Card content</p></article>' }
		]
	},

	/**
	 * Navigation bar layout
	 */
	navbar: {
		type: 'flex',
		name: 'navbar',
		direction: 'row',
		wrap: 'nowrap',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: '1rem',
		padding: '1rem 2rem',
		items: [
			{ flex: '0 0 auto', content: '<div class="logo">Logo</div>' },
			{ flex: '1 1 auto', content: '<nav>Links</nav>' },
			{ flex: '0 0 auto', content: '<div class="actions">Actions</div>' }
		],
		responsive: {
			mobile: {
				flexWrap: 'wrap',
				padding: '0.5rem 1rem'
			}
		}
	}
};