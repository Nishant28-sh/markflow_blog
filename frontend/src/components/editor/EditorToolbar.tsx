import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  Code,
  Code2,
  Table,
  ListChecks,
  Minus,
  ListOrdered,
  List,
  ImageIcon,
  Link2,
  Heading1,
  Heading2,
  Maximize2,
  Minimize2,
  Keyboard,
} from "lucide-react";
import clsx from "@/utils/clsx";

export type FormatAction =
  | "h1"
  | "h2"
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "quote"
  | "code"
  | "codeblock"
  | "table"
  | "task"
  | "hr"
  | "ol"
  | "ul"
  | "image"
  | "link";

interface EditorToolbarProps {
  onAction: (action: FormatAction) => void;
  onToggleFullscreen: () => void;
  onToggleCheatsheet: () => void;
  isFullscreen: boolean;
}

const groups: { action: FormatAction; icon: typeof Bold; label: string }[][] = [
  [
    { action: "h1", icon: Heading1, label: "Heading 1" },
    { action: "h2", icon: Heading2, label: "Heading 2" },
  ],
  [
    { action: "bold", icon: Bold, label: "Bold (Ctrl+B)" },
    { action: "italic", icon: Italic, label: "Italic (Ctrl+I)" },
    { action: "underline", icon: Underline, label: "Underline" },
    { action: "strike", icon: Strikethrough, label: "Strikethrough" },
  ],
  [
    { action: "quote", icon: Quote, label: "Quote" },
    { action: "code", icon: Code, label: "Inline code" },
    { action: "codeblock", icon: Code2, label: "Code block" },
  ],
  [
    { action: "ul", icon: List, label: "Bullet list" },
    { action: "ol", icon: ListOrdered, label: "Numbered list" },
    { action: "task", icon: ListChecks, label: "Task list" },
  ],
  [
    { action: "table", icon: Table, label: "Table" },
    { action: "hr", icon: Minus, label: "Horizontal rule" },
    { action: "image", icon: ImageIcon, label: "Image" },
    { action: "link", icon: Link2, label: "Link" },
  ],
];

export default function EditorToolbar({
  onAction,
  onToggleFullscreen,
  onToggleCheatsheet,
  isFullscreen,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-bg-raised/60 px-3 py-2 overflow-x-auto">
      {groups.map((group, i) => (
        <div key={i} className={clsx("flex items-center gap-0.5", i > 0 && "border-l border-border/60 pl-1.5 ml-1")}>
          {group.map(({ action, icon: Icon, label }) => (
            <button
              key={action}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => onAction(action)}
              className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      ))}

      <div className="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          title="Markdown cheatsheet (Ctrl+/)"
          aria-label="Markdown cheatsheet"
          onClick={onToggleCheatsheet}
          className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
        >
          <Keyboard className="h-4 w-4" />
        </button>
        <button
          type="button"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen (Ctrl+Shift+P)"}
          aria-label="Toggle fullscreen"
          onClick={onToggleFullscreen}
          className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
