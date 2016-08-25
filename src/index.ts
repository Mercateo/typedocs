import { join } from 'path';
import { writeFileAsync, readJsonSync } from 'fs-extra-promise';
import { parse, ParseOptions } from './analysis/parse';
import Markdown from './markdown/Markdown';
import { DocJson } from './interfaces/DocJson';

const defaultOptions: ParseOptions = {
  // currently we need `as any` until this is merged
  // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/10817
  compilerOptions: readJsonSync(join(process.cwd(), 'tsconfig.json')) as any
};

export function extractJson(fileNames: string[], parseOptions: ParseOptions = defaultOptions): DocJson {
  return parse(fileNames, parseOptions);
}

export function toMarkdown(json: DocJson): Markdown {
  return new Markdown(json);
}

export async function toMarkdownFile(targetName: string, json: DocJson) {
  return await writeFileAsync(targetName, new Markdown(json).getMarkdown());
}

export function extractMarkdown(fileNames: string[], parseOptions: ParseOptions = defaultOptions): Markdown {
  return toMarkdown(parse(fileNames, parseOptions));
}

export async function extractMarkdownFile(fileNames: string[], targetName: string, parseOptions: ParseOptions = defaultOptions) {
  return await toMarkdownFile(targetName, parse(fileNames, parseOptions));
}
