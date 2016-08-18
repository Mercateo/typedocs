#!/usr/bin/env node
const commander = require('commander');
const join = require('path').join;
const extractJson = require('../dist').extractJson;

commander.version(require('../package.json').version);

commander.command('extract-json <entry>')
  .description('returns api description as json')
  .action((entry) => {
    let path = join(process.cwd(), entry);
    console.log(path)
    let json = extractJson([ path ]);
    console.log(json)
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
