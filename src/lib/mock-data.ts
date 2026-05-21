export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in_progress" | "review" | "done";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  assigneeIds: string[];
  order: number;
  attachments: Attachment[];
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
  createdAt: string;
}

export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  action: string;
  target: string;
  createdAt: string;
}

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const mockUsers: User[] = [
  { id: "u1", name: "Alex Morgan", email: "alex@flowboard.app", avatar: avatar("alex"), online: true },
  { id: "u2", name: "Priya Shah", email: "priya@flowboard.app", avatar: avatar("priya"), online: true },
  { id: "u3", name: "Marcus Chen", email: "marcus@flowboard.app", avatar: avatar("marcus"), online: false },
  { id: "u4", name: "Sara Lopez", email: "sara@flowboard.app", avatar: avatar("sara"), online: true },
  { id: "u5", name: "Jordan Kim", email: "jordan@flowboard.app", avatar: avatar("jordan"), online: false },
];

export const currentUser: User = mockUsers[0];

export const mockBoards: Board[] = [
  {
    id: "b1",
    name: "Product Launch Q3",
    description: "Coordinate everything around the v2 launch.",
    color: "from-violet-500 to-fuchsia-500",
    memberIds: ["u1", "u2", "u3", "u4"],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "b2",
    name: "Marketing Sprint",
    description: "Campaigns, content and social.",
    color: "from-sky-500 to-cyan-400",
    memberIds: ["u1", "u2", "u5"],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "b3",
    name: "Design System",
    description: "Foundational tokens and components.",
    color: "from-amber-500 to-rose-500",
    memberIds: ["u1", "u4", "u3"],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

const mkTask = (
  id: string,
  boardId: string,
  title: string,
  status: Status,
  priority: Priority,
  order: number,
  assigneeIds: string[],
  description = "",
  daysOut = 5
): Task => ({
  id, boardId, title, description, status, priority, order, assigneeIds,
  attachments: [],
  dueDate: new Date(Date.now() + daysOut * 86400000).toISOString(),
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
});

export const mockTasks: Task[] = [
  mkTask("t1", "b1", "Finalize landing page hero copy", "todo", "high", 0, ["u2"], "Hero must communicate the new collaboration features in under 12 words.", 3),
  mkTask("t2", "b1", "Audit competitor pricing pages", "todo", "medium", 1, ["u4"], "Capture 5 competitors, screenshot above-the-fold.", 7),
  mkTask("t3", "b1", "Migrate analytics events to v2", "in_progress", "urgent", 0, ["u3", "u1"], "Replace legacy mixpanel keys.", 2),
  mkTask("t4", "b1", "Design empty states for boards", "in_progress", "low", 1, ["u4"], "", 6),
  mkTask("t5", "b1", "Review onboarding flow video", "review", "medium", 0, ["u1"], "Cut to 45s and add captions.", 1),
  mkTask("t6", "b1", "Ship dark mode toggle", "done", "high", 0, ["u3"], "Tokenized.", -1),
  mkTask("t7", "b1", "Set up status page", "done", "low", 1, ["u2"], "", -3),
  mkTask("t8", "b2", "Draft launch tweet thread", "todo", "high", 0, ["u2"], "", 2),
  mkTask("t9", "b2", "Book newsletter sponsor slot", "in_progress", "medium", 0, ["u5"], "", 5),
  mkTask("t10", "b2", "Approve final hero video", "review", "urgent", 0, ["u1"], "", 1),
  mkTask("t11", "b3", "Token contrast pass (WCAG AA)", "in_progress", "high", 0, ["u4"], "", 4),
  mkTask("t12", "b3", "Document button variants", "todo", "low", 0, ["u3"], "", 10),
];

export const mockComments: Comment[] = [
  { id: "c1", taskId: "t1", userId: "u2", text: "I'll have a first pass by EOD.", createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: "c2", taskId: "t1", userId: "u1", text: "Loop in Marcus for a tech-accuracy check.", createdAt: new Date(Date.now() - 1800_000).toISOString() },
  { id: "c3", taskId: "t3", userId: "u3", text: "Found a legacy event still firing on /pricing.", createdAt: new Date(Date.now() - 600_000).toISOString() },
];

export const mockActivities: Activity[] = [
  { id: "a1", boardId: "b1", userId: "u3", action: "moved", target: "Migrate analytics events to v2 → In Progress", createdAt: new Date(Date.now() - 1200_000).toISOString() },
  { id: "a2", boardId: "b1", userId: "u2", action: "commented on", target: "Finalize landing page hero copy", createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: "a3", boardId: "b1", userId: "u4", action: "created", target: "Design empty states for boards", createdAt: new Date(Date.now() - 86400_000).toISOString() },
  { id: "a4", boardId: "b1", userId: "u1", action: "completed", target: "Ship dark mode toggle", createdAt: new Date(Date.now() - 90000_000).toISOString() },
];

export const STATUS_META: Record<Status, { label: string; color: string }> = {
  todo: { label: "Todo", color: "var(--col-todo)" },
  in_progress: { label: "In Progress", color: "var(--col-progress)" },
  review: { label: "Review", color: "var(--col-review)" },
  done: { label: "Done", color: "var(--col-done)" },
};

export const STATUS_ORDER: Status[] = ["todo", "in_progress", "review", "done"];

export const PRIORITY_META: Record<Priority, { label: string; class: string }> = {
  low:    { label: "Low",    class: "bg-info/10 text-info border-info/20" },
  medium: { label: "Medium", class: "bg-warning/10 text-warning border-warning/30" },
  high:   { label: "High",   class: "bg-primary/10 text-primary border-primary/20" },
  urgent: { label: "Urgent", class: "bg-destructive/10 text-destructive border-destructive/20" },
};
