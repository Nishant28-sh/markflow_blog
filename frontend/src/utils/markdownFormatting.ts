import type { FormatAction } from "@/components/editor/EditorToolbar";

interface WrapResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

function wrapSelection(value: string, start: number, end: number, before: string, after = before): WrapResult {
  const selected = value.slice(start, end);
  const text = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    text,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selected.length,
  };
}

function prefixLines(value: string, start: number, end: number, prefix: string): WrapResult {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const withPrefix = block
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
  const text = value.slice(0, lineStart) + withPrefix + value.slice(lineEnd);
  return {
    text,
    selectionStart: lineStart,
    selectionEnd: lineStart + withPrefix.length,
  };
}

function insertAtCursor(value: string, start: number, end: number, snippet: string): WrapResult {
  const text = value.slice(0, start) + snippet + value.slice(end);
  return { text, selectionStart: start + snippet.length, selectionEnd: start + snippet.length };
}

export function applyFormat(action: FormatAction, value: string, start: number, end: number): WrapResult {
  switch (action) {
    case "h1":
      return prefixLines(value, start, end, "# ");
    case "h2":
      return prefixLines(value, start, end, "## ");
    case "bold":
      return wrapSelection(value, start, end, "**");
    case "italic":
      return wrapSelection(value, start, end, "_");
    case "underline":
      return wrapSelection(value, start, end, "<u>", "</u>");
    case "strike":
      return wrapSelection(value, start, end, "~~");
    case "quote":
      return prefixLines(value, start, end, "> ");
    case "code":
      return wrapSelection(value, start, end, "`");
    case "codeblock":
      return insertAtCursor(value, start, end, "\n```js\n" + (value.slice(start, end) || "code here") + "\n```\n");
    case "ul":
      return prefixLines(value, start, end, "- ");
    case "ol":
      return prefixLines(value, start, end, "1. ");
    case "task":
      return prefixLines(value, start, end, "- [ ] ");
    case "table":
      return insertAtCursor(
        value,
        start,
        end,
        "\n| Column A | Column B |\n| --- | --- |\n| value | value |\n"
      );
    case "hr":
      return insertAtCursor(value, start, end, "\n---\n");
    case "link":
      return insertAtCursor(value, start, end, `[${value.slice(start, end) || "link text"}](https://)`);
    case "image":
      return insertAtCursor(value, start, end, "![alt text](https://)");
    default:
      return { text: value, selectionStart: start, selectionEnd: end };
  }
}

export function computeTextStats(content: string) {
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = content.length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, characters, readingTime };
}
