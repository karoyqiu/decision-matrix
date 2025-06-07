import { z } from 'zod/v4-mini';

const numericFieldSchema = z.object({
  /** 类型：整数、小数、金额 */
  type: z.enum(['int', 'float']),
  /** 可选单位列表，第一个为基准单位，如 `[g, kg]` */
  units: z.optional(z.array(z.string())),
  /**
   * 单位换算公式
   *
   * 一个包含构成函数定义的 JavaScript 语句的字符串。
   * 函数形式为 `(value: number, from: string, to: string) => number`，
   * 其中 `from` 和 `to` 是 `units` 中的一员。
   */
  convert: z.optional(z.string()),
  /** 数值计算公式 */
  formula: z.optional(z.string()),
  /** 显示精度，小数点后位数 */
  precision: z.optional(z.coerce.number().check(z.int(), z.gte(0))),
});

const moneyFieldSchema = z.object({
  /** 类型：金额 */
  type: z.literal('money'),
  /** 货币，3 字母大写 */
  currency: z._default(z.string().check(z.toUpperCase(), z.length(3)), 'CNY'),
  /** 数值计算公式 */
  formula: z.optional(z.string()),
});

const listFieldSchema = z.object({
  /** 类型：列表 */
  type: z.literal('list'),
  /** 列表可选值 */
  values: z.array(z.string()),
});

const otherFieldSchema = z.object({
  /** 类型：文字、日期 */
  type: z.enum(['text', 'date']),
});

/** 字段 */
export const fieldSchema = z.intersection(
  z.object({
    id: z.uuid(),
    /** 名称 */
    name: z.string(),
  }),
  z.discriminatedUnion('type', [
    numericFieldSchema,
    moneyFieldSchema,
    listFieldSchema,
    otherFieldSchema,
  ]),
);

/** 字段 */
export type Field = z.infer<typeof fieldSchema>;

/** 数据 */
export const dataSchema = z.record(
  z.string(),
  z.union([z.string(), z.int(), z.number(), z.date()]),
);

/** 数据 */
export type Data = z.infer<typeof dataSchema>;

export const decisionMatrixSchema = z.object({
  /** 版本号 */
  version: z.literal(0),
  /** 名称 */
  name: z.string(),
  /** 字段列表 */
  fields: z.array(fieldSchema).check((ctx) => {
    const keys = new Set<string>();

    for (const field of ctx.value) {
      if (keys.has(field.name)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          message: `Duplicated field name: ${field.name}`,
          continue: true,
        });
      }

      keys.add(field.name);
    }
  }),
  /** 数据列表 */
  data: z.array(dataSchema),
});

/** 决策矩阵 */
export type DecisionMatrix = z.infer<typeof decisionMatrixSchema>;
