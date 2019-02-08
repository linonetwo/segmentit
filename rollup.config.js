// @flow
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import commonJs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

import { minify } from 'uglify-es';
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json');

const productionPlugins = [
  babel({
    exclude: 'node_modules/**',
  }),
  replace({
    'process.env.NODE_ENV': "'production'",
  }),
  commonJs(),
  uglify(
    {
      compress: {
        pure_getters: true,
        unsafe: true,
      },
      output: {
        comments: false,
        semicolons: false,
      },
      mangle: {
        reserved: ['payload', 'type', 'meta'],
      },
    },
    minify,
  ),
];

// minified production builds
const umdProduction = {
  input: 'src/index.js',
  output: [
    {
      name: 'Segmentit',
      file: pkg.browser,
      format: 'umd',
      exports: 'named',
      sourcemap: true,
    }, // Universal Modules
  ],
  plugins: productionPlugins,
};

const cjsProduction = {
  input: 'src/index.js',
  output: [
    {
      file: `${pkg.main}/segmentit.min.js`,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    }, // CommonJS Modules
  ],
  plugins: productionPlugins,
};

// full source development builds
const development = {
  input: 'src/index.js',
  output: [
    { file: `${pkg.main}/segmentit.js`, format: 'cjs', exports: 'named' }, // CommonJS Modules
    {
      file: pkg.module, format: 'es', exports: 'named', sourcemap: true,
    }, // ES Modules
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': '"development"',
    }),
    commonJs(),
  ],
};

// point user to needed build
const root = '"use strict";module.exports="production"===process.env.NODE_ENV?require("./segmentit.min.js"):require("./segmentit.js");';

const rootFile = folder => {
  mkdirSync(join('dist', folder));
  writeFileSync(join('dist', folder, 'index.js'), root);
};

export default (() => {
  // generate root mapping files
  mkdirSync('dist');
  rootFile('cjs');

  return [development, umdProduction, cjsProduction];
})();
