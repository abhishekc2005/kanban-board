import { useState } from "react";
import { useKanban } from "@/store/kanban-store";
import { toast } from "sonner";
import { X } from "lucide-react";

const colors = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-amber-500 to-rose-500",
  "from-emerald-500 to-teal-400",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
];

export function CreateBoardModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0]);
  const createBoard = useKanban((s) => s.createBoard);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 animate-fade-in-up">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border card-shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Create a board</h2>
          <button onClick={() => onOpenChange(false)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            createBoard({ name: name.trim(), description: description.trim(), color });
            toast.success("Board created");
            setName(""); setDescription("");
            onOpenChange(false);
          }}
          className="p-5 space-y-4"
        >
          <div className={`h-24 rounded-xl bg-gradient-to-br ${color} card-shadow`} />
          <div>
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing Sprint"
              className="mt-1 w-full h-10 px-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Cover</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  type="button" key={c} onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-md bg-gradient-to-br ${c} border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="h-9 px-4 rounded-md text-sm hover:bg-accent">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Create board</button>
          </div>
        </form>
      </div>
    </div>
  );
}
