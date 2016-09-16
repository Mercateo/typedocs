import { Configuration } from 'webpack';
import nodeOptions from './node-options';
import { entryNodeUnit, outputTest } from './generic';

const options: Configuration = Object.assign({}, nodeOptions, {
  entry: entryNodeUnit,
  output: outputTest
});

export default options;
