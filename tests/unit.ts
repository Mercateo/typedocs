import expect from 'expect';
import { parse } from '../src';

describe('test my code', () => {
  it('has a something called parse', () => {
    expect(parse).toNotBe(undefined);
  });

  it('has a parse function', () => {
    expect(typeof parse).toBe('function');
  });
});

// possible e2e test?
// for every example
// -- generate docs: toMarkdown([ 'src/index.ts' ], require('tslint.json')), 'docs/api.md');
// -- compare docs: expect(fs.readFileSync('docs/api.md', 'utf8')).toBe(fs.readFileSync('docs/api.fixture.md', 'utf8'))
