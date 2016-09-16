import { info, warn } from 'loglevel';
import path from 'path';
import { removeAsync, existsAsync } from 'fs-extra-promise';
import { cyan, yellow } from 'chalk';
import { project, TYPE } from '../project';
import {
  compileAsync,
  createLocaleSpecificOptions,
  nodeUnitOptions,
  spaUnitOptions,
  browserUnitOptions
} from '../lib/webpack';
import { testAsync as karmaTestAsync } from '../lib/karma';
import { testAsync as mochaTestAsync  } from '../lib/mocha';

export default async function unit(options) {
  const unitEntry = `./${project.ws.testsDir}/unit.${project.ws.entryExtension}`;
  const hasUnitTests = await existsAsync(unitEntry);
  if (!hasUnitTests) {
    warn(`${yellow('warn!')} You tried to run unit tests, but ${yellow(unitEntry)} doesn't exist.`);
    return;
  }

  await removeAsync(project.ws.distTestsDir);

  let exitCode;
  switch (project.ws.type) {
    case TYPE.NODE:
      await compileAsync(nodeUnitOptions);
      const files = [
        path.join(nodeUnitOptions.output.path, nodeUnitOptions.output.filename)
      ];
      exitCode = await mochaTestAsync(files);
      break;
    case TYPE.SPA:
      if (project.ws.i18n) {
        await compileAsync(createLocaleSpecificOptions(spaUnitOptions, project.ws.i18n.locales[0]));
      } else {
        await compileAsync(spaUnitOptions);
      }
      exitCode = await karmaTestAsync(options);
      break;
    case TYPE.BROWSER:
      if (project.ws.i18n) {
        await compileAsync(createLocaleSpecificOptions(browserUnitOptions, project.ws.i18n.locales[0]));
      } else {
        await compileAsync(browserUnitOptions);
      }
      exitCode = await karmaTestAsync(options);
      break;
  }

  if (exitCode !== 0) {
    throw `${cyan('unit')} failed.`;
  }
};
