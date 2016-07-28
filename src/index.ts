import {
  createProgram,
  CompilerOptions,
  forEachChild
} from 'typescript';

// possible API:
// parse(fileNames, options) → return JSON about docs
// toMarkdown(JSON about docs) → return markdown
// toMarkdownFile(fileName, JSON about docs) → writes markdown
// generate(fileNames, options) → alias "toMarkdown(parse(fileNames, options))"
// generateFile(fileNames, options, markdownfileName) → alias "toMarkdownFile(markdownfileName, parse(fileNames, options))"

export function parse(fileNames: string[], options: CompilerOptions) {
}