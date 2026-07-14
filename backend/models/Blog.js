import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 180,
      default: "Untitled Blog",
    },
    content: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number, // minutes
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", content: "text", tags: "text" });

blogSchema.pre("save", function computeStats(next) {
  const words = (this.content || "").trim().split(/\s+/).filter(Boolean);
  this.wordCount = words.length;
  this.readingTime = Math.max(1, Math.ceil(words.length / 200));
  next();
});

export default mongoose.model("Blog", blogSchema);
