"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { blogService } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";

export default function ViewBlog() {
  const { id } = useParams(); // expecting ID now
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id);
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Blog not found</p>;

  return (
    <div className="container  mx-auto px-20 py-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.featuredImage && (
        <img
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          className="mb-4 w-full max-h-[400px] object-cover rounded"
        />
      )}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
