const fs = require('fs');
const glob = require('glob');
const fm = require('json-matter');
const path = require('path');
const val = require('jsonschema').validate;

let schema;

/**
 * Check json object against schema
 **/
const checkJson = (filename: string, json: ?{}): Promise =>
  new Promise((resolve, reject) => {
    try {
      val(json, schema, { throwError: true });
      resolve();
    } catch (err) {
      reject(err);
    }
  });

/**
 * Validate all json files obey the schema
 **/
function validate(schemaPath: string, source: string): Promise {
  schema = require(schemaPath); // eslint-disable-line
  return new Promise((resolve, reject) => {
    glob(
      path.join(source, '*.json'),
      {
        ignore: 'node_modules',
      },
      (err, files) => {
        if (err) reject(err);
        files.forEach(i => {
          fs.readFile(i, 'utf-8', (err, data) => {
            if (err) throw err;
            const file = fm.parse(data);
            const json = file.attributes;
            checkJson(i, json).catch(reject);
          });
        });
        resolve();
      },
    );
  });
}

module.exports = { validate };
