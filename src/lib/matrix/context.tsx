import type { ReactNode } from '@tanstack/react-router';
import { type Dispatch, createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer';

import type { DecisionMatrix } from './types';

/** 空矩阵 */
export const emptyMatrix = Object.freeze<DecisionMatrix>({
  version: 0,
  name: 'Decision Matrix',
  fields: [],
  data: [],
});

/** 创建新矩阵 */
type CreationAction = {
  type: 'create';
};

/** 打开已有矩阵 */
type OpenAction = {
  type: 'open';
  data: DecisionMatrix;
};

/** 创建新字段 */
type NewFieldAction = {
  type: 'newField';
  /** 字段名 */
  fieldName?: string;
};

/** 动作 */
export type ActionType = CreationAction | OpenAction | NewFieldAction;

/** 决策矩阵 reducer */
const decisionMatrixReducer = (draft: DecisionMatrix, action: ActionType) => {
  switch (action.type) {
    case 'create':
      return emptyMatrix;

    case 'open':
      return action.data;

    case 'newField':
      draft.fields.push({
        name: action.fieldName ?? `Field ${draft.fields.length}`,
        type: 'text',
      });
      break;

    default:
      break;
  }
};

/** 当前决策矩阵 */
const DecisionMatrixContext = createContext<DecisionMatrix>(emptyMatrix);

/** 动作分发 */
const DecisionMatrixDispatchContext = createContext<Dispatch<ActionType>>(() => {});

/** 当前决策矩阵及动作分发提供者 */
export default function DecisionMatrixProivder({ children }: { children?: ReactNode }) {
  const [matrix, reducer] = useImmerReducer<DecisionMatrix, ActionType>(
    decisionMatrixReducer,
    emptyMatrix,
  );

  return (
    <DecisionMatrixContext.Provider value={matrix}>
      <DecisionMatrixDispatchContext.Provider value={reducer}>
        {children}
      </DecisionMatrixDispatchContext.Provider>
    </DecisionMatrixContext.Provider>
  );
}

/** 使用当前决策矩阵 */
export const useMatrix = () => useContext(DecisionMatrixContext);

/** 使用动作分发函数 */
export const useMatrixDispatch = () => useContext(DecisionMatrixDispatchContext);
