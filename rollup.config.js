import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * @license MIT
 */`;

export default [
  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      name: 'LayoutSnap',
      file: pkg.browser,
      format: 'umd',
      banner,
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'LayoutSnap',
      file: 'dist/layout-snap.min.js',
      format: 'umd',
      banner,
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },
  // ESM build for bundlers
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      banner,
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // CommonJS build for Node
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
