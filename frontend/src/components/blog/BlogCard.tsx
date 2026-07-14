import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Copy, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Blog } from "@/types";
import clsx from "@/utils/clsx";

interface BlogCardProps {
  blog: Blog;
  index: number;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function statusBadge(blog: Blog) {
  if (blog.archived) return { label: "Archived", classes: "bg-text-faint/15 text-text-muted" };
  if (blog.published) return { label: "Published", classes: "bg-accent/15 text-accent" };
  return { label: "Draft", classes: "bg-warning/15 text-warning" };
}

export default function BlogCard({ blog, index, onDelete, onDuplicate }: BlogCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const badge = statusBadge(blog);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card overflow-hidden group relative"
    >
      <Link to={`/editor/${blog._id}`} className="block">
        <div className="h-36 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent relative overflow-hidden">
          {blog.coverImage ? (
            <img src={blog.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-text-faint text-xs font-mono">
              No cover image
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", badge.classes)}>{badge.label}</span>
          </div>
          <h3 className="font-semibold text-text truncate">{blog.title || "Untitled Blog"}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-faint">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {blog.readingTime} min read
            </span>
            <span>{blog.wordCount} words</span>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen((v) => !v);
          }}
          aria-label="Blog actions"
          className="rounded-lg bg-bg/70 backdrop-blur-sm p-1.5 text-text-muted opacity-0 group-hover:opacity-100 hover:text-text transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-40 glass-panel bg-surface shadow-soft py-1 z-10">
            <button
              onClick={() => {
                setMenuOpen(false);
                onDuplicate(blog._id);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(blog._id);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
