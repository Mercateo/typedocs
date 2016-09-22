import {writeFileAsync, readJsonSync} from 'fs-extra-promise';
import {Markdown} from './markdown/Markdown';
import Path from 'path';
import {exec} from 'child_process';

const defaultOutputJson = Path.join(process.cwd(), 'docs', 'api.json');
const defaultOutputFile = Path.join(process.cwd(), 'docs', 'api.md');

function createJson(path: string): Promise<any> {
  let cwd = process.cwd();
  let script = Path.join(cwd, 'node_modules', 'typedoc', 'bin', 'typedoc');
  return new Promise((resolve, reject)=> {
    exec(`${script} --json ${cwd}/docs/api.json ${path}`, (err, stdout, stderr) => {
      if(err) {
        console.error('Please generate the typedoc json yourself using ' +
          '\'./node_modules/typedoc/bin/typedoc --json <target> <source>\'\n', err);
        process.exit(1);
      }
      resolve();
    });
  });
}

/**
 * Converts the typedoc json output to markdown.
 * @param typeDocJsonFile the typedoc json output
 * @returns {string} markdown text
 */
export function toMarkdown(typeDocJsonFile: string): string {
  const source = readJsonSync(typeDocJsonFile);

  const markdown = new Markdown(source);

  return markdown.getText();
}

/**
 * Converts the typedoc json output to markdown and writes it to the specified file.
 * @param typeDocJsonFile the typedoc json output
 * @param outputFile the file to write markdown to; default is 'docs/api.md'
 * @returns {Promise} a Promise
 */
export async function toMarkdownFile(typeDocJsonFile: string, outputFile: string = defaultOutputFile): Promise<any> {
  return await writeFileAsync(outputFile, toMarkdown(typeDocJsonFile));
}

/**
 * Creates typedoc json output using the source base as specified and converts it to markdown.
 * @param sourceDir your api entry point
 * @returns {Promise} a Promise with the markdown text
 */
export async function toMarkdownFrom(sourceDir: string): Promise<string> {
  await createJson(sourceDir);
  return toMarkdown(defaultOutputJson);
}

/**
 * Creates typedoc json output using the source base as specified, converts it to markdown and writes it to the specified file.
 * @param sourceDir your api entry point
 * @param outputFile the file to write markdown to; default is 'docs/api.md'
 * @returns {Promise} a Promise
 */
export async function toMarkdownFileFrom(sourceDir: string, outputFile: string = defaultOutputFile): Promise<any> {
  await createJson(sourceDir);
  return await toMarkdownFile(defaultOutputJson, outputFile);
}
