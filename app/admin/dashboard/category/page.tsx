"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { toast } from "react-hot-toast";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/app/lib/store/features/categorySlice";
import {
  FolderTree,
  Edit,
  Trash2,
  Plus,
  X,
  Layers,
} from "lucide-react";
import { useAdminTheme } from "@/app/admin/context/AdminThemeContext";
import Loader from "@/app/commonComponents/loader";

const Category = () => {
  const dispatch = useAppDispatch();
  const { isDark, resolvedTheme } = useAdminTheme();
  const isDarkMode = Boolean(isDark || resolvedTheme === "dark");

  const { categories, loading } = useAppSelector((state) => state.category);

  const [form, setForm] = useState({
    name: "",
    description: "",
    parentId: null,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Function to flatten categories for dropdown display
  const flattenCategoriesForDropdown = (cats: any[], level = 0): any[] => {
    let result: any[] = [];

    cats.forEach((cat) => {
      // Add current category with proper indentation indicator
      result.push({
        id: cat.id,
        name: cat.name,
        level: level,
        displayName: "  ".repeat(level) + (level > 0 ? "└ " : "") + cat.name,
      });

      // Recursively add subcategories
      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(
          flattenCategoriesForDropdown(cat.subcategories, level + 1)
        );
      }
    });

    return result;
  };

  // Function to flatten categories for table display
  const flattenCategoriesForTable = (cats: any[], level = 0): any[] => {
    let result: any[] = [];

    cats.forEach((cat) => {
      result.push({
        ...cat,
        level: level,
        displayName: "  ".repeat(level) + (level > 0 ? "└ " : "") + cat.name,
      });

      if (cat.subcategories && cat.subcategories.length > 0) {
        result = result.concat(
          flattenCategoriesForTable(cat.subcategories, level + 1)
        );
      }
    });

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await dispatch(updateCategory({ id: editId, data: form })).unwrap();
        toast.success("Category updated successfully!");
        setEditId(null);
      } else {
        await dispatch(createCategory(form)).unwrap();
        toast.success("Category created successfully!");
      }
      setForm({ name: "", description: "", parentId: null });
    } catch (error: any) {
      console.error("Failed to save category:", error);
      toast.error(error?.message || error?.data?.message || "Failed to save category");
    }
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success("Category deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete category:", error);
        toast.error(error?.message || error?.data?.message || "Failed to delete category");
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", description: "", parentId: null });
  };

  // Get flattened categories for dropdown (exclude the category being edited to prevent circular reference)
  const dropdownCategories = flattenCategoriesForDropdown(categories).filter(
    (cat) => (editId ? cat.id !== editId : true)
  );

  // Get flattened categories for table display
  const tableCategories = flattenCategoriesForTable(categories);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-200 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-slate-50/70 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
              : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-3.5 rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center text-zinc-950 font-bold">
              <FolderTree className="h-7 w-7 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Categories
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Taxonomy
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Manage your store product categories, hierarchy, and navigation tags
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                  : "bg-gray-100 border-gray-200/60 text-gray-700"
              }`}
            >
              <span>
                {tableCategories.length}{" "}
                {tableCategories.length === 1 ? "Category" : "Categories"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-3xl border p-6 sm:p-7 transition-all duration-200 sticky top-6 ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800/90 text-white shadow-xl shadow-black/40"
                  : "bg-white border-slate-200/80 text-gray-900 shadow-sm"
              }`}
            >
              <div
                className={`flex items-center justify-between mb-6 pb-4 border-b ${
                  isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  <h2
                    className={`text-lg font-bold tracking-tight ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {editId ? "Edit Category" : "Add New Category"}
                  </h2>
                </div>
                {editId && (
                  <button
                    onClick={handleCancel}
                    className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-900"
                    }`}
                    title="Cancel editing"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-zinc-300" : "text-gray-700"
                    }`}
                  >
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Snacks, Beverages, Organic"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-zinc-300" : "text-gray-700"
                    }`}
                  >
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter category description..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="parentId"
                    className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-zinc-300" : "text-gray-700"
                    }`}
                  >
                    Parent Category (Optional)
                  </label>
                  <select
                    id="parentId"
                    value={form.parentId ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        parentId: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white focus:border-amber-500"
                        : "bg-white border-gray-200 text-gray-900 focus:border-amber-500"
                    }`}
                    style={{ fontFamily: "monospace" }}
                  >
                    <option value="">None (Top-level Category)</option>
                    {dropdownCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                  <p
                    className={`mt-1.5 text-xs ${
                      isDarkMode ? "text-zinc-500" : "text-gray-500"
                    }`}
                  >
                    Categories are shown in hierarchical nesting order
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-zinc-950 font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {editId ? (
                      <>
                        <Edit size={16} />
                        <span>Update Category</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Add Category</span>
                      </>
                    )}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`px-4 py-3 border text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                          : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-3xl border overflow-hidden transition-all duration-200 ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800/90 shadow-xl shadow-black/40"
                  : "bg-white border-slate-200/80 shadow-sm"
              }`}
            >
              <div
                className={`px-6 py-5 border-b flex items-center justify-between ${
                  isDarkMode ? "border-zinc-800/80" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-5 w-5 text-amber-500" />
                  <h2
                    className={`text-lg font-bold tracking-tight ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    All Categories (Hierarchical View)
                  </h2>
                </div>
              </div>

              {loading ? (
                <Loader size={110} text="Loading categories..." />
              ) : tableCategories.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div
                    className={`w-20 h-20 rounded-3xl border mx-auto mb-4 flex items-center justify-center ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                        : "bg-gray-100 border-gray-200 text-gray-400"
                    }`}
                  >
                    <FolderTree className="w-10 h-10" />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-1.5 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No categories yet
                  </h3>
                  <p
                    className={`text-sm max-w-sm mx-auto ${
                      isDarkMode ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    Create your first category using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead
                      className={`border-b text-xs font-semibold uppercase tracking-wider ${
                        isDarkMode
                          ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                          : "bg-gray-50/80 border-gray-200 text-gray-500"
                      }`}
                    >
                      <tr>
                        <th className="px-6 py-3.5">ID</th>
                        <th className="px-6 py-3.5">Name</th>
                        <th className="px-6 py-3.5">Description</th>
                        <th className="px-6 py-3.5">Parent</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y text-sm ${
                        isDarkMode
                          ? "divide-zinc-800/60 text-zinc-200"
                          : "divide-gray-100 text-gray-800"
                      }`}
                    >
                      {tableCategories.map((cat: any) => (
                        <tr
                          key={cat.id}
                          className={`transition-colors ${
                            editId === cat.id
                              ? isDarkMode
                                ? "bg-amber-500/10 border-l-4 border-amber-500"
                                : "bg-amber-50/70 border-l-4 border-amber-500"
                              : isDarkMode
                              ? "hover:bg-zinc-900/40"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-xs font-semibold ${
                              isDarkMode ? "text-zinc-400" : "text-gray-500"
                            }`}
                          >
                            #{cat.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`font-semibold text-sm ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                              style={{ fontFamily: "monospace" }}
                            >
                              {cat.displayName}
                            </div>
                            {cat.level > 0 && (
                              <div
                                className={`text-xs mt-0.5 ${
                                  isDarkMode ? "text-zinc-500" : "text-gray-400"
                                }`}
                              >
                                Subcategory (Level {cat.level})
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`text-xs max-w-xs truncate ${
                                isDarkMode ? "text-zinc-400" : "text-gray-600"
                              }`}
                            >
                              {cat.description || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {cat.parentId ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                                    : "bg-gray-100 border-gray-200 text-gray-600"
                                }`}
                              >
                                #{cat.parentId}
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                  isDarkMode
                                    ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                }`}
                              >
                                Root
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(cat)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:border-zinc-700"
                                    : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                                }`}
                                title="Edit category"
                              >
                                <Edit size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800 text-rose-400 hover:bg-rose-950/40 hover:border-rose-900"
                                    : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                                }`}
                                title="Delete category"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
