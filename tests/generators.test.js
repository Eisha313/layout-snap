const { generateGridCSS, generateFlexCSS } = require('../src/generators');

describe('generateGridCSS', () => {
  it('should generate basic grid CSS with columns', () => {
    const config = {
      columns: 3,
      gap: '1rem'
    };
    const result = generateGridCSS(config);
    
    expect(result).toContain('display: grid');
    expect(result).toContain('grid-template-columns: repeat(3, 1fr)');
    expect(result).toContain('gap: 1rem');
  });

  it('should handle custom column template', () => {
    const config = {
      columns: '1fr 2fr 1fr',
      gap: '20px'
    };
    const result = generateGridCSS(config);
    
    expect(result).toContain('grid-template-columns: 1fr 2fr 1fr');
  });

  it('should include rows when specified', () => {
    const config = {
      columns: 2,
      rows: 'auto 1fr auto',
      gap: '1rem'
    };
    const result = generateGridCSS(config);
    
    expect(result).toContain('grid-template-rows: auto 1fr auto');
  });

  it('should handle areas configuration', () => {
    const config = {
      columns: 3,
      areas: [
        'header header header',
        'sidebar main main',
        'footer footer footer'
      ]
    };
    const result = generateGridCSS(config);
    
    expect(result).toContain('grid-template-areas');
    expect(result).toContain('header header header');
  });
});

describe('generateFlexCSS', () => {
  it('should generate basic flex CSS', () => {
    const config = {
      direction: 'row',
      gap: '1rem'
    };
    const result = generateFlexCSS(config);
    
    expect(result).toContain('display: flex');
    expect(result).toContain('flex-direction: row');
    expect(result).toContain('gap: 1rem');
  });

  it('should handle justify and align options', () => {
    const config = {
      direction: 'column',
      justify: 'center',
      align: 'stretch'
    };
    const result = generateFlexCSS(config);
    
    expect(result).toContain('justify-content: center');
    expect(result).toContain('align-items: stretch');
  });

  it('should include wrap when specified', () => {
    const config = {
      direction: 'row',
      wrap: 'wrap'
    };
    const result = generateFlexCSS(config);
    
    expect(result).toContain('flex-wrap: wrap');
  });
});
