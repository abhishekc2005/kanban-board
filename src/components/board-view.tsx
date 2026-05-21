import { useState, useMemo } from "react";
import { useKanban } from "@/store/kanban-store";
import { STATUS_ORDER, type Status, PRIORITY_META, type Priority } from "@/lib/mock-data";
import { KanbanColumn } from "./kanban-column";
import { TaskModal } from "./task-modal";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent, closestCorners,
} from "@dnd-kit/core";
import { TaskCard } from "./task-card";
import { Search, Filter, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityPanel } from "./activity-panel";

export function BoardView() {
  const { tasks, boards, currentBoardId, users, filters, setFilters, moveTask } = useKanban();
  const board = boards.find((b) => b.id === currentBoardId);
  const members = users.filter((u) => board?.memberIds.includes(u.id));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showActivity, setShowActivity] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (t.boardId !== currentBoardId) return false;
      if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.assigneeId !== "all" && !t.assigneeIds.includes(filters.assigneeId)) return false;
      if (filters.dueSoon && t.dueDate) {
        const days = (new Date(t.dueDate).getTime() - Date.now()) / 86400000;
        if (days > 3) return false;
      }
      return true;
    });
  }, [tasks, currentBoardId, filters]);

  const byStatus = useMemo(() => {
    const map: Record<Status, typeof tasks> = { todo: [], in_progress: [], review: [], done: [] };
    filtered.forEach((t) => map[t.status].push(t));
    (Object.keys(map) as Status[]).forEach((s) => map[s].sort((a, b) => a.order - b.order));
    return map;
  }, [filtered]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = String(over.id);
    let toStatus: Status;
    let toIndex: number;

    if (overId.startsWith("col-")) {
      toStatus = overId.replace("col-", "") as Status;
      toIndex = byStatus[toStatus].length;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      toStatus = overTask.status;
      const colTasks = byStatus[toStatus];
      toIndex = colTasks.findIndex((t) => t.id === overTask.id);
      if (toIndex < 0) toIndex = colTasks.length;
    }

    if (activeTask.status === toStatus && activeTask.order === toIndex) return;
    moveTask(activeTask.id, toStatus, toIndex);
  }

  if (!board) return <div className="p-8 text-muted-foreground">Select a board.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Board header */}
      <div className="px-4 lg:px-6 py-4 border-b border-border bg-background/50">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br", board.color)} />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold truncate">{board.name}</h1>
              <p className="text-xs text-muted-foreground truncate">{board.description}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <div className="flex -space-x-2">
              {members.map((m) => (
                <div key={m.id} className="relative" title={`${m.name}${m.online ? " · Online" : ""}`}>
                  <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full bg-muted border-2 border-background" />
                  <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background", m.online ? "bg-success" : "bg-muted-foreground/40")} />
                </div>
              ))}
              <button className="h-8 w-8 rounded-full border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:bg-accent" title="Invite members">
                <Users className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => setShowActivity((v) => !v)}
              className={cn("h-9 px-3 rounded-md border border-border text-sm hover:bg-accent transition", showActivity && "bg-accent")}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search tasks"
              className="w-full h-9 pl-8 pr-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value as Priority | "all" })}
            className="h-9 px-2 rounded-md bg-background border border-border text-sm"
          >
            <option value="all">All priorities</option>
            {(Object.keys(PRIORITY_META) as Priority[]).map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
          </select>
          <select
            value={filters.assigneeId}
            onChange={(e) => setFilters({ assigneeId: e.target.value })}
            className="h-9 px-2 rounded-md bg-background border border-border text-sm"
          >
            <option value="all">All assignees</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button
            onClick={() => setFilters({ dueSoon: !filters.dueSoon })}
            className={cn(
              "h-9 px-3 rounded-md border text-sm inline-flex items-center gap-1.5 transition",
              filters.dueSoon ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-accent"
            )}
          >
            <Filter className="h-3.5 w-3.5" /> Due soon
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 p-4 lg:p-6 h-full min-w-max">
              {STATUS_ORDER.map((s) => (
                <KanbanColumn key={s} status={s} tasks={byStatus[s]} onEdit={setEditingId} />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? <div className="w-80 rotate-3"><TaskCard task={activeTask} onEdit={() => {}} /></div> : null}
            </DragOverlay>
          </DndContext>
        </div>

        {showActivity && <ActivityPanel onClose={() => setShowActivity(false)} />}
      </div>

      {editingId && <TaskModal taskId={editingId} onClose={() => setEditingId(null)} />}
    </div>
  );
}
