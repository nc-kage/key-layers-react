const path = require('path');
const { identity } = require('lodash');
const react = require('react');
const reactDom = require('react-dom');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const url = require('rollup-plugin-url');
const svgr = require('@svgr/rollup');
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const postcss = require('rollup-plugin-postcss');
const { string } = require('rollup-plugin-string');
const sourcemaps = require('rollup-plugin-sourcemaps');
const { terser } = require('rollup-plugin-terser');
const { babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');

const pkg = require('./package.json');
const BUILD = !process.argv.includes('-w');

module.exports = {
  input: BUILD ? './src/export.ts' : './src/index.tsx',
  watch: {
    exclude: ['node_modules/**', './**/node_modules/**'],
  },
  external: BUILD ? Object.keys(pkg.dependencies) : [],
  output: [
    {
      file: BUILD ? pkg.main : 'serve/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: !BUILD,
    },
  ],
  plugins: [
    babel({
      presets: ['@babel/preset-react'],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    external(),
    url(),
    svgr(),
    string({
      include: '../**/*.html',
      exclude: ['../**/index.html'],
    }),
    postcss({
      minimize: BUILD,
      use: ['sass'],
      ...(BUILD ? { extract: path.resolve('dist/index.css') } : { extract: false }),
    }),
    nodeResolve({
      ain: true,
      browser: true,
      preferBuiltins: false,
      extensions: ['.ts', '.tsx', '.json'],
    }),
    copy({
      targets: [
        BUILD ? null : { src: 'src/index.html', dest: 'serve' },
      ].filter(identity),
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: BUILD ? 'tsconfig.json' : 'tsconfig.dev.json',
    }),
    commonjs({
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom),
      },
    }),
    BUILD ? null : sourcemaps(),
    BUILD ? terser() : null,
    BUILD ? null : serve({
      contentBase: 'serve',
      host: 'localhost',
      port: 10001,
    }),
  ].filter(identity),
};
