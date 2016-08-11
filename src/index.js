import * as fs from 'fs';
import { parse } from './analysis/parse';
import Markdown from './interfaces/Markdown';
// possible API:
// parse(fileNames, options) → return JSON about docs
// toMarkdown(JSON about docs) → return markdown
// toMarkdownFile(fileName, JSON about docs) → writes markdown
// generate(fileNames, options) → alias "toMarkdown(parse(fileNames, options))"
// generateFile(fileNames, options, markdownfileName) → alias "toMarkdownFile(markdownfileName, parse(fileNames, options))"
const base = `${process.cwd()}`;
let json = parse([`${base}/add.ts`, `${base}/subtract.ts`], { compilerOptions: require('../tsconfig.json') });
export function extractJson(fileNames, parseOptions = { compilerOptions: require('../tsconfig.json') }) {
    return parse(fileNames, parseOptions);
}
export function toMarkdown(json) {
    return new Markdown(json);
}
export function toMarkdownFile(targetName, json) {
    return new Promise((resolve, reject) => {
        fs.writeFile(targetName, new Markdown(json).getMarkdown(), (err) => {
            if (err)
                reject();
            else
                resolve();
        });
    });
}
export function extractMarkdown(fileNames, parseOptions = { compilerOptions: require('../tsconfig.json') }) {
    return toMarkdown(parse(fileNames, parseOptions));
}
export function extractMarkdownFile(fileNames, parseOptions = { compilerOptions: require('../tsconfig.json') }, targetName) {
    toMarkdownFile(targetName, parse(fileNames, parseOptions));
}
