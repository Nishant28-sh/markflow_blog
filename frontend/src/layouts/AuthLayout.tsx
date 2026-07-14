import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Feather } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const SAMPLE = `# Ship your ideas

Write in **Markdown**, preview it live, and
publish in seconds.

- Split-pane editor
- Syntax highlighting
- Autosave every 5s

\`\`\`js
function ship(idea) {
  return idea.polish().publish();
}
\`\`\`
`;

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-bg">
      <div className="relative hidden lg:flex flex-col justify-center px-16 overflow-hidden border-r border-border/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgb(var(--color-primary) / 0.3), transparent 45%), radial-gradient(circle at 80% 70%, rgb(var(--color-secondary) / 0.22), transparent 45%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center gap-2 mb-10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow">
            <Feather className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">MarkFlow</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 glass-card p-6 max-w-md"
        >
          <div className="flex items-center gap-1.5 mb-4">
            <span className="h-3 w-3 rounded-full bg-danger/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-accent/70" />
            <span className="ml-3 text-xs font-mono text-text-faint">draft.md</span>
          </div>
          <pre className="font-mono text-sm text-text-muted whitespace-pre-wrap leading-relaxed">
            {SAMPLE}
          </pre>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 mt-8 max-w-sm text-text-muted"
        >
          A focused writing surface for developers who blog — live preview, real syntax
          highlighting, zero clutter.
        </motion.p>
      </div>

      <div className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
