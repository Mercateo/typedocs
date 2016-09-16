import { debug } from 'loglevel';
import sauceConnectLauncher, { SauceConnectOptions, SauceConnectProcess } from 'sauce-connect-launcher';

export function launchSauceConnect(options: SauceConnectOptions): Promise<SauceConnectProcess> {
  debug('Tries to launch Sauce Connect.');
  return new Promise<SauceConnectProcess>((resolve, reject) => {
    sauceConnectLauncher(options, (err, sauceConnectProcess) => {
      if (err) {
        reject(err);
      } else {
        debug('Launched Sauce Connect.');
        resolve(sauceConnectProcess);
      }
    });
  });
}

