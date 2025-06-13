import { mapEntries } from 'radashi';
import { z } from 'zod/v4-mini';

import type { Data, Field, ViewField } from '@/lib/matrix/types';

/** 视图数据值 */
export const viewDataValueSchema = z.optional(z.union([z.string(), z.number()]));

/** 视图数据值 */
export type ViewDataValue = z.infer<typeof viewDataValueSchema>;

/** 视图数据 */
export const viewDataSchema = z.record(z.string(), viewDataValueSchema);

/** 视图数据 */
export type ViewData = z.infer<typeof viewDataSchema>;

/**
 * 将原始数据转换为可在视图中显示的数据。
 * @param fields 原始数据字段
 * @param data 原始数据
 * @returns 转换后的视图数据
 */
const wrapSingleData = (fields: Field[], data: Data) =>
  mapEntries(data, (key, value) => {
    const field = fields.find((field) => field.id === key);
    const k = field?.name ?? key;
    let v: ViewDataValue;

    if (typeof value === 'string' || typeof value === 'number') {
      if (field?.type === 'date') {
        v = new Date(value as number).toLocaleDateString();
      } else {
        v = value;
      }
    } else if (value) {
      // TODO: 单位转换
      v = value.value;
    }

    return [k, v];
  }) satisfies ViewData;

/**
 * 将原始数据转换为可在视图中显示的数据。
 * @param fields 原始数据字段
 * @param data 原始数据
 * @param viewFields 视图字段
 * @returns 转换后的视图数据，键为视图字段 ID
 */
export const wrapData = (fields: Field[], data: Data[], viewFields: ViewField[]) => {
  const formulas = viewFields.map(
    (field) => new Function('data', field.formula) as (data: ViewData) => ViewDataValue,
  );

  return data.map((d) => {
    const converted = wrapSingleData(fields, d);
    const vd: ViewData = {};

    for (let i = 0; i < viewFields.length; i++) {
      const field = viewFields[i];
      const formula = formulas[i];
      const calculated = formula(converted);
      const parsed = viewDataValueSchema.safeParse(calculated);

      if (parsed.data) {
        if (field.type === 'money' && typeof parsed.data === 'number') {
          vd[field.id] = Math.round(parsed.data * 100) / 100;
        } else {
          vd[field.id] = parsed.data;
        }
      }
    }

    return vd;
  });
};

export type BoundaryData = {
  lowest: Record<string, number>;
  highest: Record<string, number>;
};

/**
 * 计算视图数据中的最小与最大值。
 * @param viewFields 视图字段
 * @param data 视图数据
 * @returns 最小与最大值的视图数据
 */
export const calcBoundaryData = (viewFields: ViewField[], data: ViewData[]): BoundaryData => {
  const lowest: Record<string, number> = {};
  const highest: Record<string, number> = {};

  for (const field of viewFields) {
    if (field.colorScales && field.colorScales !== 'none') {
      lowest[field.id] = Number.MAX_VALUE;
      highest[field.id] = -Number.MAX_VALUE;

      for (const d of data) {
        const value = d[field.id];

        if (typeof value === 'number') {
          lowest[field.id] = Math.min(lowest[field.id], value);
          highest[field.id] = Math.max(highest[field.id], value);
        }
      }
    }
  }

  return { lowest, highest };
};

/*
const makeColorScales = (args: {
  lowest: string;
  medium: string;
  highest: string;
  light: number;
  dark: number;
  step: number;
}) => {
  const { lowest, medium, highest, light, dark, step } = args;
  const scales = [`bg-${lowest}-${light} dark:bg-${lowest}-${dark}`];

  for (let p = 100 - step; p > 0; p -= step) {
    scales.push(
      `bg-[color-mix(in_oklch,var(--color-${lowest}-${light})_${p}%,var(--color-${medium}-${light}))] dark:bg-[color-mix(in_oklch,var(--color-${lowest}-${dark})_${p}%,var(--color-${medium}-${dark}))]`,
    );
  }

  scales.push(`bg-${medium}-${light} dark:bg-${medium}-${dark}`);

  for (let p = 100 - step; p > 0; p -= step) {
    scales.push(
      `bg-[color-mix(in_oklch,var(--color-${medium}-${light})_${p}%,var(--color-${highest}-${light}))] dark:bg-[color-mix(in_oklch,var(--color-${medium}-${dark})_${p}%,var(--color-${highest}-${dark}))]`,
    );
  }

  scales.push(`bg-${highest}-${light} dark:bg-${highest}-${dark}`);

  console.log('const colorScales =', JSON.stringify(scales));
};

makeColorScales({
  lowest: 'green',
  medium: 'yellow',
  highest: 'red',
  light: 400,
  dark: 600,
  step: 10,
});
*/

const colorScales = [
  'bg-green-400 dark:bg-green-600',
  'bg-[color-mix(in_oklch,var(--color-green-400)_90%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_90%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_80%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_80%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_70%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_70%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_60%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_60%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_50%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_50%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_40%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_40%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_30%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_30%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_20%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_20%,var(--color-yellow-600))]',
  'bg-[color-mix(in_oklch,var(--color-green-400)_10%,var(--color-yellow-400))] dark:bg-[color-mix(in_oklch,var(--color-green-600)_10%,var(--color-yellow-600))]',
  'bg-yellow-400 dark:bg-yellow-600',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_90%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_90%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_80%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_80%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_70%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_70%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_60%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_60%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_50%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_50%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_40%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_40%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_30%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_30%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_20%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_20%,var(--color-red-600))]',
  'bg-[color-mix(in_oklch,var(--color-yellow-400)_10%,var(--color-red-400))] dark:bg-[color-mix(in_oklch,var(--color-yellow-600)_10%,var(--color-red-600))]',
  'bg-red-400 dark:bg-red-600',
];

/**
 * 根据值获取得分。
 * @param lowest 最低值
 * @param highest 最高值
 * @param value 当前值
 * @param lowerBetter 是否越低越好
 * @returns 得分，0 ~ 1
 */
export const getValueScore = (
  lowest: number,
  highest: number,
  value: number,
  lowerBetter: boolean,
) => {
  const total = highest - lowest;

  // 最低与最高值相同，则直接给最高分
  if (total < Number.MIN_VALUE) {
    return 1;
  }

  const diff = value - lowest;
  const score = diff / total;
  return lowerBetter ? 1 - score : score;
};

/**
 * 根据值获取色阶类名。
 * @param lowest 最低值
 * @param highest 最高值
 * @param value 当前值
 * @param lowerBetter 是否越低越好
 * @returns 色阶类名
 */
export const getColorScale = (
  lowest: number,
  highest: number,
  value: number,
  lowerBetter: boolean,
) => {
  const score = getValueScore(lowest, highest, value, lowerBetter);
  const n = Math.floor(score * (colorScales.length - 1));
  return colorScales[colorScales.length - 1 - n];
};
