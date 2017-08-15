import fs from 'fs-extra';
import glob from 'glob-promise';
import fm from 'json-matter';
import path from 'path';
import { validate as val } from 'jsonschema';

/**
 * Check json object against schema
 **/
const checkJson = (schema: ?{}, json: ?{}): Promise =>
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
async function validate(schemaPath: string, source: string): Promise {
  try {
    const schema = await fs.readJson(schemaPath);
    const files = await glob(path.join(source, '*.json'), { ignore: 'node_modules' });
    console.log(files);
    files.forEach(async i => {
      const data = await fs.readFile(i, 'utf-8');
      const file = fm.parse(data);
      const json = file.attributes;
      await checkJson(schema, json);
    });
  } catch (err) {
    throw err;
  }
}

export default { validate };
