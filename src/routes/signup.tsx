import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useKanban } from "@/store/kanban-store";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const login = useKanban((s) => s.login);
  const router = useRouter();

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-bold">F</div>
          <span className="font-semibold">FlowBoard</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-center">Create your workspace</h2>
        <p className="text-sm text-muted-foreground mt-1 text-center">Start collaborating in seconds.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(email || "demo@flowboard.app");
            toast.success(`Welcome, ${name || "friend"}!`);
            router.navigate({ to: "/board" });
          }}
          className="mt-8 space-y-4"
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40" />
          <input type="password" placeholder="Password" required minLength={8}
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40" />
          <button type="submit" className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            Create account
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
