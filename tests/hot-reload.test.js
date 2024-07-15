/**
 * Tests for hot-reload functionality
 */

import { createHotReload, watchConfig } from '../src/hot-reload.js';

// Mock DOM environment
const mockContainer = {
  classList: {
    add: jest.fn(),
    remove: jest.fn()
  },
  innerHTML: '',
  querySelector: jest.fn()
};

// Mock document
global.document = {
  querySelector: jest.fn(() => mockContainer),
  getElementById: jest.fn(() => null),
  head: {
    appendChild: jest.fn()
  },
  createElement: jest.fn(() => ({
    id: '',
    textContent: ''
  }))
};

// Mock preview module
jest.mock('../src/preview.js', () => ({
  createPreview: jest.fn(() => ({ id: 'mock-preview' })),
  destroyPreview: jest.fn()
}));

import { createPreview, destroyPreview } from '../src/preview.js';

describe('Hot Reload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('createHotReload', () => {
    test('creates preview with initial config', () => {
      const config = { type: 'grid', columns: 3 };
      const instance = createHotReload(config, mockContainer);
      
      expect(createPreview).toHaveBeenCalledWith(
        config,
        mockContainer,
        expect.objectContaining({ injectStyles: true })
      );
      
      instance.destroy();
    });
    
    test('throws error for missing container', () => {
      document.querySelector.mockReturnValueOnce(null);
      
      expect(() => {
        createHotReload({}, '#nonexistent');
      }).toThrow('Hot reload container not found');
    });
    
    test('debounces updates by default', () => {
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer);
      
      jest.clearAllMocks();
      
      // Rapid updates
      instance.update({ type: 'grid', columns: 2 });
      instance.update({ type: 'grid', columns: 3 });
      instance.update({ type: 'grid', columns: 4 });
      
      // Not applied yet
      expect(createPreview).not.toHaveBeenCalled();
      
      // After debounce delay
      jest.advanceTimersByTime(150);
      
      // Only last update applied
      expect(createPreview).toHaveBeenCalledTimes(1);
      expect(createPreview).toHaveBeenCalledWith(
        { type: 'grid', columns: 4 },
        mockContainer,
        expect.any(Object)
      );
      
      instance.destroy();
    });
    
    test('immediate update skips debounce', () => {
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer);
      
      jest.clearAllMocks();
      
      instance.update({ type: 'flex' }, true);
      
      expect(createPreview).toHaveBeenCalledTimes(1);
      
      instance.destroy();
    });
    
    test('skips update if config unchanged', () => {
      const config = { type: 'grid', columns: 3 };
      const instance = createHotReload(config, mockContainer);
      
      jest.clearAllMocks();
      
      // Same config
      instance.update({ type: 'grid', columns: 3 }, true);
      
      expect(createPreview).not.toHaveBeenCalled();
      
      instance.destroy();
    });
    
    test('pause stops updates', () => {
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer);
      
      jest.clearAllMocks();
      
      instance.pause();
      expect(instance.isPaused).toBe(true);
      
      instance.update({ type: 'flex' }, true);
      
      expect(createPreview).not.toHaveBeenCalled();
      
      instance.destroy();
    });
    
    test('resume allows updates again', () => {
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer);
      
      instance.pause();
      instance.resume();
      
      expect(instance.isPaused).toBe(false);
      
      jest.clearAllMocks();
      
      instance.update({ type: 'flex' }, true);
      
      expect(createPreview).toHaveBeenCalled();
      
      instance.destroy();
    });
    
    test('destroy cleans up preview', () => {
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer);
      
      instance.destroy();
      
      expect(destroyPreview).toHaveBeenCalled();
    });
    
    test('onUpdate callback fires after update', () => {
      const onUpdate = jest.fn();
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer, { onUpdate });
      
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          config: config,
          updateCount: 1
        })
      );
      
      instance.destroy();
    });
    
    test('onError callback fires on error', () => {
      createPreview.mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      
      const onError = jest.fn();
      const config = { type: 'grid' };
      
      createHotReload(config, mockContainer, { onError });
      
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
    
    test('tracks update count', () => {
      const config = { type: 'grid' };
      const instance = createHotReload(config, mockContainer);
      
      expect(instance.updateCount).toBe(1);
      
      instance.update({ type: 'flex' }, true);
      expect(instance.updateCount).toBe(2);
      
      instance.update({ type: 'grid', columns: 4 }, true);
      expect(instance.updateCount).toBe(3);
      
      instance.destroy();
    });
    
    test('provides current config copy', () => {
      const config = { type: 'grid', columns: 3 };
      const instance = createHotReload(config, mockContainer);
      
      const retrieved = instance.config;
      expect(retrieved).toEqual(config);
      expect(retrieved).not.toBe(config); // Should be a copy
      
      instance.destroy();
    });
  });
  
  describe('watchConfig', () => {
    test('creates reactive proxy', () => {
      const config = { type: 'grid' };
      const mockHotReload = {
        update: jest.fn()
      };
      
      const watched = watchConfig(config, mockHotReload);
      
      watched.columns = 4;
      
      expect(mockHotReload.update).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'grid', columns: 4 })
      );
    });
    
    test('triggers update on property delete', () => {
      const config = { type: 'grid', columns: 3 };
      const mockHotReload = {
        update: jest.fn()
      };
      
      const watched = watchConfig(config, mockHotReload);
      
      delete watched.columns;
      
      expect(mockHotReload.update).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'grid' })
      );
    });
  });
});