import expect from 'expect';
import { parse } from '../src';

describe('test my code', () => {

  it('has a something called parse', () => {
    expect(parse).toNotBe(undefined);
  });

  it('has a parse function', () => {
    expect(typeof parse).toBe('function');
  });

  it('returns a JSON', () => {
    let base = `${process.cwd()}/examples/exported-functions/src`;
    let json = parse([ `${base}/add.ts`, `${base}/subtract.ts` ], { compilerOptions: require('../tsconfig.json') });
    expect(typeof json).toBe('object');
  });

});

// possible e2e test?
// for every example
// -- generate docs: toMarkdown([ 'src/index.ts' ], require('tslint.json')), 'docs/api.md');
// -- compare docs: expect(fs.readFileSync('docs/api.md', 'utf8')).toBe(fs.readFileSync('docs/api.fixture.md', 'utf8'))
