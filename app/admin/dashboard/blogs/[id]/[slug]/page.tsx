// app/blogs/[id]/page.tsx
import { BlogPost } from "@/app/lib/store/features/blogSlice";
import { blogService } from "@/app/sercices/user/blog.service";
import { getImageUrl } from "@/app/utils/getImageUrl";

interface Props {
  params: { id: string };
}

export default async function ViewBlog({ params }: Props) {
  const { id } = params;

  let post: BlogPost | null = null;
  try {
    post = await blogService.getBlogById(id);
  } catch (error) {
    console.error(error);
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        {post.featuredImage && (
          <div className="relative w-full h-72 sm:h-96 lg:h-[400px] overflow-hidden">
            <img
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="text-white text-sm mb-6">
            {/* Optional: Add date or author */}
            Published on: {post.createdAt}
          </div>
          <div className="prose prose-lg dark:prose-invert text-white max-w-full">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}
