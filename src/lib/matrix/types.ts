import { z } from 'zod/v4-mini';

const baseFieldSchema = z.object({
  id: z.uuid(),
  /** 名称 */
  name: z.string(),
  /** 类型：文本、日期、整数、小数、金额、列表 */
  type: z.enum(['text', 'date', 'int', 'float', 'money', 'list']),
  /** 显示精度，小数点后位数 */
  precision: z.optional(z.coerce.number().check(z.int(), z.gte(0))),
  /** 货币，3 字母大写 */
  currency: z.optional(z.string().check(z.toUpperCase(), z.length(3))),
});

/** 字段 */
export const fieldSchema = z.extend(baseFieldSchema, {
  /** 是否为主字段 */
  primary: z.optional(z.boolean()),
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
  /** 列表可选值 */
  values: z.optional(z.array(z.string())),
});

/** 字段 */
export type Field = z.infer<typeof fieldSchema>;

/** 带单位的值 */
const unitValueSchema = z.object({
  value: z.coerce.number(),
  unit: z.optional(z.string()),
});

/** 带单位的值 */
export type UnitValue = z.infer<typeof unitValueSchema>;

/** 数据值 */
export const dataValueSchema = z.union([z.string(), z.number(), unitValueSchema]);

/** 数据值 */
export type DataValue = z.infer<typeof dataValueSchema>;

/** 数据，键是 `id` 及各字段 ID */
export const dataSchema = z.record(z.string(), z.optional(dataValueSchema));

/** 数据 */
export type Data = z.infer<typeof dataSchema>;

/** 视图字段 */
export const viewFieldSchema = z.extend(baseFieldSchema, {
  /** 公式：`(data: Data) => string | number | UnitValue` */
  formula: z.string(),
  /** 单位 */
  unit: z.optional(z.string()),
});

/** 视图字段 */
export type ViewField = z.infer<typeof viewFieldSchema>;

/** 视图 */
export const viewSchema = z.object({
  id: z.uuid(),
  /** 名称 */
  name: z.string(),
  /** 数据方向，按列显示，按行显示 */
  dataOrientation: z.enum(['asColumn', 'asRow']),
  /** 字段定义 */
  fields: z.array(viewFieldSchema),
});

/** 视图 */
export type View = z.infer<typeof viewSchema>;

export const decisionMatrixSchema = z.object({
  /** 版本号 */
  version: z.literal(0),
  /** 名称 */
  name: z.string(),
  /** 字段列表 */
  fields: z.array(fieldSchema).check((ctx) => {
    const keys = new Set<string>();
    let primary = false;

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

      if (field.primary) {
        if (primary) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            message: `Duplicated primary field: ${field.name}`,
            continue: true,
          });
        } else {
          primary = true;
        }
      }
    }

    if (!primary) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        message: 'No primary field',
        continue: true,
      });
    }
  }),
  /** 数据列表 */
  data: z.array(dataSchema),
  /** 视图列表 */
  views: z.array(viewSchema),
});

/** 决策矩阵 */
export type DecisionMatrix = z.infer<typeof decisionMatrixSchema>;
