import { useKanban } from "@/store/kanban-store";
import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutGrid, Plus, Search, Settings, LogOut, Sun, Moon, Wifi, WifiOff,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { CreateBoardModal } from "./create-board-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { boards, currentBoardId, setCurrentBoard, user, logout, socketConnected } = useKanban();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const filtered = boards.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform",
          "h-screen flex flex-col",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-bold">F</div>
          <div className="font-semibold tracking-tight">FlowBoard</div>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">v2</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search boards"
              className="w-full h-9 pl-8 pr-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> New board
          </button>
        </div>

        <div className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Boards</div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((b) => {
            const active = b.id === currentBoardId;
            return (
              <Link
                key={b.id}
                to="/board"
                onClick={() => { setCurrentBoard(b.id); setOpen(false); }}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                  active ? "bg-sidebar-accent text-foreground" : "hover:bg-sidebar-accent/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn("h-6 w-6 rounded-md bg-gradient-to-br shrink-0", b.color)} />
                <span className="truncate">{b.name}</span>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-xs text-muted-foreground text-center">No boards found.</p>
          )}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link to="/analytics" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60">
            <LayoutGrid className="h-4 w-4" /> Analytics
          </Link>
          <button onClick={toggle} className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border glass flex items-center gap-3 px-4 lg:px-6">
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden h-9 w-9 grid place-items-center rounded-md border border-border">
            <LayoutGrid className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className={cn("h-2 w-2 rounded-full", socketConnected ? "bg-success" : "bg-destructive")} />
            <span className="text-muted-foreground hidden sm:inline">
              {socketConnected ? "Live · Synced" : "Reconnecting…"}
            </span>
            {socketConnected ? <Wifi className="h-4 w-4 text-success sm:hidden" /> : <WifiOff className="h-4 w-4 text-destructive sm:hidden" />}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border hover:bg-accent transition">
                  <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full bg-muted" />
                  <span className="text-sm font-medium hidden sm:inline">{user.name.split(" ")[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover card-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <div className="p-3 border-b border-border">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => { logout(); router.navigate({ to: "/login" }); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent rounded-b-lg"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>

      {open && (
        <button
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <CreateBoardModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
