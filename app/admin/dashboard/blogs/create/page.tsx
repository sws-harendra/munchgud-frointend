"use client";

import React from "react";
import BlogEditorForm from "@/app/admin/components/BlogEditorForm";

export default function CreateBlogPage() {
  return (
    <div className="min-h-screen bg-slate-900/10 p-4 sm:p-6 lg:p-8">
      <BlogEditorForm isEdit={false} />
    </div>
  );
}
