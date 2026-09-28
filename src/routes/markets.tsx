import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/markets")({
  component: MarketsLayout,
});

function MarketsLayout() {
  return <Outlet />;
}
