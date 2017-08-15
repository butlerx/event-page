import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import requireAll from 'require-all';
import fm from 'json-matter';
import marked from 'marked';
import object from 'lodash/fp/object';
import checkJson from './checkEventJson';
import assets from './assets';

// Initialise variables
const config = fs.readJson(path.join(process.cwd(), 'config.json'));
const source = path.join(process.cwd(), config.source || 'source');
const outputDir = config.output
  ? path.join(process.cwd(), config.output.dir)
  : path.join(process.cwd(), 'public');

// Load all helper files
const helpers = requireAll({
  dirname: path.join(
    process.cwd(),
    config.theme || 'theme',
    config.helper || 'helper',
    '**',
    '*.js',
  ),
  recursive: true,
});
Object.key(helpers).forEach(helper => {
  Handlebars.registerHelper(helpers[helper]);
});

/**
 * Render pages with handle bar template
 **/
async function render(templateFile: string, page: ?{}, url: string): Promise {
  try {
    const template = `${templateFile}.hbs`;
    // Load template and compile
    const filePath = path.join(
      process.cwd(),
      config.theme || 'theme',
      config.template || 'templates',
      template,
    );
    const output = Handlebars.compile(await fs.readFile(filePath, 'utf-8'))(page);
    await fs.endureDir(outputDir);
    // if home page skip else create page dir
    const dir = url !== 'index' ? path.join(outputDir, url) : outputDir;
    await fs.endureDir(dir);
    await fs.writeFile(path.join(dir, 'index.html'), output, 'utf8');
    return;
  } catch (err) {
    throw err;
  }
}

/**
 * Generate a menu based on the file names in the pages dir
 * index.[md|json] is called Home
 **/
async function generateMenu(): Promise<Array<{ title: string, url: string }>> {
  try {
    const menu = [];
    menu.push({ title: 'Home', url: '' });
    const files = await fs.readdir(source);
    files.forEach(file => {
      if (file.substring(0, file.lastIndexOf('.')) !== 'index') {
        menu.push({
          title: file.substring(0, file.lastIndexOf('.')),
          url  : file.substring(0, file.lastIndexOf('.')),
        });
      }
    });
    return menu;
  } catch (err) {
    throw err;
  }
}

async function generate(configArgs: ?{}): Promise<string> {
  try {
    object.merge(config, configArgs);
    // Validate JSON against schema
    const localSchema = '../schema.json';
    const schemaPath = config.schema ? path.join(process.cwd(), config.schema) : localSchema;
    await checkJson.validate(schemaPath, source);
    assets.staticMove(path.join(process.cwd(), config.theme || 'theme'), outputDir, config.static);
    const css = config.output ? config.output.css : 'main.css';
    assets.scss(
      `${process.cwd()}/${config.theme || 'theme'}/css/${config.css || 'main.scss'}`,
      `${outputDir}/css/${css}`,
    );
    // Generate Menu if not in Config
    if (!config.menu) config.menu = await generateMenu();
    const pages = await fs.readdir(source);
    pages.forEach(async page => {
      const url = path.parse(page).name;
      const data = await fs.readFile(path.join(source, page), 'utf-8');
      const file = fm.parse(data);
      file.site = config;
      // render md in to html
      file.body = marked(file.__content__); // eslint-disable-line no-underscore-dangle
      render(file.template || 'schedule', file, url);
    });
    return 'Generated';
  } catch (err) {
    throw err;
  }
}

export default generate;
