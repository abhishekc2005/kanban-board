import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useKanban } from "@/store/kanban-store";
import { toast } from "sonner";
import { mockUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState(mockUsers[0].email);
  const [password, setPassword] = useState("demo1234");
  const login = useKanban((s) => s.login);
  const router = useRouter();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary-glow to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-white/20 grid place-items-center font-bold">F</div>
          <span className="font-semibold">FlowBoard</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Real-time Kanban<br />for teams that ship.
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            Drag, drop, collaborate, and watch updates appear instantly across every device.
          </p>
        </div>
        <p className="relative text-xs text-primary-foreground/70">© FlowBoard · Built for collaboration</p>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your workspace.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email);
              toast.success("Signed in");
              router.navigate({ to: "/board" });
            }}
            className="mt-8 space-y-4"
          >
            <Field label="Email">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </Field>
            <Field label="Password">
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </Field>
            <button type="submit" className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            New here? <Link to="/signup" className="text-primary font-medium">Create an account</Link>
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            Demo: any email works. JWT-ready auth flow is wired in the store.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
