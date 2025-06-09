import { readFile, readTextFile, writeFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { BSON, EJSON } from 'bson';
import { isNullish } from 'radashi';

import { type DecisionMatrix, decisionMatrixSchema } from './types';

/**
 * 将决策矩阵保存至文件。
 * @param matrix 要保存的决策矩阵
 * @param filename 要保存到的文件名
 */
export const save = (matrix: DecisionMatrix, filename: string) => {
  const verified = decisionMatrixSchema.parse(matrix);

  if (filename.endsWith('.json')) {
    const text = EJSON.stringify(
      verified,
      (_key, value) => (isNullish(value) ? undefined : value),
      2,
      {
        legacy: false,
        relaxed: true,
        useBigInt64: true,
      },
    );
    return writeTextFile(filename, text);
  }

  const bytes = BSON.serialize(verified, { ignoreUndefined: true });
  return writeFile(filename, bytes);
};

/**
 * 从文件中加载决策矩阵。
 * @param filename 要加载的文件名
 */
export const load = async (filename: string) => {
  let obj;

  if (filename.endsWith('.json')) {
    const text = await readTextFile(filename);
    obj = EJSON.parse(text, { legacy: false, relaxed: true, useBigInt64: true });
  } else {
    const bytes = await readFile(filename);
    obj = BSON.deserialize(bytes);
  }

  return decisionMatrixSchema.parse(obj);
};
