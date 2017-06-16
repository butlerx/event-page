const fs = require('fs');
const glob = require('glob');
const fm = require('json-matter');
const path = require('path');
const val = require('jsonschema').validate;

/**
 * Validate all json files obey the schema
 **/
function validate (schemaPath: string, source: string) {
  glob(path.join(source, '*.json'), {
    ignore: 'node_modules',
  }, (err, files) => {
    if (err) throw err;
    for (const i of files) {
      fs.readFile(i, 'utf-8', (err, data) => {
        if (err) throw err;
        const file = fm.parse(data);
        const json = file.attributes;
        checkJson(i, json, schemaPath);
      });
    }
  });
}

/**
 * Check json object against schema
 **/
const checkJson = (filename: string, json: ?{}, schemaPath: string): Promise => {
  return new Promise((resolve, reject) => {
    const schema = require(schemaPath);
    try {
      val(json, schema, { throwError: true });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { validate };
