// "use client";

// import RichTextEditor from "@/app/commonComponents/RichTextEditor";
// import { pageService } from "@/app/sercices/user/staticpage.service";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// const pages = [
//   { title: "Privacy Policy", slug: "privacy-policy" },
//   { title: "Refund Policy", slug: "refund-policy" },
//   { title: "Terms & Conditions", slug: "terms&conditions" },
//   { title: "About Us", slug: "aboutus" },
// ];

// export default function PageEditor() {
//   const [selectedPage, setSelectedPage] = useState(pages[0]);
//   const [content, setContent] = useState(
//     "<p>Edit your page content here...</p>"
//   );
//   const [loading, setLoading] = useState(false);

//   const handleSave = async () => {
//     try {
//       await pageService.createOrUpdatePage({
//         title: selectedPage.title,
//         slug: selectedPage.slug,
//         content,
//       });
//       toast.success(`${selectedPage.title} saved!`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-6">
//       <h1 className="text-2xl font-bold mb-4">Page Editor</h1>

//       {/* Dropdown to select page */}
//       <select
//         value={selectedPage.slug}
//         onChange={(e) => {
//           const page = pages.find((p) => p.slug === e.target.value);
//           setSelectedPage(page || pages[0]);
//         }}
//         className="border p-2 rounded mb-4 w-full"
//       >
//         {pages.map((page) => (
//           <option key={page.slug} value={page.slug}>
//             {page.title}
//           </option>
//         ))}
//       </select>

//       {/* Rich Text Editor */}
//       {loading ? (
//         <p className="text-gray-500">Loading content...</p>
//       ) : (
//         <RichTextEditor value={content} onChange={setContent} />
//       )}

//       {/* Save Button */}
//       <button
//         onClick={handleSave}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Save Page
//       </button>
//     </div>
//   );
// }








"use client";

import RichTextEditor from "@/app/commonComponents/RichTextEditor";
import { pageService } from "@/app/sercices/user/staticpage.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const pages = [
  { title: "Privacy Policy", slug: "privacy-policy" },
  { title: "Refund Policy", slug: "refund-policy" },
  { title: "Terms & Conditions", slug: "terms&conditions" },
  { title: "About Us", slug: "aboutus" },
];

export default function PageEditor() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [content, setContent] = useState("<p>Edit your page content here...</p>");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch page content when page changes
  const fetchPage = async (slug: string) => {
    try {
      setLoading(true);

      const res = await pageService.getPageBySlug(slug);

      if (res?.content) {
        setContent(res.content);
      } else {
        setContent("<p>Edit your page content here...</p>");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load page content");
      setContent("<p>Error loading content...</p>");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger fetch on page change
  useEffect(() => {
    fetchPage(selectedPage.slug);
  }, [selectedPage]);

  const handleSave = async () => {
    try {
      await pageService.createOrUpdatePage({
        title: selectedPage.title,
        slug: selectedPage.slug,
        content,
      });

      toast.success(`${selectedPage.title} saved!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save page");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Page Editor</h1>

      {/* Dropdown */}
      <select
        value={selectedPage.slug}
        onChange={(e) => {
          const page = pages.find((p) => p.slug === e.target.value);
          setSelectedPage(page || pages[0]);
        }}
        className="border p-2 rounded mb-4 w-full"
      >
        {pages.map((page) => (
          <option key={page.slug} value={page.slug}>
            {page.title}
          </option>
        ))}
      </select>

      {/* Editor */}
      {loading ? (
        <p className="text-gray-500">Loading content...</p>
      ) : (
        <RichTextEditor value={content} onChange={setContent} />
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Page
      </button>
    </div>
  );
}