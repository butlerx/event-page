const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');

/**
 * Copy static assets from theme to dist
 **/
function staticMove (source: string, dest: string, assets: Array<string>): void {
  for (const i in assets) {
    fs.copy(path.join(source, assets[i]), path.join(dest, assets[i]), err => {
      if (err) console.error(err);
    });
  }
}

/**
 * Compile scss assets
 */
function scss (source: string, dest: string): void {
  sass.render({
    file       : source,
    outFile    : dest,
    outputStyle: 'compressed',
  }, (err, result) => {
    if (err) console.error(err);
    fs.ensureFile(dest).then(() => {
      fs.writeFile(dest, result.css, (err) => {
        if (err) console.error(err);
      });
    })
    .catch(err => {
      console.error(err);
    });
  });
}

module.exports = { staticMove, scss };
