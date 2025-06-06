import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { EJSON } from 'bson';

import { type DecisionMatrix, decisionMatrixSchema } from './types';

/**
 * 将决策矩阵保存至文件。
 * @param matrix 要保存的决策矩阵
 * @param filename 要保存到的文件名
 */
export const save = (matrix: DecisionMatrix, filename: string) =>
  writeTextFile(filename, EJSON.stringify(matrix));

/**
 * 从文件中加载决策矩阵。
 * @param filename 要加载的文件名
 */
export const load = async (filename: string) => {
  const text = await readTextFile(filename);
  const obj = EJSON.parse(text);
  return decisionMatrixSchema.safeParse(obj);
};
