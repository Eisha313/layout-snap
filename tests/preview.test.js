/**
 * Tests for live preview functionality
 */

import { LivePreview, createPreview, quickPreview } from '../src/preview.js';

// Mock DOM environment
const createMockContainer = () => {
  const container = {
    id: 'test-container',
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    },
    innerHTML: '',
    appendChild: jest.fn(),
    dispatchEvent: jest.fn()
  };
  return container;
};

const createMockDocument = () => {
  const styles = [];
  return {
    querySelector: jest.fn(() => createMockContainer()),
    createElement: jest.fn((tag) => ({
      id: '',
      textContent: '',
      remove: jest.fn(),
      style: { cssText: '' },
      className: ''
    })),
    head: {
      appendChild: jest.fn((style) => styles.push(style))
    }
  };
};

// Setup global mocks
global.document = createMockDocument();
global.CustomEvent = class CustomEvent {
  constructor(name, options) {
    this.name = name;
    this.detail = options?.detail;
    this.bubbles = options?.bubbles;
  }
};

describe('LivePreview', () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = createMockContainer();
    global.document = createMockDocument();
    global.document.querySelector = jest.fn(() => mockContainer);
  });

  describe('constructor', () => {
    test('should accept a container element', () => {
      const preview = new LivePreview(mockContainer);
      expect(preview.container).toBe(mockContainer);
    });

    test('should accept a selector string', () => {
      const preview = new LivePreview('#test-container');
      expect(document.querySelector).toHaveBeenCalledWith('#test-container');
    });

    test('should throw error for invalid container', () => {
      global.document.querySelector = jest.fn(() => null);
      expect(() => new LivePreview('#invalid')).toThrow('Invalid container element');
    });

    test('should apply default options', () => {
      const preview = new LivePreview(mockContainer);
      expect(preview.options.debounceMs).toBe(100);
      expect(preview.options.showOutlines).toBe(false);
      expect(preview.options.injectStyles).toBe(true);
    });

    test('should merge custom options', () => {
      const preview = new LivePreview(mockContainer, { debounceMs: 200 });
      expect(preview.options.debounceMs).toBe(200);
    });
  });

  describe('render', () => {
    test('should generate grid CSS for grid config', () => {
      const preview = new LivePreview(mockContainer);
      const css = preview.render({
        type: 'grid',
        columns: 3,
        gap: '10px'
      });
      expect(css).toContain('display: grid');
    });

    test('should generate flex CSS for flex config', () => {
      const preview = new LivePreview(mockContainer);
      const css = preview.render({
        type: 'flex',
        direction: 'row',
        gap: '10px'
      });
      expect(css).toContain('display: flex');
    });

    test('should store current config', () => {
      const preview = new LivePreview(mockContainer);
      const config = { columns: 3 };
      preview.render(config);
      expect(preview.currentConfig).toEqual(expect.objectContaining({ columns: 3 }));
    });

    test('should throw if instance is destroyed', () => {
      const preview = new LivePreview(mockContainer);
      preview.destroy();
      expect(() => preview.render({ columns: 3 })).toThrow('destroyed');
    });
  });

  describe('update', () => {
    test('should merge config updates', () => {
      const preview = new LivePreview(mockContainer);
      preview.render({ columns: 3, gap: '10px' });
      preview.update({ gap: '20px' });
      expect(preview.currentConfig.columns).toBe(3);
      expect(preview.currentConfig.gap).toBe('20px');
    });

    test('should call render if no current config', () => {
      const preview = new LivePreview(mockContainer);
      const renderSpy = jest.spyOn(preview, 'render');
      preview.update({ columns: 3 });
      expect(renderSpy).toHaveBeenCalled();
    });
  });

  describe('hotReload', () => {
    jest.useFakeTimers();

    test('should debounce render calls', () => {
      const preview = new LivePreview(mockContainer, { debounceMs: 100 });
      const renderSpy = jest.spyOn(preview, 'render');

      preview.hotReload({ columns: 3 });
      preview.hotReload({ columns: 4 });
      preview.hotReload({ columns: 5 });

      expect(renderSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(renderSpy).toHaveBeenCalledWith({ columns: 5 });
    });
  });

  describe('getCSS', () => {
    test('should return current CSS', () => {
      const preview = new LivePreview(mockContainer);
      preview.render({ columns: 3 });
      const css = preview.getCSS();
      expect(typeof css).toBe('string');
    });
  });

  describe('getConfig', () => {
    test('should return copy of current config', () => {
      const preview = new LivePreview(mockContainer);
      preview.render({ columns: 3 });
      const config = preview.getConfig();
      expect(config.columns).toBe(3);
      config.columns = 5;
      expect(preview.currentConfig.columns).toBe(3);
    });

    test('should return null if no config', () => {
      const preview = new LivePreview(mockContainer);
      expect(preview.getConfig()).toBeNull();
    });
  });

  describe('destroy', () => {
    test('should clean up resources', () => {
      const preview = new LivePreview(mockContainer);
      preview.render({ columns: 3 });
      preview.destroy();
      expect(preview.isDestroyed).toBe(true);
    });

    test('should not destroy twice', () => {
      const preview = new LivePreview(mockContainer);
      preview.destroy();
      preview.destroy(); // Should not throw
      expect(preview.isDestroyed).toBe(true);
    });
  });
});

describe('createPreview', () => {
  test('should return LivePreview instance', () => {
    const mockContainer = createMockContainer();
    global.document.querySelector = jest.fn(() => mockContainer);
    const preview = createPreview('#container');
    expect(preview).toBeInstanceOf(LivePreview);
  });
});

describe('quickPreview', () => {
  test('should return css and destroy function', () => {
    const mockContainer = createMockContainer();
    global.document.querySelector = jest.fn(() => mockContainer);
    const result = quickPreview('#container', { columns: 3 });
    expect(result).toHaveProperty('css');
    expect(result).toHaveProperty('destroy');
    expect(typeof result.destroy).toBe('function');
  });
});
