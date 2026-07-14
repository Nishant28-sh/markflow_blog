import { useEffect, useState } from "react";
import { FileText, PenSquare, CheckCircle2, Type } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/dashboard/StatCard";
import BlogCard from "@/components/blog/BlogCard";
import Skeleton from "@/components/ui/Skeleton";
import { blogService } from "@/services/blogService";
import type { Blog, BlogStats } from "@/types";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [recent, setRecent] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, { blogs }] = await Promise.all([
          blogService.stats(),
          blogService.list({ status: "all", page: 1 }),
        ]);
        setStats(statsData);
        setRecent(blogs.slice(0, 4));
      } catch {
        toast.error("Could not load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    await blogService.remove(id);
    setRecent((prev) => prev.filter((b) => b._id !== id));
    toast.success("Blog deleted");
  }

  async function handleDuplicate(id: string) {
    const copy = await blogService.duplicate(id);
    setRecent((prev) => [copy, ...prev]);
    toast.success("Blog duplicated");
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-text-muted mb-8">Here's what's happening with your writing.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {isLoading || !stats ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
          ) : (
            <>
              <StatCard label="Total Blogs" value={stats.total} icon={FileText} accent="primary" delay={0} />
              <StatCard label="Drafts" value={stats.drafts} icon={PenSquare} accent="warning" delay={0.05} />
              <StatCard label="Published" value={stats.published} icon={CheckCircle2} accent="accent" delay={0.1} />
              <StatCard label="Total Words" value={stats.totalWords.toLocaleString()} icon={Type} accent="secondary" delay={0.15} />
            </>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent blogs</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass-card p-10 text-center text-text-muted">
            No blogs yet — create your first one to see it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.map((blog, i) => (
              <BlogCard key={blog._id} blog={blog} index={i} onDelete={handleDelete} onDuplicate={handleDuplicate} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
