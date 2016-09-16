import { info } from 'loglevel';
import { removeAsync } from 'fs-extra-promise';
import { project, TYPE } from '../project';
import {
  compileAsync,
  createLocaleSpecificOptions,
  spaOptions,
  spaReleaseOptions,
  nodeOptions,
  browserOptions,
  browserReleaseOptions
} from '../lib/webpack';

export default async function build(options) {
  switch (project.ws.type) {
    case TYPE.NODE:
      await removeAsync(project.ws.distDir);
      await compileAsync(nodeOptions);
      break;
    case TYPE.SPA:
      if (options.production) {
        await removeAsync(project.ws.distReleaseDir);
        if (project.ws.i18n) {
          for (const locale of project.ws.i18n.locales) {
            info(`...for locale ${locale}.`);
            await compileAsync(createLocaleSpecificOptions(spaReleaseOptions, locale));
          }
        } else {
          await compileAsync(spaReleaseOptions);
        }
      } else {
        await removeAsync(project.ws.distDir);
        if (project.ws.i18n) {
          await compileAsync(createLocaleSpecificOptions(spaOptions, project.ws.i18n.locales[0]));
        } else {
          await compileAsync(spaOptions);
        }
      }
      break;
    case TYPE.BROWSER:
      await removeAsync(project.ws.distDir);
      if (project.ws.i18n) {
        for (const locale of project.ws.i18n.locales) {
          info(`...for locale ${locale}.`);
          await compileAsync(createLocaleSpecificOptions(browserOptions, locale));
          await compileAsync(createLocaleSpecificOptions(browserReleaseOptions, locale));
        }
        info(`...with all locales.`);
      }
      // even when we use locales, we create a default build containing *all* translations
      // users can select a locale with `window.process = { env: { LOCALE: 'en_GB' } };`, before they load
      // our component (this is mostly for users without build tools)
      await compileAsync(browserOptions);
      await compileAsync(browserReleaseOptions);
      break;
  }
};
