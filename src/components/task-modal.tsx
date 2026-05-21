import { useState, useEffect } from "react";
import { useKanban } from "@/store/kanban-store";
import { PRIORITY_META, STATUS_META, STATUS_ORDER, type Priority, type Status } from "@/lib/mock-data";
import { X, CalendarDays, Send, Paperclip, Upload } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";

export function TaskModal({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const { tasks, users, comments, updateTask, addComment } = useKanban();
  const task = tasks.find((t) => t.id === taskId);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [comment, setComment] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (task) { setTitle(task.title); setDescription(task.description); }
  }, [taskId]); // eslint-disable-line

  useEffect(() => {
    if (!comment) return setTyping(false);
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1200);
    return () => clearTimeout(t);
  }, [comment]);

  if (!task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 animate-fade-in-up">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-card border border-border card-shadow-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: STATUS_META[task.status].color }} />
            <span>{STATUS_META[task.status].label}</span>
            <span>·</span>
            <span>Created {formatDistanceToNowStrict(new Date(task.createdAt))} ago</span>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] overflow-y-auto">
          <div className="p-5 space-y-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => title.trim() && updateTask(task.id, { title: title.trim() })}
              className="w-full text-xl font-semibold bg-transparent focus:outline-none border-b border-transparent hover:border-border focus:border-border pb-1"
            />

            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => updateTask(task.id, { description })}
                rows={4}
                placeholder="Add more detail to this task…"
                className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Paperclip className="h-3.5 w-3.5" /> Attachments
              </label>
              <div className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center text-xs text-muted-foreground hover:bg-accent/30 transition cursor-pointer">
                <Upload className="h-4 w-4 mx-auto mb-1" />
                Drag files here or click to upload (UI only)
              </div>
              {task.attachments.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {task.attachments.map((a) => (
                    <li key={a.id} className="text-xs flex items-center gap-2 p-2 rounded bg-muted">
                      <Paperclip className="h-3 w-3" /> {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Comments</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {taskComments.map((c) => {
                  const u = users.find((x) => x.id === c.userId);
                  return (
                    <div key={c.id} className="flex gap-2.5">
                      <img src={u?.avatar} alt={u?.name} className="h-8 w-8 rounded-full bg-muted" />
                      <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-medium">{u?.name}</span>
                          <span className="text-[10px] text-muted-foreground">{formatDistanceToNowStrict(new Date(c.createdAt))} ago</span>
                        </div>
                        <p className="text-sm mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  );
                })}
                {taskComments.length === 0 && <p className="text-xs text-muted-foreground">Be the first to comment.</p>}
              </div>

              {typing && <div className="mt-2 text-[11px] text-muted-foreground italic">You are typing…</div>}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!comment.trim()) return;
                  addComment(task.id, comment.trim());
                  setComment("");
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment…"
                  className="flex-1 h-9 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                <button type="submit" className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </form>
            </div>
          </div>

          <aside className="border-t lg:border-t-0 lg:border-l border-border p-5 space-y-5 bg-muted/20">
            <Field label="Status">
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
                className="w-full h-9 px-2 rounded-md bg-background border border-border text-sm"
              >
                {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
              </select>
            </Field>

            <Field label="Priority">
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateTask(task.id, { priority: p })}
                    className={cn(
                      "text-xs px-2 py-1.5 rounded-md border transition",
                      task.priority === p ? PRIORITY_META[p].class + " ring-2 ring-ring/30" : "border-border text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {PRIORITY_META[p].label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Due date">
              <div className="relative">
                <CalendarDays className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : ""}
                  onChange={(e) => updateTask(task.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full h-9 pl-8 pr-2 rounded-md bg-background border border-border text-sm"
                />
              </div>
            </Field>

            <Field label="Assignees">
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {users.map((u) => {
                  const assigned = task.assigneeIds.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => updateTask(task.id, {
                        assigneeIds: assigned
                          ? task.assigneeIds.filter((id) => id !== u.id)
                          : [...task.assigneeIds, u.id],
                      })}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition",
                        assigned ? "bg-primary/10 text-foreground" : "hover:bg-accent"
                      )}
                    >
                      <div className="relative">
                        <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full bg-muted" />
                        {u.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />}
                      </div>
                      <span className="flex-1 truncate">{u.name}</span>
                      {assigned && <span className="text-[10px] text-primary font-medium">Assigned</span>}
                    </button>
                  );
                })}
              </div>
            </Field>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
