import { debug } from 'loglevel';
import { join } from 'path';
import { get } from 'https';
import { outputFileAsync, removeAsync } from 'fs-extra-promise';
import urlTemplate from 'url-template';
import { project } from '../project';
import { concatLanguages } from '../lib/i18n';

const IGNORED_CONTENTS = [
  '404: Not Found\n' // e.g. used by raw.githubusercontent.com
];

function importTranslation(locale: string, feature: string) {
  const url = urlTemplate.parse(project.ws.i18n.importUrl)
    .expand({ locale, feature });
  const outputPath = join(process.cwd(), project.ws.i18n.dir, feature, `${locale}.properties`);

  debug(`Import from ${url}.`);

  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let body = '';
      res.on('data', (data) => body = body + data);
      res.on('error', (err) => console.log(err));
      res.on('end', () => {
        if (IGNORED_CONTENTS.some((content) => body === content)) {
          resolve();
        } else {
          outputFileAsync(outputPath, body).then(() => resolve()).catch(reject);
        }
      });
    }).on('error', reject);
  });
}

export default async function i18nImport() {
  const features = project.ws.i18n.features || [ '' ];
  const locales = project.ws.i18n.locales;
  const localesAndLanguages = concatLanguages(locales);

  await removeAsync(project.ws.i18n.dir);
  const importPromises = [];
  features.forEach(feature => localesAndLanguages.forEach(localeOrLanguage => {
    importPromises.push(importTranslation(localeOrLanguage, feature));
  }));

  await Promise.all(importPromises);
};
