import { Configuration } from 'webpack';
import {
  entry,
  outputUmd,
  tsLoader,
  jsonLoader,
  cssLoader,
  lessLoader,
  imageLoader,
  eotLoader,
  woffLoader,
  ttfLoader,
  extractCssPlugin,
  externalsBrowser,
  resolveLoader,
  resolve,
  devtool,
  postcss
} from './generic';

const options: Configuration & { postcss: any } = {
  entry,
  output: outputUmd,
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
    extractCssPlugin
  ],
  externals: externalsBrowser,
  resolveLoader,
  resolve,
  devtool,
  postcss
};

export default options;
