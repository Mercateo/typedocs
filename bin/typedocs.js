#!/usr/bin/env node
const commander = require('commander');
const join = require('path').join;
const toMarkdown = require('../dist').toMarkdown;

commander.version(require('../package.json').version);

commander.command('convert <entry>')
  .description('converts the TypeDoc JSON-output to Markdown')
  .action((entry) => {
    let path = join(process.cwd(), entry);
    let markdown = toMarkdown(path);
    console.log(markdown)
  });

commander.on('*', (unknownCommand) => {
  commander.outputHelp();
  console.error(`${unknownCommand} is not a known command.`)
  process.exit(1);
});

commander.parse(process.argv);

if (!commander.args.length) {
  commander.help();
}
