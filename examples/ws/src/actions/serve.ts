import { listenAsync } from '../lib/express';
import { project } from '../project';

export default async function serve(options) {
  if (options.production) {
    await listenAsync([], project.ws.distReleaseDir);
  } else {
    await listenAsync();
  }
};
