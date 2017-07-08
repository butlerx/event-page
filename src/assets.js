const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');

/**
 * Copy static assets from theme to dist
 **/
function staticMove(source: string, dest: string, assets: Array<string>): Promise {
  return new Promise((resolve, reject) => {
    assets.forEach(i => {
      fs.copy(path.join(source, assets[i]), path.join(dest, assets[i]), err => {
        if (err) reject(err);
      });
    });
    resolve();
  });
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
        fs
          .ensureFile(dest)
          .then(() => {
            fs.writeFile(dest, result.css, err => {
              if (err) reject(err);
              resolve();
            });
          })
          .catch(reject);
      },
    );
  });
}

module.exports = { staticMove, scss };
