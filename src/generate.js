/* @flow */
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const fm = require('json-matter');
const marked = require('marked');
const checkJson = require('./checkEventJson');
const config = require(path.join(process.cwd(), 'config.json'));
const source = path.join(process.cwd(), config.source || 'source');
const outputDir = path.join(process.cwd(), config.output || 'public');

// Load all helper files
glob.sync(path.join(process.cwd(), config.theme || 'theme', config.helper || 'helper', '**', '*.js')).forEach(file => {
  Handlebars.registerHelper(require(path.resolve(file)));
});

/**
 * Render pages with handle bar template
 **/
function render (template: string, page: {}, url: string) {
  template = `${template}.hbs`;
  // Load template and compile
  const output = Handlebars.compile(fs.readFileSync(path.join(process.cwd(), config.theme || 'theme', config.template || 'templates', template), 'utf-8'))(page);
  // Create output dir if it doesnt exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  let dir = outputDir;
  // if home page skip else create page dir
  if (url !== 'index') {
    dir = path.join(dir, url);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  fs.writeFile(path.join(dir, 'index.html'), output, 'utf8', err => {
    if (err) throw err;
  });
}

/**
 * Generate a menu based on the file names in the pages dir
 * index.[md|json] is called Home
 **/
function generateMenu () {
  config.menu = [];
  config.menu.push({
    title: 'Home',
    url  : '',
  });
  fs.readdirSync(source).forEach(file => {
    if (file.substring(0, file.lastIndexOf('.')) !== 'index') {
      console.log(file);
      config.menu.push({
        title: file.substring(0, file.lastIndexOf('.')),
        url  : file.substring(0, file.lastIndexOf('.')),
      });
    }
  });
}

module.exports = () => {
  // Validate JSON against schema
  checkJson.validate(path.join(process.cwd(), config.schema) || './schema.json');
  // Generate Menu if not in Config
  if (!config.menu) {
    generateMenu();
  }
  fs.readdir(source, (err, pages) => {
    if (err) throw err;
    for (const page of pages) {
      const url = path.parse(page).name;
      fs.readFile(path.join(source, page), 'utf-8', (err, data) => {
        if (err) throw err;
        const file = fm.parse(data);
        file.site = config;
        // render md in to html
        file.body = marked(file.__content__);
        render(file.template || 'schedule', file, url);
      });
    }
  });
};
