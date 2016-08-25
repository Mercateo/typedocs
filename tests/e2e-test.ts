import { readFileAsync, existsSync, readJsonAsync, removeSync } from 'fs-extra-promise';
import { join } from 'path';
import expect from 'expect';

import * as index from '../src/index';

const exampleSrc = join(process.cwd(), 'examples', 'exported-functions', 'src');
const exampleDocs = join('examples', 'exported-functions', 'docs');

describe('test exported api features', () => {

  it('extracts JSON of files', async () => {
    const expected = await readJsonAsync(join(exampleDocs, 'api.fixture.json'));

    const actual = index.extractJson([
      join(exampleSrc, 'add.ts'),
      join(exampleSrc, 'subtract.ts')
    ]);

    expect(actual).toEqual(expected);
  });

  it('extracts Markdown of files', async () => {
    const expected = await readFileAsync(join(exampleDocs, 'api.fixture.md'), 'utf8');

    const actual = index.extractMarkdown([
      join(exampleSrc, 'add.ts'),
      join(exampleSrc, 'subtract.ts')
    ]);

    expect(actual.getMarkdown()).toEqual(expected);
  });

  it('creates correct Markdown out of JSON', async () => {
    const expected = await readFileAsync(join(exampleDocs, 'api.fixture.md'), 'utf8');

    const json = (await readJsonAsync(join(exampleDocs, 'api.fixture.json')) as any);
    const actual = index.toMarkdown(json);

    expect(actual.getMarkdown()).toEqual(expected);
  });

  it('writes Markdown correctly', async () => {
    const targetPath = join(exampleDocs, 'api.md');
    const json = (await readJsonAsync(join(exampleDocs, 'api.fixture.json')) as any);

    index.toMarkdownFile(targetPath, json)
      .then(() => {
        expect(existsSync(targetPath)).toBeTruthy();
      });
  });

  it('creates and writes Markdown correctly', () => {
    const targetPath = join(exampleDocs, 'api.md');

    index.extractMarkdownFile([
      join(exampleSrc, 'add.ts'),
      join(exampleSrc, 'subtract.ts')
    ], targetPath)
      .then(() => {
        expect(existsSync(targetPath)).toBeTruthy();
      });
  });

  afterEach(() => {
    const targetPath = join(exampleDocs, 'api.md');
    if (existsSync(targetPath))
      removeSync(targetPath);
  });
});
