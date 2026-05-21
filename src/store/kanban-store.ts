import { create } from "zustand";
import {
  mockBoards, mockTasks, mockUsers, mockComments, mockActivities,
  currentUser, type Board, type Task, type User, type Comment, type Activity, type Status, type Priority,
} from "@/lib/mock-data";

interface Filters {
  search: string;
  priority: Priority | "all";
  assigneeId: string | "all";
  dueSoon: boolean;
}

interface KanbanState {
  user: User | null;
  socketConnected: boolean;
  boards: Board[];
  tasks: Task[];
  users: User[];
  comments: Comment[];
  activities: Activity[];
  currentBoardId: string;
  filters: Filters;

  // auth
  login: (email: string) => void;
  logout: () => void;

  // boards
  setCurrentBoard: (id: string) => void;
  createBoard: (data: Pick<Board, "name" | "description"> & { color?: string }) => Board;

  // tasks
  createTask: (boardId: string, status: Status, title: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, toStatus: Status, toIndex: number) => void;

  // comments
  addComment: (taskId: string, text: string) => void;

  // filters
  setFilters: (patch: Partial<Filters>) => void;

  // socket sim
  setSocketConnected: (v: boolean) => void;
}

const palette = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-amber-500 to-rose-500",
  "from-emerald-500 to-teal-400",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
];

const pushActivity = (state: KanbanState, action: string, target: string): Activity[] => [
  {
    id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    boardId: state.currentBoardId,
    userId: state.user?.id ?? currentUser.id,
    action, target,
    createdAt: new Date().toISOString(),
  },
  ...state.activities,
].slice(0, 50);

export const useKanban = create<KanbanState>((set, get) => ({
  user: currentUser,
  socketConnected: true,
  boards: mockBoards,
  tasks: mockTasks,
  users: mockUsers,
  comments: mockComments,
  activities: mockActivities,
  currentBoardId: mockBoards[0].id,
  filters: { search: "", priority: "all", assigneeId: "all", dueSoon: false },

  login: (email) => {
    const found = get().users.find((u) => u.email === email) ?? { ...currentUser, email };
    set({ user: { ...found, online: true } });
  },
  logout: () => set({ user: null }),

  setCurrentBoard: (id) => set({ currentBoardId: id }),
  createBoard: ({ name, description, color }) => {
    const board: Board = {
      id: `b-${Date.now()}`,
      name, description,
      color: color ?? palette[get().boards.length % palette.length],
      memberIds: [get().user?.id ?? currentUser.id],
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ boards: [...s.boards, board], currentBoardId: board.id, activities: pushActivity(s, "created board", name) }));
    return board;
  },

  createTask: (boardId, status, title) => {
    const order = get().tasks.filter((t) => t.boardId === boardId && t.status === status).length;
    const task: Task = {
      id: `t-${Date.now()}`,
      boardId, status, title,
      description: "",
      priority: "medium",
      assigneeIds: [get().user?.id ?? currentUser.id],
      order,
      attachments: [],
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ tasks: [...s.tasks, task], activities: pushActivity(s, "created", title) }));
  },

  updateTask: (id, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      activities: pushActivity(s, "updated", s.tasks.find((t) => t.id === id)?.title ?? ""),
    })),

  deleteTask: (id) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      activities: pushActivity(s, "deleted", s.tasks.find((t) => t.id === id)?.title ?? ""),
    })),

  moveTask: (id, toStatus, toIndex) =>
    set((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task) return s;
      const fromStatus = task.status;
      const sameCol = fromStatus === toStatus;

      // Build column lists
      const colTasks = s.tasks
        .filter((t) => t.boardId === task.boardId && t.status === toStatus && t.id !== id)
        .sort((a, b) => a.order - b.order);
      colTasks.splice(toIndex, 0, { ...task, status: toStatus });

      const updatedCol = colTasks.map((t, i) => ({ ...t, order: i }));

      let next = s.tasks.map((t) => {
        if (t.id === id) return { ...t, status: toStatus };
        return t;
      });
      // apply order updates for target column
      next = next.map((t) => {
        const u = updatedCol.find((x) => x.id === t.id);
        return u ? { ...t, status: toStatus, order: u.order } : t;
      });
      // reorder old column if different
      if (!sameCol) {
        const oldCol = next
          .filter((t) => t.boardId === task.boardId && t.status === fromStatus)
          .sort((a, b) => a.order - b.order)
          .map((t, i) => ({ id: t.id, order: i }));
        next = next.map((t) => {
          const o = oldCol.find((x) => x.id === t.id);
          return o ? { ...t, order: o.order } : t;
        });
      }

      return {
        tasks: next,
        activities: sameCol ? s.activities : pushActivity(s, "moved", `${task.title} → ${toStatus.replace("_", " ")}`),
      };
    }),

  addComment: (taskId, text) =>
    set((s) => ({
      comments: [
        ...s.comments,
        { id: `c-${Date.now()}`, taskId, userId: s.user?.id ?? currentUser.id, text, createdAt: new Date().toISOString() },
      ],
      activities: pushActivity(s, "commented on", s.tasks.find((t) => t.id === taskId)?.title ?? ""),
    })),

  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  setSocketConnected: (v) => set({ socketConnected: v }),
}));
