#!/usr/bin/env node
const commander = require('commander');
const join = require('path').join;
const toMarkdown = require('../dist').toMarkdown;
const toMarkdownFile = require('../dist').toMarkdownFile;
const toMarkdownFrom = require('../dist').toMarkdownFrom;
const toMarkdownFileFrom = require('../dist').toMarkdownFileFrom;

commander.version(require('../package.json').version);

commander.command('convert <entry> [target...]')
  .description('converts the TypeDoc JSON-output to Markdown')
  .action((entry, target) => {
    let path = join(process.cwd(), entry);
    if (0 === target.length) {
      let markdown = toMarkdown(path);
      console.log(markdown)
    } else {
      let targetPath = join(process.cwd(), target[0]);
      toMarkdownFile(path, targetPath).then(() => {
        console.log('Successfully created \'api.md\'');
      });
    }
  });

commander.command('generate <source> [target...]')
  .description('generates a Markdown documentation of your project')
  .action((source, target) => {
    let path = join(process.cwd(), source);
    if (0 === target.length) {
      toMarkdownFrom(path).then((res)=> {
        console.log(res);
      });
    } else {
      let targetPath = join(process.cwd(), target[0]);
      toMarkdownFileFrom(path, targetPath).then(() => {
        console.log('Successfully created \'api.md\'');
      });
    }
  });

commander.on('*', (unknownCommand) => {
  commander.outputHelp();
  console.error(`${unknownCommand} is not a known command.`);
  process.exit(1);
});

commander.parse(process.argv);

if (!commander.args.length) {
  commander.help();
}
