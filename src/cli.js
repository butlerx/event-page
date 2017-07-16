#!/usr/bin/env node
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
      .then(() => resolve('Config created'))
      .catch(reject);
  });
}

function file(arg: string): Promise {
  return new Promise((resolve, reject) => {
    fs.ensureFile(arg).then(() => resolve(`${arg} created`)).catch(reject);
  });
}

function folder(arg: string): Promise {
  return new Promise((resolve, reject) => {
    fs.ensureDir(arg).then(() => resolve(`${arg} created`)).catch(reject);
  });
}

const optionDefinitions = [
  {
    name : 'init',
    alias: 'i',
    type : Boolean,
  },
];
const options = commandLineArgs(optionDefinitions);

if (options.init) {
  config().then(console.log).catch(console.error);
  Promise.all([
    folder('theme/js'),
    folder('theme/fonts'),
    folder('theme/images'),
    file('theme/templates/schedule.hbs'),
    file('theme/css/main.scss'),
    file('source/index.json'),
  ])
    .then(console.log)
    .catch(console.error);
} else {
  generate().then(console.log).catch(console.error);
}
