import { useState } from "react";
import { useKanban } from "@/store/kanban-store";
import { STATUS_META, type Status, type Task } from "@/lib/mock-data";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  status, tasks, onEdit,
}: {
  status: Status;
  tasks: Task[];
  onEdit: (id: string) => void;
}) {
  const meta = STATUS_META[status];
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { createTask, currentBoardId } = useKanban();

  return (
    <div className="flex flex-col w-72 sm:w-80 shrink-0 rounded-xl bg-muted/40 border border-border">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
        <h3 className="text-sm font-semibold">{meta.label}</h3>
        <span className="text-xs text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5">{tasks.length}</span>
        <button
          onClick={() => setAdding(true)}
          className="ml-auto h-7 w-7 grid place-items-center rounded-md hover:bg-accent text-muted-foreground"
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 min-h-[60vh] transition-colors rounded-b-xl",
          isOver && "bg-accent/40"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onEdit={onEdit} />
          ))}
        </SortableContext>

        {adding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) { setAdding(false); return; }
              createTask(currentBoardId, status, title.trim());
              setTitle("");
              setAdding(false);
            }}
            className="rounded-xl bg-card border border-border p-2 card-shadow"
          >
            <textarea
              autoFocus value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => { if (!title.trim()) setAdding(false); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); (e.target as HTMLTextAreaElement).form?.requestSubmit(); } }}
              placeholder="What needs to be done?"
              rows={2}
              className="w-full text-sm bg-transparent resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-2 mt-1">
              <button type="button" onClick={() => { setAdding(false); setTitle(""); }} className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground font-medium">Add</button>
            </div>
          </form>
        )}

        {!adding && tasks.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-8 border border-dashed border-border rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
