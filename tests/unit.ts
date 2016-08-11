import { readFileSync } from 'fs';
import expect from 'expect';
import { parse } from '../src/analysis/parse';
import * as uut from '../src/index';
import Markdown from '../src/interfaces/Markdown';

describe('test analysis feature', () => {

  it('equals example JSON', () => {
    let expected = require('../examples/exported-functions/docs/api.fixture.json');

    let base = `${process.cwd()}/examples/exported-functions/src`;
    let actual = parse([ `${base}/add.ts`, `${base}/subtract.ts` ], { compilerOptions: require('../tsconfig.json') });

    expect(actual).toEqual(expected);
  });

  it('creates correct Markdown', () => {
    let expected = readFileSync(`${process.cwd()}/examples/exported-functions/docs/api.fixture.md`, 'utf8');

    let json = require('../examples/exported-functions/docs/api.fixture.json');
    let actual = new Markdown(json);

    expect(actual.getMarkdown()).toEqual(expected);
  });

  /*it('writes Markdown correctly', () => {
    let json = require('../examples/exported-functions/docs/api.fixture.json');

    uut.toMarkdownFile('', json)
      .then(() => {

      });
  });*/
});

// possible e2e test?
// for every example
// -- generate docs: toMarkdown([ 'src/index.ts' ], require('tslint.json')), 'docs/api.md');
// -- compare docs: expect(fs.readFileSync('docs/api.md', 'utf8')).toBe(fs.readFileSync('docs/api.fixture.md', 'utf8'))
