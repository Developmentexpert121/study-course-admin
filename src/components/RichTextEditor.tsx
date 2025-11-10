"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Code from "@tiptap/extension-code";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaUndo,
  FaRedo,
  FaListUl,
  FaListOl,
  FaQuoteRight,
} from "react-icons/fa";

export interface RichTextEditorProps {
  label?: string;
  value?: string; // HTML string
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string | boolean;
  className?: string;
  minHeight?: string;
  autoFocus?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value = "",
  onChange,
  error,
  className = "",
  minHeight = "250px",
  autoFocus = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
      }),
      ListItem,
      BulletList.configure({ keepMarks: true }),
      OrderedList,
      Blockquote,
      Code,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        "aria-label": label || "rich text editor",
        class: "prose prose-sm sm:prose-base focus:outline-none max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false, // Add this line
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!editor || !isMounted) return;
    if (value == null) return;

    const current = editor.getHTML();

    // Only update if the change came from outside (not user typing)
    if (value !== current && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor, isMounted]);

  useEffect(() => {
    if (!editor || !isMounted) return;
    if (autoFocus) {
      setTimeout(() => {
        try {
          editor.chain().focus().run();
        } catch (err) {}
      }, 50);
    }
  }, [editor, autoFocus, isMounted]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Show loading state during SSR
  if (!isMounted) {
    return (
      <div className={`w-full min-w-0 ${className}`}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div
          className="rounded-lg border border-gray-300"
          style={{ minHeight }}
        >
          <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b border-gray-200 bg-gray-50 px-3 py-2">
            {/* Loading skeleton for toolbar */}
            <div className="h-6 w-16 animate-pulse rounded bg-gray-300"></div>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-300"></div>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="px-4 py-3">
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`w-full rounded-lg border transition-all duration-200 ${
          error
            ? "border-red-500 shadow-sm shadow-red-100"
            : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 hover:border-gray-400"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b border-gray-200 bg-gray-50 px-3 py-2">
          <div className="mr-2 flex items-center gap-1">
            <button
              type="button"
              title="Bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("bold")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaBold />
            </button>

            <button
              type="button"
              title="Italic"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("italic")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaItalic />
            </button>

            <button
              type="button"
              title="Strikethrough"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("strike")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaStrikethrough />
            </button>

            <button
              type="button"
              title="Code"
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("code")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaCode />
            </button>
          </div>

          <div className="mx-1 h-4 w-px bg-gray-300"></div>

          <div className="mr-2 flex items-center gap-1">
            <button
              type="button"
              title="Bullet List"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("bulletList")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaListUl />
            </button>

            <button
              type="button"
              title="Ordered List"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("orderedList")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaListOl />
            </button>

            <button
              type="button"
              title="Blockquote"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`rounded p-2 text-sm ${
                editor?.isActive("blockquote")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaQuoteRight />
            </button>
          </div>

          <div className="mx-1 h-4 w-px bg-gray-300"></div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Undo"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              className="rounded p-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaUndo />
            </button>

            <button
              type="button"
              title="Redo"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              className="rounded p-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="prose w-full max-w-none overflow-y-auto px-4 py-3"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{String(error)}</p>}
    </div>
  );
};

export default RichTextEditor;
