import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BoardView } from "@/components/board-view";
import { useKanban } from "@/store/kanban-store";

export const Route = createFileRoute("/board")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !useKanban.getState().user) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <AppShell>
      <BoardView />
    </AppShell>
  ),
});
