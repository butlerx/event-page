const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');

/**
 * Copy static assets from theme to dist
 **/
function staticMove (source: string, dest: string, assets: Array<string>): void {
  for (const i in assets) {
    fs.copy(path.join(process.cwd(), source, i), path.join(process.cwd(), dest, i), err => {
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
  });
}

module.exports = { staticMove, scss };
