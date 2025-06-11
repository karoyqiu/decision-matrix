import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/matrix/views/$viewId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/matrix/views/$viewId/edit"!</div>
}
