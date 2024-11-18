import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js', // Entry file
  output: [
    {
      file: 'dist/tron-reactjs.cjs.js',
      format: 'cjs', // CommonJS format
      sourcemap: true,
    },
    {
      file: 'dist/tron-reactjs.esm.js',
      format: 'esm', // ES Module format
      sourcemap: true,
    },
    {
      file: 'dist/tron-reactjs.umd.js',
      format: 'umd', // Universal Module Definition
      name: 'TronReactJS', // Global variable for browser use
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true, // Ensures that Rollup resolves modules for browser environments
    }),
    commonjs(), // Convert CommonJS to ES6
    babel({
      exclude: 'node_modules/**', // Ignore dependencies
      babelHelpers: 'bundled',
    }),
    terser(), // Minify output
  ],
  external: ['react', 'react-dom'], // Prevent bundling peer dependencies
};
