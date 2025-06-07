import { readFile, writeFile } from '@tauri-apps/plugin-fs';
import { deserialize, serialize } from 'bson';

import { type DecisionMatrix, decisionMatrixSchema } from './types';

/**
 * 将决策矩阵保存至文件。
 * @param matrix 要保存的决策矩阵
 * @param filename 要保存到的文件名
 */
export const save = (matrix: DecisionMatrix, filename: string) => {
  const verified = decisionMatrixSchema.parse(matrix);
  const bytes = serialize(verified, { ignoreUndefined: true });
  return writeFile(filename, bytes);
};

/**
 * 从文件中加载决策矩阵。
 * @param filename 要加载的文件名
 */
export const load = async (filename: string) => {
  const bytes = await readFile(filename);
  const obj = deserialize(bytes);
  return decisionMatrixSchema.parse(obj);
};
