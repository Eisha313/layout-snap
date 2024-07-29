# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Core Layout Generation**
  - `generateGrid()` - Create CSS Grid layouts from configuration objects
  - `generateFlex()` - Create Flexbox layouts from configuration objects
  - Support for named grid areas and template definitions

- **Preset Patterns**
  - `heroSection` - Full-width hero layouts with customizable content areas
  - `featureGrid` - Responsive feature card grids (2, 3, or 4 columns)
  - `pricingTable` - Pricing comparison layouts with highlighted options
  - `sidebar` - Main content with sidebar layouts (left or right)
  - `magazine` - Complex magazine-style grid layouts
  - `dashboard` - Admin dashboard layouts with header, sidebar, and widgets

- **Responsive Breakpoints**
  - Auto-responsive breakpoint generation
  - Default breakpoints: mobile (480px), tablet (768px), desktop (1024px), wide (1280px)
  - Customizable breakpoint definitions
  - `injectStyles()` - Inject generated CSS with media queries into the document
  - `removeStyles()` - Clean up injected styles by ID

- **Live Preview Mode**
  - `Preview` class for rendering layouts into target containers
  - Real-time layout visualization
  - Custom content rendering support
  - Automatic style management

- **Hot Reload Support**
  - `HotReload` class for development workflows
  - File watching simulation with configurable debounce
  - Automatic re-rendering on configuration changes
  - Start/stop controls for reload functionality

- **Utility Functions**
  - `deepMerge()` - Deep merge configuration objects
  - `generateClassName()` - Generate unique class names with optional prefixes
  - `parseSpacing()` - Convert spacing values to CSS-compatible strings
  - `validateConfig()` - Validate layout configuration objects

- **Documentation**
  - Comprehensive API documentation
  - Usage examples for all features
  - Getting started guide

- **Testing**
  - Full test coverage for all modules
  - Jest configuration for ES modules

- **Build System**
  - Rollup configuration for multiple output formats (ESM, CJS, UMD)
  - Minified production builds
  - ESLint configuration for code quality

### Dependencies

- No runtime dependencies (zero-dependency library)
- Development dependencies for testing and building

## [Unreleased]

### Planned

- CSS-in-JS integration options
- Additional preset patterns (gallery, masonry, holy-grail)
- Animation support for layout transitions
- TypeScript type definitions
- Framework-specific wrappers (React, Vue, Svelte)
