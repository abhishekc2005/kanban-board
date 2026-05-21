import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useKanban } from "@/store/kanban-store";
import { useMemo } from "react";
import { STATUS_META, STATUS_ORDER } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { TrendingUp, CheckCircle2, Clock, ListTodo } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !useKanban.getState().user) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <AppShell>
      <AnalyticsPage />
    </AppShell>
  ),
});

function AnalyticsPage() {
  const { tasks, currentBoardId, boards } = useKanban();
  const board = boards.find((b) => b.id === currentBoardId);
  const boardTasks = tasks.filter((t) => t.boardId === currentBoardId);

  const stats = useMemo(() => {
    const total = boardTasks.length;
    const done = boardTasks.filter((t) => t.status === "done").length;
    const inProgress = boardTasks.filter((t) => t.status === "in_progress").length;
    const overdue = boardTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;
    return { total, done, inProgress, overdue, completion: total ? Math.round((done / total) * 100) : 0 };
  }, [boardTasks]);

  const byStatus = STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    value: boardTasks.filter((t) => t.status === s).length,
    color: STATUS_META[s].color,
  }));

  const byPriority = ["urgent", "high", "medium", "low"].map((p) => ({
    name: p,
    count: boardTasks.filter((t) => t.priority === p).length,
  }));

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-6xl">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Analytics</p>
        <h1 className="text-2xl font-semibold tracking-tight">{board?.name}</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ListTodo className="h-4 w-4" />} label="Total tasks" value={stats.total} />
        <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Completed" value={stats.done} accent="success" />
        <StatCard icon={<Clock className="h-4 w-4" />} label="In progress" value={stats.inProgress} accent="warning" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Completion" value={`${stats.completion}%`} accent="info" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold mb-1">Board progress</h3>
        <p className="text-xs text-muted-foreground mb-4">{stats.done} of {stats.total} tasks done</p>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all" style={{ width: `${stats.completion}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <h3 className="text-sm font-semibold mb-4">Tasks by status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {byStatus.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center text-xs">
            {byStatus.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} <span className="text-muted-foreground">({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <h3 className="text-sm font-semibold mb-4">Tasks by priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPriority}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: "success" | "warning" | "info" }) {
  const color = accent === "success" ? "text-success" : accent === "warning" ? "text-warning" : accent === "info" ? "text-info" : "text-primary";
  return (
    <div className="rounded-xl border border-border bg-card p-4 card-shadow">
      <div className={`inline-flex items-center gap-1.5 text-xs ${color}`}>{icon} {label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
