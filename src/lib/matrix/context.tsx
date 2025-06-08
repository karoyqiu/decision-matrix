import type { ReactNode } from '@tanstack/react-router';
import { type Dispatch, createContext, useCallback, useContext, useState } from 'react';
import { useImmerReducer } from 'use-immer';

import { load as loadMatrix, save as saveMatrix } from './file';
import type { DecisionMatrix, Field } from './types';

/** 空矩阵 */
export const emptyMatrix = Object.freeze<DecisionMatrix>({
  version: 0,
  name: 'Decision Matrix',
  fields: [],
  data: [],
});

/** 重置矩阵 */
type ResetAction = {
  type: 'reset';
  matrix?: DecisionMatrix;
};

/** 添加字段 */
type AddFieldAction = {
  type: 'addField';
  /** 字段 */
  field: Field;
};

/** 更新字段 */
type UpdateFieldAction = {
  type: 'updateField';
  /** 字段索引 */
  index: number;
  /** 更新后的值 */
  field: Field;
};

/** 移动字段 */
type MoveFieldAction = {
  type: 'moveField';
  /** 从索引 */
  from: number;
  /** 到索引 */
  to: number;
};

/** 删除字段 */
type DeleteFieldAction = {
  type: 'deleteField';
  /** 字段索引 */
  index: number;
};

/** 添加数据 */
type AddDataAction = {
  type: 'addData';
  /** 数据 ID */
  dataId: string;
};

/** 动作 */
export type ActionType =
  | ResetAction
  | AddFieldAction
  | UpdateFieldAction
  | MoveFieldAction
  | DeleteFieldAction
  | AddDataAction;

/** 决策矩阵 reducer */
const decisionMatrixReducer = (draft: DecisionMatrix, action: ActionType) => {
  switch (action.type) {
    case 'reset':
      return action.matrix ?? emptyMatrix;

    case 'addField':
      draft.fields.push({
        ...action.field,
        id: window.crypto.randomUUID(),
      });
      break;

    case 'updateField':
      if (action.field.primary) {
        draft.fields = draft.fields.map((field, index) =>
          index === action.index
            ? action.field
            : {
                ...field,
                primary: false,
              },
        );
      } else {
        draft.fields.splice(action.index, 1, action.field);
      }
      break;

    case 'moveField':
      {
        const field = draft.fields.splice(action.from, 1);
        draft.fields.splice(action.to, 0, ...field);
      }
      break;

    case 'deleteField':
      draft.fields.splice(action.index, 1);
      break;

    case 'addData':
      draft.data.push({ id: action.dataId });
      break;

    default:
      throw new Error('Unknown action');
  }
};

type MatrixState = {
  /** 当前决策矩阵 */
  matrix: DecisionMatrix;
  /** 创建决策矩阵文件 */
  create: (filename: string) => Promise<void>;
  /** 保存决策矩阵文件 */
  save: () => Promise<void>;
  /** 加载决策矩阵文件 */
  load: (filename: string) => Promise<void>;
};

/** 当前决策矩阵 */
const DecisionMatrixContext = createContext<MatrixState>({
  matrix: emptyMatrix,
  create: () => Promise.reject(),
  save: () => Promise.reject(),
  load: () => Promise.reject(),
});

/** 动作分发 */
const DecisionMatrixDispatchContext = createContext<Dispatch<ActionType>>(() => {});

/** 当前决策矩阵及动作分发提供者 */
export default function DecisionMatrixProivder({ children }: { children?: ReactNode }) {
  const [matrix, dispatch] = useImmerReducer<DecisionMatrix, ActionType>(
    decisionMatrixReducer,
    emptyMatrix,
  );
  const [filename, setFilename] = useState('');

  const create = useCallback(async (path: string) => {
    await saveMatrix(emptyMatrix, path);
    dispatch({ type: 'reset' });
    setFilename(path);
  }, []);

  const save = useCallback(async () => saveMatrix(matrix, filename), [matrix, filename]);

  const load = useCallback(async (path: string) => {
    const m = await loadMatrix(path);
    dispatch({ type: 'reset', matrix: m });
    setFilename(path);
  }, []);

  return (
    <DecisionMatrixContext.Provider value={{ matrix, create, save, load }}>
      <DecisionMatrixDispatchContext.Provider value={dispatch}>
        {children}
      </DecisionMatrixDispatchContext.Provider>
    </DecisionMatrixContext.Provider>
  );
}

/** 使用当前决策矩阵 */
export const useMatrix = () => useContext(DecisionMatrixContext);

export const useMatrixData = (dataId: string) => {
  const { matrix } = useMatrix();
  const data = matrix.data.find((d) => d.id === dataId);
  return data;
};

/** 使用动作分发函数 */
export const useMatrixDispatch = () => useContext(DecisionMatrixDispatchContext);
