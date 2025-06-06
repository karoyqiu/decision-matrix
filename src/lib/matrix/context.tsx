import type { ReactNode } from '@tanstack/react-router';
import { type Dispatch, createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer';

import type { DecisionMatrix } from './types';

/** 空矩阵 */
const emptyMatrix = Object.freeze<DecisionMatrix>({
  version: 0,
  name: '',
  fields: [],
  data: [],
});

/** 当前决策矩阵 */
const DecisionMatrixContext = createContext<DecisionMatrix>(emptyMatrix);

/** 动作分发 */
const DecisionMatrixDispatchContext = createContext<Dispatch<CreationAction>>(() => {});

/** 创建新矩阵 */
type CreationAction = {
  type: 'create';
};

/** 动作 */
type ActionType = CreationAction;

/** 决策矩阵 reducer */
const decisionMatrixReducer = (draft: DecisionMatrix, action: ActionType) => {
  switch (action.type) {
    case 'create':
      return emptyMatrix;

    default:
      break;
  }
};

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
