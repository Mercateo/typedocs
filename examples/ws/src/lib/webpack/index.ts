import { warn, error } from 'loglevel';
import { join } from 'path';
import webpack, { DefinePlugin } from 'webpack';
import spaOptions from './spa-options';
import nodeOptions from './node-options';
import browserOptions from './browser-options';
import spaUnitOptions from './spa-unit-options';
import nodeUnitOptions from './node-unit-options';
import browserUnitOptions from './browser-unit-options';
import spaReleaseOptions from './spa-release-options';
import browserReleaseOptions from './browser-release-options';
import { project } from '../../project';

export {
  spaOptions,
  nodeOptions,
  browserOptions,
  spaUnitOptions,
  nodeUnitOptions,
  browserUnitOptions,
  spaReleaseOptions,
  browserReleaseOptions
};

export const statsStringifierOptions: webpack.compiler.StatsToStringOptions = {
  // minimal logging
  assets: false,
  colors: true,
  version: false,
  hash: false,
  timings: false,
  chunks: false,
  chunkModules: false,
  children: false
};

export function createLocaleSpecificOptions(options: webpack.Configuration, locale: string) {
  return Object.assign({}, options, {
    output: Object.assign({}, options.output, {
      path: join(options.output.path, project.ws.i18n.isSingleLocale ? '' : locale)
    }),
    plugins: [
      new DefinePlugin({
        'process.env.LOCALE': JSON.stringify(locale)
      })
    ].concat(options.plugins || [])
  });
}

// error handling taken from https://webpack.github.io/docs/node.js-api.html#error-handling
function onBuild(resolve, reject, err, stats, watcher?) {
  if (err) {
    // "hard" error
    return reject(err);
  }

  if (stats.hasErrors()) {
    // "soft" error
    return reject(stats.toString(statsStringifierOptions));
  }

  if (stats.hasWarnings()) {
    warn(stats.toString(statsStringifierOptions));
  }

  // note: watcher is optional
  resolve(watcher);
}

// error handling taken from https://webpack.github.io/docs/node.js-api.html#error-handling
function onChange(err, stats, livereloadServer, onChangeSuccess?) {
  if (err) {
    // "hard" error
    return error(err);
  }

  if (stats.hasErrors()) {
    // "soft" error
    return error(stats.toString(statsStringifierOptions));
  }

  if (stats.hasWarnings()) {
    warn(stats.toString(statsStringifierOptions));
  }

  // filter changes for live reloading
  const changedModules = stats.compilation.modules.filter(module => module.built && module.resource);
  const changedStyleModules = changedModules.filter(module => module.resource.match(/\.(css|less|sass)$/));
  let hasOnlyStyleChanges = changedModules.length === changedStyleModules.length;
  if (hasOnlyStyleChanges) {
    livereloadServer.refresh('style.css');
  } else {
    livereloadServer.refresh('index.html');
  }

  if (onChangeSuccess) {
    onChangeSuccess(stats);
  }
}

export function compileAsync(options: webpack.Configuration) {
  const compiler = webpack(options);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => onBuild(resolve, reject, err, stats));
  });
}

export function watchAsync(livereloadServer, options: webpack.Configuration, onChangeSuccess?: (stats: any) => void) {
  const compiler = webpack(options);
  let isInitialBuild = true;
  return new Promise((resolve, reject) => {
    const watcher = compiler.watch({}, (err, stats) => {
      if (isInitialBuild) {
        isInitialBuild = false;
        onBuild(resolve, reject, err, stats);
      } else {
        onChange(err, stats, livereloadServer, onChangeSuccess);
      }
    });
  });
}
