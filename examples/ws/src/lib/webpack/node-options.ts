import { Configuration } from 'webpack';
import {
  entryNode,
  outputCommon2,
  tsLoader,
  externalsNode,
  resolveLoader,
  resolve,
  devtool
} from './generic';

const options: Configuration = {
  entry: entryNode,
  output: outputCommon2,
  module: {
    loaders: [
      tsLoader
    ]
  },
  externals: externalsNode,
  // in order to ignore built-in modules like path, fs, etc.
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  resolveLoader,
  resolve,
  devtool
};

export default options;
