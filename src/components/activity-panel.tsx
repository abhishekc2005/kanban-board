import { useKanban } from "@/store/kanban-store";
import { formatDistanceToNowStrict } from "date-fns";
import { X, Activity as ActivityIcon } from "lucide-react";

export function ActivityPanel({ onClose }: { onClose: () => void }) {
  const { activities, users, currentBoardId } = useKanban();
  const items = activities.filter((a) => a.boardId === currentBoardId);

  return (
    <aside className="w-80 shrink-0 border-l border-border bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4 flex items-center gap-2">
        <ActivityIcon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Activity</h3>
        <button onClick={onClose} className="ml-auto h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
          <X className="h-4 w-4" />
        </button>
      </div>
      <ol className="p-4 space-y-4">
        {items.map((a) => {
          const u = users.find((x) => x.id === a.userId);
          return (
            <li key={a.id} className="flex gap-3">
              <img src={u?.avatar} alt={u?.name} className="h-8 w-8 rounded-full bg-muted shrink-0" />
              <div className="text-xs">
                <p>
                  <span className="font-medium text-foreground">{u?.name}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-muted-foreground mt-0.5">{formatDistanceToNowStrict(new Date(a.createdAt))} ago</p>
              </div>
            </li>
          );
        })}
        {items.length === 0 && <p className="text-xs text-muted-foreground">No activity yet.</p>}
      </ol>
    </aside>
  );
}
