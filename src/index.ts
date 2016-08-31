import {writeFileAsync, readJsonSync} from 'fs-extra-promise';
import {Markdown} from './markdown/Markdown';
import Path from 'path';

const defaultOutputFile = Path.join(process.cwd(), 'docs', 'api.md');

export function toMarkdown(typeDocJsonFile: string): string {
  const source = readJsonSync(typeDocJsonFile);

  const markdown = new Markdown(source);

  return markdown.getText();
}

export async function toMarkdownFile(typeDocJsonFile: string, outputFile: string = defaultOutputFile): Promise<any> {
  const source = readJsonSync(typeDocJsonFile);

  const markdown = new Markdown(source);

  return await writeFileAsync(outputFile, markdown.getText());
}

export function toMarkdownFrom(sourceDir: string): string {
  // run typedoc --json out src
  const typeDocJson = '';

  return toMarkdown(typeDocJson);
}

export async function toMarkdownFileFrom(sourceDir: string, outputFile: string = defaultOutputFile): Promise<any> {
  // run typedoc --json out src
  const typeDocJson = '';

  return await toMarkdownFile(typeDocJson, outputFile);
}

/*
export function extractJson(fileNames: string[], parseOptions: ParseOptions = defaultOptions): DocJson {
  return parse(fileNames, parseOptions);
}

export function toMarkdown(json: DocJson): Markdown {
  return new Markdown(json);
}

export async function toMarkdownFile(targetName: string, json: DocJson) {
  return await writeFileAsync(targetName, new Markdown(json).getText());
}

export function extractMarkdown(fileNames: string[], parseOptions: ParseOptions = defaultOptions): Markdown {
  return toMarkdown(parse(fileNames, parseOptions));
}

export async function extractMarkdownFile(fileNames: string[], targetName: string, parseOptions: ParseOptions = defaultOptions) {
  return await toMarkdownFile(targetName, parse(fileNames, parseOptions));
}
*/
