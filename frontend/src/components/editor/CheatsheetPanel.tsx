import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const CHEATSHEET: { syntax: string; result: string }[] = [
  { syntax: "# Heading 1", result: "Largest heading" },
  { syntax: "## Heading 2", result: "Section heading" },
  { syntax: "**bold**", result: "Bold text" },
  { syntax: "*italic*", result: "Italic text" },
  { syntax: "~~strike~~", result: "Strikethrough" },
  { syntax: "> quote", result: "Blockquote" },
  { syntax: "`code`", result: "Inline code" },
  { syntax: "```js ... ```", result: "Code block" },
  { syntax: "- item", result: "Bullet list" },
  { syntax: "1. item", result: "Numbered list" },
  { syntax: "- [ ] task", result: "Task list" },
  { syntax: "[text](url)", result: "Link" },
  { syntax: "![alt](url)", result: "Image" },
  { syntax: "| a | b |", result: "Table" },
  { syntax: "---", result: "Horizontal rule" },
];

export default function CheatsheetPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-sm border-l border-border bg-bg-raised shadow-soft overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
              <h2 className="text-lg font-semibold">Markdown cheatsheet</h2>
              <button
                onClick={onClose}
                aria-label="Close cheatsheet"
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-text transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {CHEATSHEET.map(({ syntax, result }) => (
                <div
                  key={syntax}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-surface/40 px-4 py-3"
                >
                  <code className="font-mono text-sm text-accent">{syntax}</code>
                  <span className="text-xs text-text-muted text-right">{result}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
