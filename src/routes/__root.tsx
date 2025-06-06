import { Outlet, createRootRoute } from '@tanstack/react-router';

import { TooltipProvider } from '@/components/ui/tooltip';
import DecisionMatrixProivder from '@/lib/matrix/context';

export const Route = createRootRoute({
  component: () => (
    <TooltipProvider>
      <DecisionMatrixProivder>
        <Outlet />
      </DecisionMatrixProivder>
    </TooltipProvider>
  ),
});
