import { PRIORITY_META, type Task } from "@/lib/mock-data";
import { useKanban } from "@/store/kanban-store";
import { formatDistanceToNowStrict, format, isPast } from "date-fns";
import { CalendarDays, MessageSquare, Paperclip, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export function TaskCard({ task, onEdit }: { task: Task; onEdit: (id: string) => void }) {
  const { users, comments, deleteTask } = useKanban();
  const assignees = users.filter((u) => task.assigneeIds.includes(u.id));
  const taskComments = comments.filter((c) => c.taskId === task.id);
  const pr = PRIORITY_META[task.priority];
  const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== "done";

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group rounded-xl bg-card border border-border p-3 card-shadow hover:card-shadow-lg hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <h4 className="text-sm font-medium leading-snug flex-1">{task.title}</h4>
        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit(task.id); }}
            className="h-6 w-6 grid place-items-center rounded hover:bg-accent text-muted-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
            className="h-6 w-6 grid place-items-center rounded hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border", pr.class)}>
          {pr.label}
        </span>
        {task.dueDate && (
          <span className={cn(
            "inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded",
            overdue ? "text-destructive bg-destructive/10" : "text-muted-foreground"
          )}>
            <CalendarDays className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {assignees.slice(0, 3).map((u) => (
            <img key={u.id} src={u.avatar} alt={u.name} title={u.name} className="h-6 w-6 rounded-full bg-muted border-2 border-card" />
          ))}
          {assignees.length === 0 && (
            <span className="text-[10px] text-muted-foreground">Unassigned</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {taskComments.length > 0 && (
            <span className="inline-flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{taskComments.length}</span>
          )}
          {task.attachments.length > 0 && (
            <span className="inline-flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{task.attachments.length}</span>
          )}
          <span>{formatDistanceToNowStrict(new Date(task.createdAt))}</span>
        </div>
      </div>
    </div>
  );
}
