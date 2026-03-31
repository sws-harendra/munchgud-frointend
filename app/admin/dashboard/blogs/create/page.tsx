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
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(
  () => import("@/app/commonComponents/RichTextEditor"),
  { ssr: false },
);

export default function BlogForm({ post }: { post?: any }) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // prevent double click bug

    setLoading(true);

    try {
      if (post) {
        await dispatch(
          updateBlogPost({ ...post, title, content, featuredImage })
        ).unwrap();

        toast.success("Blog updated successfully");

      } else {
        await dispatch(
          addBlogPost({ title, content, featuredImage })
        ).unwrap();

        toast.success("Blog created successfully");

        // ✅ RESET FORM (IMPORTANT)
        setTitle("");
        setContent("");
        setFeaturedImage(null);

        // ✅ Redirect AFTER state settles
        setTimeout(() => {
          router.push("/admin/dashboard/blogs");
        }, 300);
      }

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : post ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}
