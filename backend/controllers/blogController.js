import Blog from "../models/Blog.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// @route GET /api/blogs?status=draft|published|archived&page=&limit=&search=
export const getBlogs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const query = { author: req.user._id };

  if (status === "draft") query.isDraft = true;
  if (status === "published") query.published = true;
  if (status === "archived") query.archived = true;
  else if (!status) query.archived = { $ne: true };

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Blog.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: blogs,
    meta: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// @route GET /api/blogs/stats  (dashboard analytics)
export const getBlogStats = asyncHandler(async (req, res) => {
  const authorId = req.user._id;
  const [total, drafts, published, archived, blogs] = await Promise.all([
    Blog.countDocuments({ author: authorId }),
    Blog.countDocuments({ author: authorId, isDraft: true, archived: { $ne: true } }),
    Blog.countDocuments({ author: authorId, published: true }),
    Blog.countDocuments({ author: authorId, archived: true }),
    Blog.find({ author: authorId }).select("wordCount"),
  ]);

  const totalWords = blogs.reduce((sum, b) => sum + (b.wordCount || 0), 0);

  res.json({
    success: true,
    data: { total, drafts, published, archived, totalWords },
  });
});

// @route GET /api/blogs/:id
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
  if (!blog) throw new ApiError(404, "Blog not found");
  res.json({ success: true, data: blog });
});

// @route POST /api/blogs
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, coverImage, tags } = req.body;
  const blog = await Blog.create({
    title: title || "Untitled Blog",
    content: content || "",
    coverImage: coverImage || "",
    tags: tags || [],
    author: req.user._id,
  });
  res.status(201).json({ success: true, data: blog });
});

// @route PUT /api/blogs/:id
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
  if (!blog) throw new ApiError(404, "Blog not found");

  const { title, content, coverImage, tags, isDraft, published, archived } = req.body;

  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (coverImage !== undefined) blog.coverImage = coverImage;
  if (tags !== undefined) blog.tags = tags;
  if (isDraft !== undefined) blog.isDraft = isDraft;
  if (published !== undefined) blog.published = published;
  if (archived !== undefined) blog.archived = archived;

  await blog.save();
  res.json({ success: true, data: blog });
});

// @route DELETE /api/blogs/:id
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  if (!blog) throw new ApiError(404, "Blog not found");
  res.json({ success: true, data: { id: req.params.id } });
});

// @route POST /api/blogs/:id/duplicate
export const duplicateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
  if (!blog) throw new ApiError(404, "Blog not found");

  const copy = await Blog.create({
    title: `${blog.title} (Copy)`,
    content: blog.content,
    coverImage: blog.coverImage,
    tags: blog.tags,
    author: req.user._id,
    isDraft: true,
    published: false,
  });

  res.status(201).json({ success: true, data: copy });
});
