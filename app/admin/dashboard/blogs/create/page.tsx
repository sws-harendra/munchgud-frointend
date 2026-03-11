"use client";
import { useState } from "react";
import { blogService } from "@/app/sercices/user/blog.service";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/app/lib/store/store";
import {
  addBlogPost,
  updateBlogPost,
} from "@/app/lib/store/features/blogSlice";
import { toast } from "sonner";

const RichTextEditor = dynamic(
  () => import("@/app/commonComponents/RichTextEditor"),
  { ssr: false },
);

export default function BlogForm({ post }: { post?: any }) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (featuredImage) formData.append("featuredImage", featuredImage);

    if (post) {
      await dispatch(
        updateBlogPost({ ...post, title, content, featuredImage }),
      );
      toast.success("Blog updated successfully");
    } else {
      await dispatch(addBlogPost({ title, content, featuredImage }));
      toast.success("Blog created successfully");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto py-6">
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div>
        <label className="block font-medium">Featured Image</label>
        <input
          type="file"
          onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {post ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}
