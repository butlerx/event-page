import fs from 'fs-extra';
import commandLineArgs from 'command-line-args';
import generate from './generate';

function config(): Promise {
  return fs.writeJson('./config.json', {
    title : 'Amazing event',
    static: ['js', 'fonts', 'images'],
  });
}

export default async function init() {
  const options = commandLineArgs([
    {
      name : 'init',
      alias: 'i',
      type : Boolean,
    },
  ]);
  try {
    if (options.init) {
      await Promise.all([
        config(),
        fs.ensureDir('theme/js'),
        fs.ensureDir('theme/fonts'),
        fs.ensureDir('theme/images'),
        fs.ensureFile('theme/templates/schedule.hbs'),
        fs.ensureFile('theme/css/main.scss'),
        fs.ensureFile('source/index.json'),
      ]);
      console.log('theme created');
    } else {
      await generate();
    }
  } catch (err) {
    console.error(err);
  }
}
