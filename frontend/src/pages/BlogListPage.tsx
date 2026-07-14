import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import BlogCard from "@/components/blog/BlogCard";
import Skeleton from "@/components/ui/Skeleton";
import { blogService } from "@/services/blogService";
import { useDebounce } from "@/hooks/useDebounce";
import type { Blog, BlogStatusFilter } from "@/types";
import clsx from "@/utils/clsx";

const TABS: { value: BlogStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [status, setStatus] = useState<BlogStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setIsLoading(true);
    blogService
      .list({ status, page, search: debouncedSearch || undefined })
      .then(({ blogs: results, meta }) => {
        setBlogs(results);
        setPages(meta?.pages || 1);
      })
      .catch(() => toast.error("Could not load blogs"))
      .finally(() => setIsLoading(false));
  }, [status, page, debouncedSearch]);

  async function handleDelete(id: string) {
    await blogService.remove(id);
    setBlogs((prev) => prev.filter((b) => b._id !== id));
    toast.success("Blog deleted");
  }

  async function handleDuplicate(id: string) {
    const copy = await blogService.duplicate(id);
    setBlogs((prev) => [copy, ...prev]);
    toast.success("Blog duplicated");
  }

  return (
    <>
      <Navbar onSearch={setSearch} />
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6">All Blogs</h1>

        <div className="flex gap-2 mb-6 border-b border-border/60 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={clsx(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                status === tab.value ? "bg-primary/10 text-primary border border-primary/30 font-semibold" : "text-text-muted hover:bg-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="glass-card p-10 text-center text-text-muted">
            {debouncedSearch ? `No blogs match "${debouncedSearch}".` : "No blogs in this category yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {blogs.map((blog, i) => (
              <BlogCard key={blog._id} blog={blog} index={i} onDelete={handleDelete} onDuplicate={handleDuplicate} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={clsx(
                  "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                  page === i + 1 ? "bg-primary text-white" : "text-text-muted hover:bg-surface"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
