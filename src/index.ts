import * as fs from 'fs';
import { parse, ParseOptions } from './analysis/parse';
import Markdown from './interfaces/Markdown';

// possible API:
// parse(fileNames, options) → return JSON about docs
// toMarkdown(JSON about docs) → return markdown
// toMarkdownFile(fileName, JSON about docs) → writes markdown
// generate(fileNames, options) → alias "toMarkdown(parse(fileNames, options))"
// generateFile(fileNames, options, markdownfileName) → alias "toMarkdownFile(markdownfileName, parse(fileNames, options))"

export function extractJson(fileNames: string[], parseOptions: ParseOptions = { compilerOptions: require('../tsconfig.json') }): JSON[] {
  return parse(fileNames, parseOptions);
}

export function toMarkdown(json: JSON[]): Markdown {
  return new Markdown(json);
}

export function toMarkdownFile(targetName: string, json: JSON[]) {
  return new Promise((resolve, reject) => {
    fs.writeFile(targetName, new Markdown(json).getMarkdown(), (err) => {
      if (err)
        reject();
      else
        resolve();
    })
  });
}

export function extractMarkdown(fileNames: string[], parseOptions: ParseOptions = { compilerOptions: require('../tsconfig.json') }): Markdown {
  return toMarkdown(parse(fileNames, parseOptions));
}

export function extractMarkdownFile(fileNames: string[], parseOptions: ParseOptions = { compilerOptions: require('../tsconfig.json') }, targetName: string) {
  toMarkdownFile(targetName, parse(fileNames, parseOptions));
}
