import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Clock, Link2, PenSquare } from "lucide-react";
import MarkdownPreview from "@/components/editor/MarkdownPreview";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { blogService } from "@/services/blogService";
import { useAuth } from "@/context/AuthContext";
import type { Blog } from "@/types";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    blogService
      .getById(id!)
      .then(setBlog)
      .catch(() => {
        toast.error("Blog not found");
        navigate("/blogs");
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  }

  if (isLoading || !blog) {
    return (
      <main className="px-6 py-10 max-w-3xl mx-auto">
        <Skeleton className="h-64 mb-8" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-40" />
      </main>
    );
  }

  return (
    <main className="pb-16">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/60 bg-bg/80 backdrop-blur-md px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="rounded-xl p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Link2 className="h-4 w-4" /> Copy link
          </Button>
          <Button size="sm" onClick={() => navigate(`/editor/${blog._id}`)}>
            <PenSquare className="h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      {blog.coverImage && (
        <div className="max-w-4xl mx-auto mt-8 px-6">
          <img src={blog.coverImage} alt="" className="w-full h-72 object-cover rounded-3xl border border-border shadow-soft" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 mt-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{blog.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted mb-8">
          <span className="font-medium text-text">{user?.name}</span>
          <span>·</span>
          <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {blog.readingTime} min read
          </span>
        </div>

        <MarkdownPreview content={blog.content} />
      </div>
    </main>
  );
}
