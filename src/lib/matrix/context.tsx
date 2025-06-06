import type { ReactNode } from '@tanstack/react-router';
import { type Dispatch, createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer';

import { save } from './file';
import type { DecisionMatrix, Field } from './types';

type MatrixState = {
  matrix: DecisionMatrix;
  filename: string;
};

/** 空矩阵 */
export const emptyMatrix = Object.freeze<DecisionMatrix>({
  version: 0,
  name: 'Decision Matrix',
  fields: [],
  data: [],
});

const initialState = Object.freeze<MatrixState>({
  matrix: emptyMatrix,
  filename: '',
});

/** 创建新矩阵 */
type CreationAction = {
  type: 'create';
};

/** 打开已有矩阵 */
type OpenAction = {
  type: 'open';
  state: MatrixState;
};

type SaveAction = {
  type: 'save';
};

/** 创建新字段 */
type NewFieldAction = {
  type: 'newField';
  /** 字段名 */
  fieldName?: string;
};

type UpdateFieldAction = {
  type: 'updateField';
  index: number;
  field: Field;
};

/** 动作 */
export type ActionType =
  | CreationAction
  | OpenAction
  | SaveAction
  | NewFieldAction
  | UpdateFieldAction;

/** 决策矩阵 reducer */
const decisionMatrixReducer = (draft: MatrixState, action: ActionType) => {
  switch (action.type) {
    case 'create':
      return initialState;

    case 'open':
      return action.state;

    case 'save':
      save(draft.matrix, draft.filename);
      break;

    case 'newField':
      draft.matrix.fields.push({
        name: action.fieldName ?? `Field ${draft.matrix.fields.length}`,
        type: 'text',
      });
      break;

    case 'updateField':
      draft.matrix.fields.splice(action.index, 1, action.field);
      break;

    default:
      throw new Error('Unknown action');
  }
};

/** 当前决策矩阵 */
const DecisionMatrixContext = createContext<MatrixState>(initialState);

/** 动作分发 */
const DecisionMatrixDispatchContext = createContext<Dispatch<ActionType>>(() => {});

/** 当前决策矩阵及动作分发提供者 */
export default function DecisionMatrixProivder({ children }: { children?: ReactNode }) {
  const [matrix, reducer] = useImmerReducer<MatrixState, ActionType>(
    decisionMatrixReducer,
    initialState,
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
