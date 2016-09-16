import { Configuration } from 'webpack';
import spaOptions from './spa-options';
import {
  outputSpaRelease,
  indexHtmlPlugin,
  extractCssHashPlugin,
  defineProductionPlugin,
  minifyJsPlugin,
  devtoolProduction
} from './generic';

const options: Configuration = Object.assign({}, spaOptions, {
  output: outputSpaRelease,
  plugins: [
    indexHtmlPlugin,
    extractCssHashPlugin,
    defineProductionPlugin,
    minifyJsPlugin
  ],
  devtool: devtoolProduction
});

export default options;