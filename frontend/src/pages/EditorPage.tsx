import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, Upload } from "lucide-react";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import StatsPill from "@/components/editor/StatsPill";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { blogService } from "@/services/blogService";
import { useAutosave } from "@/hooks/useAutosave";
import { computeTextStats } from "@/utils/markdownFormatting";
import type { Blog } from "@/types";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isNew) return;
    blogService
      .getById(id!)
      .then((data) => {
        setBlog(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(() => {
        toast.error("Blog not found");
        navigate("/blogs");
      })
      .finally(() => setIsLoading(false));
  }, [id, isNew, navigate]);

  const persist = useCallback(
    async (nextContent: string) => {
      if (isNew) {
        if (!blog) {
          const created = await blogService.create({ title: title || "Untitled Blog", content: nextContent });
          setBlog(created);
          navigate(`/editor/${created._id}`, { replace: true });
        }
        return;
      }
      if (blog) {
        const updated = await blogService.update(blog._id, { content: nextContent });
        setBlog(updated);
      }
    },
    [blog, isNew, title, navigate]
  );

  const saveStatus = useAutosave(content, persist, 5000);

  async function handleTitleBlur() {
    if (blog) {
      const updated = await blogService.update(blog._id, { title });
      setBlog(updated);
    }
  }

  async function handlePublish() {
    setIsPublishing(true);
    try {
      let target = blog;
      if (!target) {
        target = await blogService.create({ title: title || "Untitled Blog", content });
      }
      const updated = await blogService.update(target._id, {
        title,
        content,
        published: true,
        isDraft: false,
      });
      setBlog(updated);
      toast.success("Blog published");
      navigate(`/preview/${updated._id}`);
    } catch {
      toast.error("Could not publish");
    } finally {
      setIsPublishing(false);
    }
  }

  const stats = computeTextStats(content);

  if (isLoading) {
    return (
      <main className="px-6 py-8 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-[70vh]" />
      </main>
    );
  }

  return (
    <main className="px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/blogs")}
          aria-label="Back to blogs"
          className="rounded-xl p-2 text-text-muted hover:bg-surface hover:text-text transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Untitled Blog"
          aria-label="Blog title"
          className="flex-1 bg-transparent text-2xl font-bold tracking-tight focus:outline-none placeholder:text-text-faint"
        />
        <div className="flex items-center gap-2">
          {blog && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/preview/${blog._id}`)}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
          )}
          <Button size="sm" onClick={handlePublish} isLoading={isPublishing}>
            <Upload className="h-4 w-4" /> Publish
          </Button>
        </div>
      </div>

      <MarkdownEditor content={content} onChange={setContent} />
      <StatsPill words={stats.words} characters={stats.characters} readingTime={stats.readingTime} saveStatus={saveStatus} />
    </main>
  );
}
