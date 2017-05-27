const fs = require('fs-extra');
const commandLineArgs = require('command-line-args');

function config (): void {
  fs.writeJson('./config.json', {
    title : 'Amazing event',
    static: ['js', 'fonts', 'images'],
  }).then(() => {
    console.log('Config created');
  }).catch(err => {
    console.error(err);
  });
}

function file (arg: string): void {
  fs.ensureFile(arg).then(() => {
    console.log(`${arg} created`);
  }).catch(err => {
    console.error(err);
  });
}

function folder (arg: string): void {
  fs.ensureDir(arg).then(() => {
    console.log(`${arg} created`);
  }).catch(err => {
    console.error(err);
  });
}

const optionDefinitions = [
  { name: 'init', alias: 'i', type: Boolean },
];
const options = commandLineArgs(optionDefinitions);

if (options.init) {
  config();
  folder('theme/js');
  folder('theme/fonts');
  folder('theme/images');
  file('theme/templates/schedule.hbs');
  file('theme/css/main.scss');
  file('source/index.json');
} else {
  require('./generate')();
}
