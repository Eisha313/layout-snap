import {
  isValidString,
  validateConfig,
  isValidBreakpoint,
  deepMerge,
  isPlainObject,
  generateId,
  toKebabCase,
  sanitizeCSSValue
} from '../src/utils.js';

describe('Utils', () => {
  describe('isValidString', () => {
    test('returns true for valid strings', () => {
      expect(isValidString('hello')).toBe(true);
      expect(isValidString('  test  ')).toBe(true);
    });

    test('returns false for invalid strings', () => {
      expect(isValidString('')).toBe(false);
      expect(isValidString('   ')).toBe(false);
      expect(isValidString(null)).toBe(false);
      expect(isValidString(123)).toBe(false);
    });
  });

  describe('validateConfig', () => {
    test('returns validated config with defaults', () => {
      const config = validateConfig({});
      expect(config.type).toBe('grid');
      expect(config.columns).toBe(12);
      expect(config.gap).toBe('1rem');
    });

    test('throws error for null config', () => {
      expect(() => validateConfig(null)).toThrow('Configuration must be a non-null object');
    });

    test('throws error for invalid type', () => {
      expect(() => validateConfig({ type: 'invalid' })).toThrow('Invalid layout type');
    });

    test('preserves custom config values', () => {
      const config = validateConfig({ columns: 6, gap: '2rem' });
      expect(config.columns).toBe(6);
      expect(config.gap).toBe('2rem');
    });
  });

  describe('isValidBreakpoint', () => {
    test('returns true for valid breakpoints', () => {
      expect(isValidBreakpoint({ min: 768 })).toBe(true);
      expect(isValidBreakpoint({ max: 1024 })).toBe(true);
      expect(isValidBreakpoint({ min: 768, max: 1024 })).toBe(true);
    });

    test('returns false for invalid breakpoints', () => {
      expect(isValidBreakpoint(null)).toBe(false);
      expect(isValidBreakpoint({})).toBe(false);
      expect(isValidBreakpoint({ name: 'mobile' })).toBe(false);
    });
  });

  describe('deepMerge', () => {
    test('merges simple objects', () => {
      const result = deepMerge({ a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    test('merges nested objects', () => {
      const result = deepMerge(
        { a: { b: 1, c: 2 } },
        { a: { c: 3, d: 4 } }
      );
      expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } });
    });

    test('overwrites arrays', () => {
      const result = deepMerge({ a: [1, 2] }, { a: [3, 4] });
      expect(result).toEqual({ a: [3, 4] });
    });
  });

  describe('isPlainObject', () => {
    test('returns true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
    });

    test('returns false for non-plain objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
    });
  });

  describe('generateId', () => {
    test('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    test('uses custom prefix', () => {
      const id = generateId('custom');
      expect(id.startsWith('custom-')).toBe(true);
    });
  });

  describe('toKebabCase', () => {
    test('converts camelCase to kebab-case', () => {
      expect(toKebabCase('backgroundColor')).toBe('background-color');
      expect(toKebabCase('fontSize')).toBe('font-size');
      expect(toKebabCase('borderTopLeftRadius')).toBe('border-top-left-radius');
    });

    test('handles already kebab-case strings', () => {
      expect(toKebabCase('background-color')).toBe('background-color');
    });
  });

  describe('sanitizeCSSValue', () => {
    test('returns string values unchanged', () => {
      expect(sanitizeCSSValue('1rem')).toBe('1rem');
      expect(sanitizeCSSValue('#fff')).toBe('#fff');
    });

    test('removes dangerous characters', () => {
      expect(sanitizeCSSValue('url(;alert())')).toBe('url(alert())');
      expect(sanitizeCSSValue('value<script>')).toBe('valuescript');
    });

    test('converts non-strings', () => {
      expect(sanitizeCSSValue(123)).toBe('123');
    });
  });
});
