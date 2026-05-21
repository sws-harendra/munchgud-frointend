"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { toast } from "react-hot-toast";
import {
  fetchBlogPostById,
  selectCurrentPost,
  updateBlogPost,
  clearCurrentPost,
} from "@/app/lib/store/features/blogSlice";
import RichTextEditor from "@/app/commonComponents/RichTextEditor";
import { blogService } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function EditBlog() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentPost = useAppSelector(selectCurrentPost);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBlogPostById(id));

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
      setSlug(currentPost.slug || "");
      setExcerpt(currentPost.excerpt || "");
      setContent(currentPost.content);
      setImagePreview(currentPost.featuredImage || null);
    }
  }, [currentPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = imagePreview;
      if (featuredImage) {
        const uploadResult = await blogService.uploadImage(featuredImage);
        uploadedImageUrl = uploadResult.url;
      }
      console.log(uploadedImageUrl, ";;;;;");

      await dispatch(
        updateBlogPost({
          id,
          title,
          slug,
          excerpt,
          content,
          featuredImage: uploadedImageUrl || "",
        })
      ).unwrap();

      toast.success("Blog updated successfully!");
      router.push("/admin/dashboard/blogs"); // go back to blog list after update
    } catch (error: any) {
      console.error("Failed to update blog:", error);
      toast.error(error?.message || error?.data?.message || "Failed to update blog");
    }
  };

  if (!currentPost) return <p>Loading blog...</p>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Featured Image</label>
          <input type="file" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={getImageUrl(imagePreview)}
              alt="Preview"
              className="mt-2 w-64 h-40 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}
