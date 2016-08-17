import { writeFileAsync } from 'fs-extra-promise';
import { parse, ParseOptions } from './analysis/parse';
import Markdown from './markdown/Markdown';
import {DocJson} from "./interfaces/DocJson";

const defaultOptions = { compilerOptions: require('../tsconfig.json') };

export function extractJson(fileNames: string[], parseOptions: ParseOptions = defaultOptions): JSON[] {
  return parse(fileNames, parseOptions);
}

export function toMarkdown(json: DocJson[]): Markdown {
  return new Markdown(json);
}

export async function toMarkdownFile(targetName: string, json: DocJson[]) {
  return await writeFileAsync(targetName, new Markdown(json).getMarkdown());
}

export function extractMarkdown(fileNames: string[], parseOptions: ParseOptions = defaultOptions): Markdown {
  return toMarkdown(parse(fileNames, parseOptions));
}

export async function extractMarkdownFile(fileNames: string[], targetName: string, parseOptions: ParseOptions = defaultOptions) {
  return await toMarkdownFile(targetName, parse(fileNames, parseOptions));
}
