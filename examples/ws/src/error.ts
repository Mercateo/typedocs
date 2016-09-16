import { red } from 'chalk';
import { error } from 'loglevel';

const IGNORED_TRACE_LINES = [
  // our bin
  'bin/ws.js:2:1)',
  // native
  'at [object Generator].next (native)',
  // polyfills
  'at fulfilled (',
  'core-js/modules/_microtask.js',
  'core-js/modules/es6.promise.js',
  // webpack
  '(./webpack/bootstrap',
  'at ./webpack/bootstrap',
  // node internals
  '(util.js',
  '(net.js',
  '(node.js',
  'at node.js',
  '(module.js',
  '(internal/module.js'
];

export function handleError(err: Error) {
  if (err.stack) {
    err.stack.split('\n')
      .filter(line => !IGNORED_TRACE_LINES.some(ignoredLine => line.includes(ignoredLine)))
      .forEach(line => error(line));
  } else {
    error(err);
  }

  error(`${red('error!')} ( ╯°□°)╯ ┻━━┻`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
