"use client";
import { BulletList, ListKit } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { MenuBar } from "./menu-bar";
// import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (content: string) => void;
}
const RichTextEditor = ({ label, value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc text-red-300 ml-3",
        },
      }),
      ListKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "right", "center"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose min-h-40 border rounded-sm transition-all duration-300 p-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:border-ring focus-visible:ring-ring/50 form-input-item border-[#D0D5DD]",
      },
    },
    immediatelyRender: false,
  });

  // Sync external value (important for reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      <p>{label}</p>
      <div>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
