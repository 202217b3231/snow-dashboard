<template>
  <div v-if="editor" class="editor-container">
    <div class="toolbar">
      <button
        v-for="btn in buttons"
        :key="btn.label"
        :title="btn.label"
        @click="btn.action"
        :class="{
          'is-active': btn.isActive && btn.isActive(),
          'toolbar-btn': true,
        }"
        :disabled="btn.isDisabled && btn.isDisabled()"
      >
        <component v-if="btn.icon" :is="btn.icon" :size="18" stroke-width="2" />
        <span v-else-if="typeof btn.icon === 'string'" v-html="btn.icon"></span>
        <span v-else>{{ btn.label }}</span>
      </button>
      <select
        @change="setHeading($event)"
        class="toolbar-select"
        :value="currentHeading"
      >
        <option value="paragraph">Paragraph</option>
        <option v-for="n in 4" :key="n" :value="`heading-${n}`">
          Heading {{ n }}
        </option>
      </select>
      <select
        @change="setAlign($event)"
        class="toolbar-select"
        :value="currentAlign"
      >
        <option value="left">Align Left</option>
        <option value="center">Align Center</option>
        <option value="right">Align Right</option>
        <option value="justify">Justify</option>
      </select>
      <input type="color" @input="setColor($event)" title="Text Color" />
    </div>
    <editor-content :editor="editor" class="tiptap" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  Underline as LucideUnderline,
  Strikethrough,
  Minus,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  SquareCode,
  Code,
  Trash2,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-vue-next";

export default {
  components: { EditorContent },
  data() {
    return {
      editor: null,
    };
  },
  computed: {
    buttons() {
      return [
        {
          label: "Bold",
          icon: Bold,
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive("bold"),
          isDisabled: () =>
            !this.editor.can().chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          icon: Italic,
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive("italic"),
          isDisabled: () =>
            !this.editor.can().chain().focus().toggleItalic().run(),
        },
        {
          label: "Underline",
          icon: LucideUnderline,
          action: () => this.editor.chain().focus().toggleUnderline().run(),
          isActive: () => this.editor.isActive("underline"),
          isDisabled: () =>
            !this.editor.can().chain().focus().toggleUnderline().run(),
        },
        {
          label: "Strike",
          icon: Strikethrough,
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive("strike"),
          isDisabled: () =>
            !this.editor.can().chain().focus().toggleStrike().run(),
        },
        {
          label: "Highlight",
          icon: Highlighter,
          action: () => this.editor.chain().focus().toggleHighlight().run(),
          isActive: () => this.editor.isActive("highlight"),
        },
        {
          label: "Horizontal Rule",
          icon: Minus,
          action: () => this.editor.chain().focus().setHorizontalRule().run(),
          isActive: () => this.editor.isActive("horizontalrule"),
        },
        {
          label: "Bullet List",
          icon: List,
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive("bulletList"),
        },
        {
          label: "Ordered List",
          icon: ListOrdered,
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive("orderedList"),
        },
        {
          label: "Blockquote",
          icon: Quote,
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive("blockquote"),
        },
        {
          label: "Code Block",
          icon: SquareCode,
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => this.editor.isActive("codeBlock"),
        },
        {
          label: "Code",
          icon: Code,
          action: () => this.editor.chain().focus().toggleCode().run(),
          isActive: () => this.editor.isActive("code"),
        },
        {
          label: "Undo",
          icon: Undo2,
          action: () => this.editor.chain().focus().undo().run(),
          isDisabled: () => !this.editor.can().chain().focus().undo().run(),
        },
        {
          label: "Redo",
          icon: Redo2,
          action: () => this.editor.chain().focus().redo().run(),
          isDisabled: () => !this.editor.can().chain().focus().redo().run(),
        },
        {
          label: "Clear Marks",
          icon: RemoveFormatting,
          action: () => this.editor.chain().focus().unsetAllMarks().run(),
        },
        {
          label: "Clear Nodes",
          icon: Trash2,
          action: () => this.editor.chain().focus().clearNodes().run(),
        },
      ];
    },
    currentHeading() {
      for (let i = 1; i <= 6; i++) {
        if (this.editor && this.editor.isActive("heading", { level: i }))
          return `heading-${i}`;
      }
      if (this.editor && this.editor.isActive("paragraph")) return "paragraph";
      return "paragraph";
    },
    currentAlign() {
      if (this.editor && this.editor.isActive({ textAlign: "center" }))
        return "center";
      if (this.editor && this.editor.isActive({ textAlign: "right" }))
        return "right";
      if (this.editor && this.editor.isActive({ textAlign: "justify" }))
        return "justify";
      return "left";
    },
  },
  methods: {
    setHeading(e) {
      const val = e.target.value;
      if (val === "paragraph") {
        this.editor.chain().focus().setParagraph().run();
      } else {
        const level = parseInt(val.split("-")[1], 10);
        this.editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    setAlign(e) {
      const val = e.target.value;
      this.editor.chain().focus().setTextAlign(val).run();
    },
    setColor(e) {
      this.editor.chain().focus().setColor(e.target.value).run();
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Color,
        TextStyle,
        Highlight,
        Typography,
        Underline,
      ],
      content: "",
    });
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  },
};
</script>
