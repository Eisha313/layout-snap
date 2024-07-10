const {
  DEFAULT_BREAKPOINTS,
  validateBreakpoints,
  mergeBreakpoints,
  sortBreakpoints,
  generateMediaQuery,
  generateResponsiveCSS,
  getActiveBreakpoint
} = require('../src/breakpoints');

describe('Breakpoints', () => {
  describe('validateBreakpoints', () => {
    test('returns true for valid breakpoints', () => {
      expect(validateBreakpoints({ sm: 576, md: 768 })).toBe(true);
    });

    test('returns false for null', () => {
      expect(validateBreakpoints(null)).toBe(false);
    });

    test('returns false for non-object', () => {
      expect(validateBreakpoints('invalid')).toBe(false);
    });

    test('returns false for negative values', () => {
      expect(validateBreakpoints({ sm: -100 })).toBe(false);
    });

    test('returns false for non-numeric values', () => {
      expect(validateBreakpoints({ sm: '576px' })).toBe(false);
    });

    test('returns false for Infinity values', () => {
      expect(validateBreakpoints({ sm: Infinity })).toBe(false);
    });
  });

  describe('mergeBreakpoints', () => {
    test('returns defaults when no custom provided', () => {
      expect(mergeBreakpoints()).toEqual(DEFAULT_BREAKPOINTS);
    });

    test('merges custom breakpoints with defaults', () => {
      const result = mergeBreakpoints({ custom: 1000 });
      expect(result.custom).toBe(1000);
      expect(result.sm).toBe(576);
    });

    test('overrides default breakpoints', () => {
      const result = mergeBreakpoints({ sm: 600 });
      expect(result.sm).toBe(600);
    });

    test('returns defaults for invalid custom breakpoints', () => {
      expect(mergeBreakpoints({ sm: 'invalid' })).toEqual(DEFAULT_BREAKPOINTS);
    });
  });

  describe('sortBreakpoints', () => {
    test('sorts breakpoints in ascending order', () => {
      const breakpoints = { lg: 992, sm: 576, md: 768 };
      const sorted = sortBreakpoints(breakpoints);
      expect(sorted).toEqual([
        ['sm', 576],
        ['md', 768],
        ['lg', 992]
      ]);
    });

    test('handles breakpoints starting from 0', () => {
      const breakpoints = { xs: 0, sm: 576 };
      const sorted = sortBreakpoints(breakpoints);
      expect(sorted[0]).toEqual(['xs', 0]);
    });

    test('filters out invalid values', () => {
      const breakpoints = { sm: 576, invalid: 'bad', md: 768 };
      const sorted = sortBreakpoints(breakpoints);
      expect(sorted.length).toBe(2);
    });

    test('filters out Infinity values', () => {
      const breakpoints = { sm: 576, inf: Infinity };
      const sorted = sortBreakpoints(breakpoints);
      expect(sorted.length).toBe(1);
    });
  });

  describe('generateMediaQuery', () => {
    test('returns empty string for base styles (0, null)', () => {
      expect(generateMediaQuery(0, null)).toBe('');
    });

    test('generates min-width query', () => {
      expect(generateMediaQuery(768)).toBe('@media (min-width: 768px)');
    });

    test('generates max-width query for 0 min-width', () => {
      expect(generateMediaQuery(0, 768)).toBe('@media (max-width: 767.98px)');
    });

    test('generates range query', () => {
      expect(generateMediaQuery(576, 768)).toBe('@media (min-width: 576px) and (max-width: 767.98px)');
    });
  });

  describe('generateResponsiveCSS', () => {
    const mockGenerator = (config) => {
      if (!config) return '';
      return `.test { columns: ${config.columns || 1}; }`;
    };

    test('generates base CSS without media query', () => {
      const config = { base: { columns: 2 } };
      const css = generateResponsiveCSS(config, mockGenerator);
      expect(css).toContain('.test { columns: 2; }');
      expect(css).not.toContain('@media');
    });

    test('generates responsive CSS in correct order', () => {
      const config = {
        base: { columns: 1 },
        responsive: {
          lg: { columns: 4 },
          sm: { columns: 2 },
          md: { columns: 3 }
        }
      };
      const css = generateResponsiveCSS(config, mockGenerator);
      
      const smIndex = css.indexOf('576px');
      const mdIndex = css.indexOf('768px');
      const lgIndex = css.indexOf('992px');
      
      expect(smIndex).toBeLessThan(mdIndex);
      expect(mdIndex).toBeLessThan(lgIndex);
    });

    test('skips unknown breakpoints', () => {
      const config = {
        base: { columns: 1 },
        responsive: {
          unknown: { columns: 5 }
        }
      };
      const css = generateResponsiveCSS(config, mockGenerator);
      expect(css).not.toContain('columns: 5');
    });

    test('uses config directly if no base property', () => {
      const config = { columns: 2 };
      const css = generateResponsiveCSS(config, mockGenerator);
      expect(css).toContain('.test { columns: 2; }');
    });
  });

  describe('getActiveBreakpoint', () => {
    test('returns xs for width 0', () => {
      expect(getActiveBreakpoint(0)).toBe('xs');
    });

    test('returns correct breakpoint for various widths', () => {
      expect(getActiveBreakpoint(400)).toBe('xs');
      expect(getActiveBreakpoint(600)).toBe('sm');
      expect(getActiveBreakpoint(800)).toBe('md');
      expect(getActiveBreakpoint(1000)).toBe('lg');
      expect(getActiveBreakpoint(1300)).toBe('xl');
      expect(getActiveBreakpoint(1500)).toBe('xxl');
    });

    test('returns exact breakpoint at boundary', () => {
      expect(getActiveBreakpoint(576)).toBe('sm');
      expect(getActiveBreakpoint(768)).toBe('md');
    });

    test('returns xs for invalid width', () => {
      expect(getActiveBreakpoint(-100)).toBe('xs');
      expect(getActiveBreakpoint('invalid')).toBe('xs');
      expect(getActiveBreakpoint(Infinity)).toBe('xs');
    });

    test('uses custom breakpoints', () => {
      expect(getActiveBreakpoint(500, { mobile: 0, tablet: 600 })).toBe('mobile');
      expect(getActiveBreakpoint(700, { mobile: 0, tablet: 600 })).toBe('tablet');
    });
  });
});