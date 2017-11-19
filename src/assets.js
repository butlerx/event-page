import fs from 'fs-extra';
import path from 'path';
import sass from 'node-sass';

/**
 * Copy static assets from theme to dist
 **/
function staticMove(source: string, dest: string, assets: Array<string>): Promise {
  assets.forEach(folder => {
    fs.copy(path.join(source, folder), path.join(dest, folder));
  });
  return Promise.resolve();
}

/**
 * Compile scss assets
 */
function scss(source: string, dest: string): Promise {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file       : source,
        outFile    : dest,
        outputStyle: 'compressed',
      },
      (err, result) => {
        if (err) reject(err);
        fs.ensureFile(dest).then(fs.writeFile(dest, result.css)).then(resolve).catch(reject);
      },
    );
  });
}

export default { staticMove, scss };
