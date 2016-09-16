import TsLinter from 'tslint';
import fs from 'fs-extra-promise';
import globby from 'globby';

// relative from dist/index.js
const configuration = require('../tslint.json');
const options = {
  formatter: 'json',
  configuration,
  rulesDirectory: '',
  formattersDirectory: ''
};
const defaultFilePatterns = [ 'src/**/*.tsx', 'src/**/*.ts' ];

export async function lintAsync(filePatterns = defaultFilePatterns) {
  const filePaths = await globby(filePatterns);
  const contents = await Promise.all(filePaths.map(filePath => fs.readFileAsync(filePath, 'utf8')));
  const results = filePaths.map((filePath, index) => {
    const content = contents[index];
    const linter = new TsLinter(filePath, content, options);
    return linter.lint();
  });

  const failures = results.filter(result => !!result.failureCount);
  return failures;
}
