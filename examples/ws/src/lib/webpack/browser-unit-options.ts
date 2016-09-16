import { Configuration } from 'webpack';
import browserOptions from './browser-options';
import {
  entryUnit,
  outputTest,
  devtoolTest
} from './generic';

const options: Configuration = Object.assign({}, browserOptions, {
  entry: entryUnit,
  output: outputTest,
  externals: [],
  devtool: devtoolTest
});

export default options;
