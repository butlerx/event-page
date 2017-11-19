import fs from 'fs-extra';
import glob from 'glob-promise';
import fm from 'json-matter';
import path from 'path';
import { validate as val } from 'jsonschema';

/**
 * Check json object against schema
 **/
const checkJson = (schema: ?{}): Function => async (json: ?{}): Promise => {
  try {
    delete json.__contet__; // eslint-disable-line no-underscore-dangle
    val(json, schema, { throwError: true });
  } catch (err) {
    throw err;
  }
};

/**
 * Validate all json files obey the schema
 **/
export default async function validate(schemaPath: string, source: string): Promise {
  try {
    const schema = await fs.readJson(schemaPath);
    const files = await glob(path.join(source, '*.json'), { ignore: 'node_modules' });
    files.forEach(file =>
      fs.readFile(file, 'utf-8').then(fm.parse).then(checkJson(schema)).catch(err => {
        throw err;
      }),
    );
  } catch (err) {
    throw err;
  }
}
