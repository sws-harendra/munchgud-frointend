"use client";

import { useEffect, useState } from "react";
import { pageService } from "@/app/sercices/user/staticpage.service";
import { FadeIn } from "@/app/commonComponents/motion";

type StaticPageProps = {
  slug: string;
};

export default function StaticPageRenderer({ slug }: StaticPageProps) {
  const [page, setPage] = useState<{ title: string; content: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pageService.getPageBySlug(slug);
        setPage(data);
      } catch (err) {
        console.error("Error fetching page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-neutral-800">Page not found</h2>
        <p className="text-neutral-500 text-sm mt-2">The requested legal or information document could not be located.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <FadeIn direction="up" distance={20} className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/70 shadow-xs">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 mb-6 pb-4 border-b border-neutral-100 tracking-tight">
          {page.title}
        </h1>
        <div 
          className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed text-sm sm:text-base prose-headings:font-bold prose-headings:text-neutral-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </FadeIn>
    </div>
  );
}
