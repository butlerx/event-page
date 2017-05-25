const fs = require('fs');
const glob = require('glob');
const fm = require('json-front-matter');
const path = require('path');
const validate = require('jsonschema').validate;
const config = require(path.join(process.cwd(), 'config.json'));
let schemaPath = '../schema.json';
if (config.schema) {
  schemaPath = path.join(process.cwd(), config.schema);
}
const schema = require(schemaPath);

module.exports = {
  validate () {
    glob(
      path.join(process.cwd(), config.source, '*'),
      {
        ignore: 'node_modules',
      },
      (err, files) => {
        if (err) throw err;
        for (const i of files) {
          fs.readFile(i, 'utf-8', (err, data) => {
            if (err) throw err;
            const file = fm.parse(data);
            const json = file.attributes;
            if (json.template === 'schedule') {
              checkJson(i, json);
            }
          });
        }
      }
    );
  },
};

function checkJson (filename, json) {
  try {
    validate(json, schema, { throwError: true });
  } catch (err) {
    console.error(filename, err);
    process.exit(1);
  }
}
