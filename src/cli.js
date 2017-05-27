const generate = require('./generate');
const fs = require('fs-extra');

const commandLineArgs = require('command-line-args');

module.exports = () => {
  const optionDefinitions = [
    { name: 'init', alias: 'i', type: Boolean },
  ];
  const options = commandLineArgs(optionDefinitions);

  if (options.init) {
    config();
    folder('theme/js');
    folder('theme/fonts');
    folder('theme/images');
    folder('theme/templates');
    file('theme/css/main.scss');
    file('source/index.json');
  } else {
    generate();
  }
};

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
