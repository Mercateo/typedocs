import { ParseOptions } from './analysis/parse';
import Markdown from './interfaces/Markdown';
export declare function extractJson(fileNames: string[], parseOptions?: ParseOptions): JSON[];
export declare function toMarkdown(json: JSON[]): Markdown;
export declare function toMarkdownFile(targetName: string, json: JSON[]): Promise<{}>;
export declare function extractMarkdown(fileNames: string[], parseOptions?: ParseOptions): Markdown;
export declare function extractMarkdownFile(fileNames: string[], parseOptions: ParseOptions, targetName: string): void;
