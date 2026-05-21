"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Script from "next/script";
import { toast } from "react-hot-toast";

export default function InstagramAdmin() {
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_serverurl}/instagram/all`
    );
    console.log(res.data); // ADD THIS
    setPosts(res.data.posts);
  };

  const handleAdd = async () => {
    if (!url) {
      toast.error("Please enter an Instagram URL");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_serverurl}/instagram/add`,
        { url },
        { withCredentials: true }
      );

      setUrl("");
      toast.success("Instagram post added successfully!");
      fetchPosts();
    } catch (error: any) {
      console.error("Error adding instagram post:", error);
      toast.error(error?.response?.data?.message || "Failed to add Instagram post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Instagram post?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_serverurl}/instagram/delete/${id}`,
        { withCredentials: true }
      );

      toast.success("Instagram post deleted successfully!");
      fetchPosts();
    } catch (error: any) {
      console.error("Error deleting instagram post:", error);
      toast.error(error?.response?.data?.message || "Failed to delete Instagram post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
}, [posts]);

  return (
    <>
        <Script
            src="https://www.instagram.com/embed.js"
            strategy="lazyOnload"
        />
        <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
            Instagram Management
        </h1>

        <div className="flex gap-4 mb-8">
            <input
            type="text"
            placeholder="Paste Instagram Post URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border px-4 py-2 w-full rounded-md"
            />
            <button
            onClick={handleAdd}
            className="bg-black text-white px-6 py-2 rounded-md"
            >
            Add
            </button>
        </div>

        <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between items-center"
                >
                    {/* Instagram Embed */}
                    <div className="w-full max-w-[320px]">
                    <blockquote
                        className="instagram-media w-full"
                        data-instgrm-permalink={post.url}
                        data-instgrm-version="13"
                    ></blockquote>
                    </div>

                    {/* Delete Button */}
                    <button
                    onClick={() => handleDelete(post.id)}
                    className="mt-4 w-full bg-red-700 hover:bg-red-800 transition text-white py-2 rounded-lg font-medium"
                    >
                    Delete
                    </button>
                </div>
                ))}
            </div>
        </div>
        </div>
    </>
  );
}