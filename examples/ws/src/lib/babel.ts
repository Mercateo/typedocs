import { transformFile } from 'babel-core';

const defaultOptions = {
  presets: [
    // require.resolve is needed, so presets can be either in projects or m.ws node modules
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0')
  ]
};

export function transformFileAsync(filename) {
  return new Promise((resolve, reject) => {
    transformFile(filename, defaultOptions, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
