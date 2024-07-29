# Contributing to Layout Snap

Thank you for your interest in contributing to Layout Snap! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search the issue tracker to see if the bug has already been reported
2. **Create a new issue** - If not found, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected behavior vs actual behavior
   - Your environment (Node version, browser, OS)
   - Code samples or screenshots if applicable

### Suggesting Features

1. **Check existing issues** - Your feature might already be requested
2. **Create a feature request** - Include:
   - Clear description of the feature
   - Use case and motivation
   - Proposed API or configuration (if applicable)
   - Any alternatives you've considered

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** for any new functionality
5. **Run tests**: `npm test`
6. **Run linting**: `npm run lint`
7. **Update documentation** if needed
8. **Submit a pull request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/layout-snap.git
cd layout-snap

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Lint code
npm run lint
```

## Coding Standards

### JavaScript Style

- Use ES6+ features (arrow functions, destructuring, template literals)
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public APIs

### File Organization

```
src/
  index.js        # Main entry point, exports public API
  generators.js   # Core layout generation functions
  presets.js      # Preset layout patterns
  breakpoints.js  # Responsive breakpoint utilities
  preview.js      # Live preview functionality
  hot-reload.js   # Hot reload support
  utils.js        # Shared utility functions

tests/
  *.test.js       # Test files mirror src/ structure

docs/
  API.md          # API documentation
  EXAMPLES.md     # Usage examples
```

### Testing Guidelines

- Write tests for all new functionality
- Test both success cases and error handling
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks

```javascript
describe('functionName', () => {
  it('should handle normal input correctly', () => {
    // test code
  });

  it('should throw error for invalid input', () => {
    // test code
  });
});
```

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code changes that neither fix bugs nor add features
- `chore:` - Maintenance tasks

Examples:
```
feat: add masonry layout preset
fix: correct grid gap calculation for nested layouts
docs: add example for custom breakpoints
test: add tests for edge cases in validateConfig
```

## Adding New Presets

When adding a new preset pattern:

1. Add the preset function to `src/presets.js`
2. Export it from the presets object
3. Add tests in `tests/presets.test.js` (create if needed)
4. Document the preset in `docs/API.md`
5. Add usage example in `docs/EXAMPLES.md`

```javascript
// Example preset structure
export function newPreset(options = {}) {
  const defaults = {
    // default options
  };
  
  const config = { ...defaults, ...options };
  
  return {
    display: 'grid',
    // ... layout properties
  };
}
```

## Questions?

Feel free to open an issue for any questions about contributing. We're happy to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
