import { Configuration } from 'webpack';
import {
  entry,
  output,
  tsLoader,
  jsonLoader,
  cssLoader,
  lessLoader,
  imageLoader,
  eotLoader,
  woffLoader,
  ttfLoader,
  indexHtmlPlugin,
  extractCssPlugin,
  resolveLoader,
  resolve,
  devtool,
  postcss
} from './generic';

const options: Configuration & { postcss: any } = {
  entry,
  output,
  module: {
    loaders: [
      tsLoader,
      jsonLoader,
      cssLoader,
      lessLoader,
      imageLoader,
      eotLoader,
      woffLoader,
      ttfLoader
    ]
  },
  plugins: [
    indexHtmlPlugin,
    extractCssPlugin
  ],
  resolveLoader,
  resolve,
  devtool,
  postcss
};

export default options;
