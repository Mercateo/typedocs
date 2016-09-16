import { Configuration } from 'webpack';
import spaOptions from './spa-options';
import {
  entryUnit,
  outputTest,
  devtoolTest
} from './generic';

const options: Configuration = Object.assign({}, spaOptions, {
  entry: entryUnit,
  output: outputTest,
  devtool: devtoolTest
});

export default options;
