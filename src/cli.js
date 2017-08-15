import fs from 'fs-extra';
import commandLineArgs from 'command-line-args';
import generate from './generate';

function config(): Promise {
  return new Promise((resolve, reject) => {
    fs
      .writeJson('./config.json', {
        title : 'Amazing event',
        static: ['js', 'fonts', 'images'],
      })
      .then(resolve('Config created'))
      .catch(reject);
  });
}

const optionDefinitions = [
  {
    name : 'init',
    alias: 'i',
    type : Boolean,
  },
];

function init() {
  const options = commandLineArgs(optionDefinitions);
  if (options.init) {
    Promise.all([
      config(),
      fs.ensureDir('theme/js'),
      fs.ensureDir('theme/fonts'),
      fs.ensureDir('theme/images'),
      fs.ensureFile('theme/templates/schedule.hbs'),
      fs.ensureFile('theme/css/main.scss'),
      fs.ensureFile('source/index.json'),
    ])
      .then(console.log('theme created'))
      .catch(console.error);
  } else {
    generate().then(console.log).catch(console.error);
  }
}

export default init;
