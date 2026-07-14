import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import toast from "react-hot-toast";
import EditorToolbar, { type FormatAction } from "./EditorToolbar";
import MarkdownPreview from "./MarkdownPreview";
import CheatsheetPanel from "./CheatsheetPanel";
import { applyFormat, computeTextStats } from "@/utils/markdownFormatting";
import { blogService } from "@/services/blogService";
import clsx from "@/utils/clsx";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cheatsheetOpen, setCheatsheetOpen] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const stats = computeTextStats(content);

  const runFormat = useCallback(
    (action: FormatAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const { selectionStart, selectionEnd } = textarea;
      const result = applyFormat(action, content, selectionStart, selectionEnd);
      onChange(result.text);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    },
    [content, onChange]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const isMod = e.ctrlKey || e.metaKey;
    if (!isMod) return;

    if (e.key.toLowerCase() === "b") {
      e.preventDefault();
      runFormat("bold");
    } else if (e.key.toLowerCase() === "i") {
      e.preventDefault();
      runFormat("italic");
    } else if (e.key === "/") {
      e.preventDefault();
      setCheatsheetOpen((v) => !v);
    } else if (e.shiftKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      setIsFullscreen((v) => !v);
    }
  }

  async function insertImageFromFile(file: File) {
    const toastId = toast.loading("Uploading image...");
    try {
      const url = await blogService.uploadImage(file);
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? content.length;
      const end = textarea?.selectionEnd ?? content.length;
      const snippet = `![${file.name}](${url})`;
      onChange(content.slice(0, start) + snippet + content.slice(end));
      toast.success("Image uploaded", { id: toastId });
    } catch {
      toast.error("Image upload failed", { id: toastId });
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.items)
      .find((item) => item.type.startsWith("image/"))
      ?.getAsFile();
    if (file) {
      e.preventDefault();
      insertImageFromFile(file);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (file) insertImageFromFile(file);
  }

  function startResize() {
    isResizing.current = true;
    function onMove(e: MouseEvent) {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(80, Math.max(20, pct)));
    }
    function onUp() {
      isResizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      className={clsx(
        "flex flex-col glass-panel overflow-hidden",
        isFullscreen ? "fixed inset-4 z-50" : "h-[70vh] min-h-[500px]"
      )}
    >
      <EditorToolbar
        onAction={runFormat}
        onToggleFullscreen={() => setIsFullscreen((v) => !v)}
        onToggleCheatsheet={() => setCheatsheetOpen((v) => !v)}
        isFullscreen={isFullscreen}
      />

      <div ref={containerRef} className="flex flex-1 min-h-0 relative">
        <div
          className={clsx(
            "flex flex-col min-w-0 border-r border-border/60 relative",
            isDraggingImage && "ring-2 ring-primary ring-inset"
          )}
          style={{ width: `${splitPercent}%` }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingImage(true);
          }}
          onDragLeave={() => setIsDraggingImage(false)}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Start writing in Markdown... drop an image, or paste one from your clipboard."
            spellCheck
            aria-label="Markdown content editor"
            className="flex-1 resize-none bg-transparent px-6 py-5 font-mono text-sm leading-relaxed text-text placeholder:text-text-faint focus:outline-none"
          />
          {isDraggingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/80 text-sm text-primary font-medium pointer-events-none">
              Drop image to upload
            </div>
          )}
        </div>

        <button
          aria-label="Resize editor panes"
          onMouseDown={startResize}
          className="w-1.5 shrink-0 cursor-col-resize bg-transparent hover:bg-primary/40 transition-colors"
        />

        <div className="flex-1 min-w-0 overflow-y-auto" style={{ width: `${100 - splitPercent}%` }}>
          <MarkdownPreview content={content} />
        </div>
      </div>

      <CheatsheetPanel isOpen={cheatsheetOpen} onClose={() => setCheatsheetOpen(false)} />
    </div>
  );
}
