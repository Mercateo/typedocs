import { handleError } from './error';
import commander from 'commander';
import { info, setLevel, levels } from 'loglevel';
import { yellow, cyan } from 'chalk';
import { project, TYPE } from './project';
import serveAction from './actions/serve';
import buildAction from './actions/build';
import watchAction from './actions/watch';
import lintAction from './actions/lint';
import unitAction from './actions/unit';
import i18nImportAction from './actions/i18n-import';
import i18nCompileAction from './actions/i18n-compile';

// common setup
const pkg = require('../package.json');
commander.version(pkg.version);
commander.usage('<command> [options]');

// global options
const allowedLogLevels = Object.keys(levels).map(level => level.toLocaleLowerCase());
commander.option('-l, --log-level <level>', 'set log level', (value) => {
  if (allowedLogLevels.some(allowedValue => value === allowedValue)) {
    return value;
  } else {
    throw `Your log level  ${yellow(value)} doesn't match any of the valid values: ${yellow(allowedLogLevels.join(', '))}.`;
  }
}, 'info');

function handleAction(action: (options?: any) => Promise<any>) {
  return (options) => {
    // handle global options
    setLevel(levels[options.parent.logLevel.toUpperCase()]);
    // handle specific action
    info(`run ${cyan(options.name())}...`);
    return action(options)
      .then(() => info(`finished ${cyan(options.name())} ♥`))
      .catch(handleError);
  };
}

// specific setup
switch (project.ws.type) {
  case TYPE.SPA:
    commander.description('We build your SPA!');

    commander
      .command('serve')
      .alias('s')
      .description('serve the project')
      .option('-p, --production', 'serve production build')
      .action(handleAction(serveAction));
    break;
  case TYPE.NODE:
    commander.description('We build your Node module!');
    break;
  case TYPE.BROWSER:
    commander.description('We build your Browser module!');
    break;
}

if (project.ws.i18n) {
  commander
    .command('i18n:compile')
    .alias('i18n:c')
    .description('compile translations')
    // .option('--feature <feature>', 'feature to import')
    // .option('-l, --locale <locale>', 'locale to import')
    .action(handleAction(i18nCompileAction));

  if (project.ws.i18n.importUrl) {
    commander
      .command('i18n:import')
      .alias('i18n:i')
      .description('import translations')
      // .option('--feature <feature>', 'feature to import')
      // .option('-l, --locale <locale>', 'locale to import')
      .action(handleAction(i18nImportAction));
  }
}

// shared setup
switch (project.ws.type) {
  case TYPE.SPA:
  case TYPE.NODE:
  case TYPE.BROWSER:
    const buildCommand = commander
      .command('build')
      .alias('b')
      .description('build the project')
      .action(handleAction(buildAction));

    if (project.ws.type === TYPE.SPA) {
      buildCommand.option('-p, --production', 'create production build');
    }

    commander
      .command('watch')
      .alias('w')
      .description('continuously build and serve the project')
      // .option('-H, --hot', 'enables hot reloading (experimental)')
      .action(handleAction(watchAction));

    commander
      .command('lint')
      .alias('l')
      .description('run linter')
      .action(handleAction(lintAction));

    const unitCommand = commander
      .command('unit')
      .alias('u')
      .description('run unit tests')
      // .option('-c, --coverage', 'generates code coverage')
      .action(handleAction(unitAction));

    if (project.ws.selenium) {
      unitCommand.option('-g, --grid', 'run on selenium grid');
    }
    break;
}

// handle unknown commands
commander.on('*', (unknownCommand) => {
  commander.outputHelp();
  throw `${yellow(unknownCommand)} is not a known command. You can see all supported commands above.`;
});

// invoke commands
commander.parse(process.argv);

// hande default command
if (!commander.args.length) {
  commander.help();
}
