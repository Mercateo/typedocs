import { Configuration } from 'webpack';
import browserOptions from './browser-options';
import {
  outputUmdMin,
  extractCssMinPlugin,
  defineProductionPlugin,
  minifyJsPlugin,
  devtoolProduction
} from './generic';

const options: Configuration = Object.assign({}, browserOptions, {
  output: outputUmdMin,
  plugins: [
    extractCssMinPlugin,
    defineProductionPlugin,
    minifyJsPlugin
  ],
  devtool: devtoolProduction
});

export default options;
