import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import requireAll from 'require-all';
import yaml from 'js-yaml';
import fm from 'json-matter';
import marked from 'marked';
import object from 'lodash/fp/object';
import checkJson from './checkEventJson';
import assets from './assets';

// Initialise variables
const config = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf8'));
const source = path.join(process.cwd(), config.source || 'source');
const outputDir = path.join(process.cwd(), config.output ? config.output.dir : 'public');

// Load all helper files
const helpers = requireAll({
  dirname    : path.join(process.cwd(), config.theme || 'theme', config.helper || 'helper'),
  excludeDirs: /^\.(git|svn)$/,
  recursive  : true,
});
Object.keys(helpers).forEach(helper => {
  Handlebars.registerHelper(helpers[helper]);
});

/**
 * Render pages with handle bar template
 **/
function render(url: string): Function {
  return async (page: ?{}): Promise => {
    try {
      const template = `${page.template || 'schedule'}.hbs`;
      // Load template and compile
      const filePath = path.join(
        process.cwd(),
        config.theme || 'theme',
        config.template || 'templates',
        template,
      );
      const output = Handlebars.compile(await fs.readFile(filePath, 'utf-8'))(page);
      await fs.ensureDir(outputDir);
      // if home page skip else create page dir
      const dir = url !== 'index' ? path.join(outputDir, url) : outputDir;
      await fs.ensureDir(dir);
      await fs.writeFile(path.join(dir, 'index.html'), output, 'utf8');
    } catch (err) {
      throw err;
    }
  };
}

/**
 * Generate a menu based on the file names in the pages dir
 * index.[md|json] is called Home
 **/
async function generateMenu(): Promise<Array<{ title: string, url: string }>> {
  try {
    const files = await fs.readdir(source);
    const filter = files.filter(file => file.substring(0, file.lastIndexOf('.')) !== 'index');
    const menu = filter.map(file => ({
      title: file.substring(0, file.lastIndexOf('.')),
      url  : file.substring(0, file.lastIndexOf('.')),
    }));
    menu.unshift({ title: 'Home', url: '' });
    return menu;
  } catch (err) {
    throw err;
  }
}

export default async function generate(configArgs: ?{}): Promise<string> {
  try {
    object.merge(config, configArgs);
    // Validate JSON against schema
    await checkJson(
      config.schema
        ? path.join(process.cwd(), config.schema)
        : path.join(__dirname, '..', 'schema.json'),
      source,
    );
    assets.staticMove(path.join(process.cwd(), config.theme || 'theme'), outputDir, config.static);
    const css = config.output && config.output.css ? config.output.css : 'main.css';
    assets.scss(
      `${process.cwd()}/${config.theme || 'theme'}/css/${config.css || 'main.scss'}`,
      `${outputDir}/css/${css}`,
    );
    // Generate Menu if not in Config
    if (!config.menu) config.menu = await generateMenu();
    const pages = await fs.readdir(source);
    pages.forEach(page => {
      const url = path.parse(page).name;
      fs
        .readFile(path.join(source, page), 'utf-8')
        .then(fm.parse)
        .then(file => {
          file.site = config;
          // render md in to html
          file.body = marked(file.__content__); // eslint-disable-line no-underscore-dangle
          return file;
        })
        .then(render(url))
        .catch(err => {
          throw err;
        });
    });
  } catch (err) {
    throw err;
  }
}
