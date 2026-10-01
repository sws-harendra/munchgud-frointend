"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditorForm from "@/app/admin/components/BlogEditorForm";
import { blogService, BlogPostItem } from "@/app/sercices/user/blog.service";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Loader from "@/app/commonComponents/loader";

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogById(id);
        setPost(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load blog post for editing.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Loader size={120} text="Loading publication data..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">
            Article Not Found
          </h2>
          <p className="text-sm text-gray-500">
            The article with ID #{id} could not be retrieved from the server.
          </p>
          <Link
            href="/admin/dashboard/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-2xl hover:bg-amber-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8">
      <BlogEditorForm initialData={post} isEdit={true} />
    </div>
  );
}
