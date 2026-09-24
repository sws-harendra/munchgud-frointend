"use client";

import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { blogService } from "../sercices/user/blog.service";
import { getImageUrl } from "../utils/getImageUrl";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  FileCode,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Undo2,
  Redo2,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  Palette,
  Highlighter,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

const COLOR_PALETTE = [
  { name: "Default (Black)", color: "#111827" },
  { name: "Muted Gray", color: "#6B7280" },
  { name: "Amber / Gold", color: "#D97706" },
  { name: "Bronze Brown", color: "#92400E" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Deep Blue", color: "#2563EB" },
  { name: "Indigo Purple", color: "#7C3AED" },
  { name: "Crimson Red", color: "#DC2626" },
];

const HIGHLIGHT_PALETTE = [
  { name: "Yellow", color: "#FEF08A" },
  { name: "Amber Light", color: "#FDE68A" },
  { name: "Green Mint", color: "#A7F3D0" },
  { name: "Cyan Soft", color: "#BAE6FD" },
  { name: "Pink Pastel", color: "#FBCFE8" },
  { name: "Purple Mist", color: "#DDD6FE" },
];

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write your article story here with rich formatting...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Handled separately
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4] }),
      Blockquote,
      CodeBlock,
      HorizontalRule,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-amber-600 underline font-medium hover:text-amber-800",
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-2xl max-w-full my-4 border border-gray-200 shadow-sm mx-auto",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4 border border-gray-300 rounded-lg overflow-hidden",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-amber-50/70 p-2 font-bold text-gray-900 text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2 text-gray-700",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-2 my-1",
        },
      }),
    ],
    content: value || `<p>${placeholder}</p>`,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  // Insert Link dialog
  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter web URL link:", previousUrl || "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  };

  // Image Upload Handler
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await blogService.uploadImage(file);
      if (res?.url) {
        editor
          .chain()
          .focus()
          .setImage({ src: getImageUrl(res.url), alt: file.name })
          .run();
      }
    } catch {
      // Fallback to local data URL if server upload fails
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImageUrl = () => {
    const url = window.prompt("Enter Image URL (https://...):");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Word & character stats
  const textContent = editor.getText();
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;

  return (
    <div
      className={`border border-gray-300 rounded-2xl bg-white shadow-xs transition-all duration-200 flex flex-col ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-none p-4 bg-white"
          : "relative"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          WORD-STYLE COMMAND TOOLBAR
         ───────────────────────────────────────────────────────────── */}
      <div className="p-2 border-b border-gray-200 bg-slate-50/80 rounded-t-2xl flex flex-wrap items-center gap-1 text-xs select-none">
        {/* Undo / Redo Group */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white disabled:opacity-30 transition cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white disabled:opacity-30 transition cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Style / Heading Hierarchy Dropdown */}
        <div className="pr-1.5 border-r border-gray-200">
          <select
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                ? "h3"
                : editor.isActive("heading", { level: 4 })
                ? "h4"
                : "p"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
              else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
              else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
              else if (val === "h4") editor.chain().focus().toggleHeading({ level: 4 }).run();
              else editor.chain().focus().setParagraph().run();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1 (Main Title)</option>
            <option value="h2">Heading 2 (Section)</option>
            <option value="h3">Heading 3 (Sub-section)</option>
            <option value="h4">Heading 4 (Minor)</option>
          </select>
        </div>

        {/* Character Formatting: Bold, Italic, Underline, Strike, Code */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("bold")
                ? "bg-amber-100 text-amber-900 font-bold"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("italic")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("underline")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("strike")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("code")
                ? "bg-amber-100 text-amber-900 font-mono"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
              setShowTableMenu(false);
            }}
            title="Text Color"
            className="flex items-center gap-1 p-1.5 rounded-lg text-gray-700 hover:bg-white transition cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-amber-700" />
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 w-44 grid grid-cols-4 gap-1.5">
              {COLOR_PALETTE.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(item.color).run();
                    setShowColorPicker(false);
                  }}
                  title={item.name}
                  className="w-7 h-7 rounded-lg border border-gray-300 hover:scale-110 transition cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="col-span-4 mt-1 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 rounded text-center"
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

        {/* Text Highlight Marker */}
        <div className="relative pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
              setShowTableMenu(false);
            }}
            title="Highlight Marker"
            className="flex items-center gap-1 p-1.5 rounded-lg text-gray-700 hover:bg-white transition cursor-pointer"
          >
            <Highlighter className="w-3.5 h-3.5 text-yellow-600" />
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 w-44 grid grid-cols-3 gap-2">
              {HIGHLIGHT_PALETTE.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setHighlight({ color: item.color }).run();
                    setShowHighlightPicker(false);
                  }}
                  title={item.name}
                  className="h-6 rounded-md border border-gray-300 hover:scale-105 transition cursor-pointer"
                  style={{ backgroundColor: item.color }}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
                className="col-span-3 mt-1 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 rounded text-center"
              >
                Remove Highlight
              </button>
            </div>
          )}
        </div>

        {/* Alignment Group: Left, Center, Right, Justify */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive({ textAlign: "left" })
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive({ textAlign: "center" })
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive({ textAlign: "right" })
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            title="Justify"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive({ textAlign: "justify" })
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Tasks Group */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bulleted List"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("bulletList")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("orderedList")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            title="Task / Checklist"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("taskList")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inserts: Quotes, Code Block, Divider, Link */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("blockquote")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("codeBlock")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
            className="p-1.5 rounded-lg text-gray-700 hover:bg-white transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSetLink}
            title="Insert / Edit Link"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("link")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Media: Image Upload & Image URL */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image from Device"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-700 hover:bg-white transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Image</span>
          </button>

          <button
            type="button"
            onClick={handleInsertImageUrl}
            title="Insert Image by URL"
            className="p-1.5 rounded-lg text-gray-600 hover:bg-white transition cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadImageFile}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Table Operations Menu */}
        <div className="relative pr-1.5 border-r border-gray-200">
          <button
            type="button"
            onClick={() => {
              setShowTableMenu(!showTableMenu);
              setShowColorPicker(false);
              setShowHighlightPicker(false);
            }}
            title="Table Tools"
            className={`flex items-center gap-1 p-1.5 rounded-lg transition cursor-pointer ${
              editor.isActive("table")
                ? "bg-amber-100 text-amber-900"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline font-medium">Table</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showTableMenu && (
            <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 w-52 space-y-1">
              {!editor.isActive("table") ? (
                <button
                  type="button"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Insert Table (3 × 3)
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Add Row Below</span>
                    <span className="text-[10px] text-gray-400">+Row</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center justify-between"
                  >
                    <span>Delete Row</span>
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Add Column Right</span>
                    <span className="text-[10px] text-gray-400">+Col</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center justify-between"
                  >
                    <span>Delete Column</span>
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-100 flex items-center justify-between"
                  >
                    <span>Delete Table</span>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear All Formatting"
          className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-white transition cursor-pointer"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Mode Toggle */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-amber-700" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          EDITOR EDITABLE CONTENT CANVAS
         ───────────────────────────────────────────────────────────── */}
      <div className={`p-4 sm:p-6 overflow-y-auto ${isFullscreen ? "flex-1" : "min-h-[320px] max-h-[600px]"}`}>
        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[280px]"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER STATS STRIP (Word Count, Character Count, Keyboard Shortcuts)
         ───────────────────────────────────────────────────────────── */}
      <div className="px-4 py-2 bg-slate-50 border-t border-gray-200 rounded-b-2xl flex flex-wrap items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-4">
          <span>
            Words: <strong className="text-gray-800">{wordCount}</strong>
          </span>
          <span>•</span>
          <span>
            Characters: <strong className="text-gray-800">{charCount}</strong>
          </span>
          <span>•</span>
          <span className="hidden sm:inline text-gray-400">
            Est. Read Time: ~{Math.max(1, Math.round(wordCount / 200))} min
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-gray-400">
          <span>Ctrl+B (Bold)</span>
          <span>•</span>
          <span>Ctrl+I (Italic)</span>
          <span>•</span>
          <span>Ctrl+U (Underline)</span>
        </div>
      </div>

      {/* Global Embedded Styles for Rich Tiptap Rendering */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 260px;
          line-height: 1.7;
          font-family: inherit;
          color: #1f2937;
        }
        .ProseMirror p {
          margin-bottom: 0.85em;
        }
        .ProseMirror h1 {
          font-size: 1.85rem;
          font-weight: 800;
          color: #111827;
          margin-top: 1.2em;
          margin-bottom: 0.5em;
          line-height: 1.25;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 1.1em;
          margin-bottom: 0.4em;
          line-height: 1.3;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1em;
          margin-bottom: 0.35em;
        }
        .ProseMirror h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #4b5563;
          margin-top: 0.9em;
          margin-bottom: 0.3em;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1em;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #d97706;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #4b5563;
          background: #fffbeb;
          padding: 0.75rem 1rem;
          border-radius: 0 0.75rem 0.75rem 0;
        }
        .ProseMirror pre {
          background: #0f172a;
          color: #f8fafc;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          margin: 1rem 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1.5rem 0;
        }
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.25rem 0;
          border: 1px solid #d1d5db;
        }
        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #d1d5db;
          padding: 0.6rem 0.8rem;
          text-align: left;
        }
        .ProseMirror th {
          background-color: #fef3c7;
          font-weight: bold;
          color: #78350f;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] li input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: #d97706;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
