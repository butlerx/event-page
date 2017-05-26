/* @flow */
const fs = require('fs');
const glob = require('glob');
const fm = require('json-matter');
const path = require('path');
const validate = require('jsonschema').validate;
const config = require(path.join(process.cwd(), 'config.json'));

module.exports = {
  /**
   * Validate all json files obey  the schema
   **/
  validate (schemaPath: string) {
    glob(
      path.join(process.cwd(), config.source, '*.json'),
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
            checkJson(i, json, schemaPath);
          });
        }
      }
    );
  },
};

/**
 * Check json object against schema
 **/
function checkJson (filename: string, json: {}, schemaPath: string): boolean {
  const schema = require(schemaPath);
  try {
    validate(json, schema, { throwError: true });
    return true;
  } catch (err) {
    if (err) throw err;
    console.error(filename, err);
    return false;
  }
}
