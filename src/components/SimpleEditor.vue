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
                <span v-if="btn.icon" v-html="btn.icon"></span>
                <span v-else>{{ btn.label }}</span>
            </button>
            <select
                @change="setHeading($event)"
                class="toolbar-select"
                :value="currentHeading"
            >
                <option value="paragraph">Paragraph</option>
                <option v-for="n in 6" :key="n" :value="`heading-${n}`">
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
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";

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
                    icon: `<b>B</b>`,
                    action: () =>
                        this.editor.chain().focus().toggleBold().run(),
                    isActive: () => this.editor.isActive("bold"),
                    isDisabled: () =>
                        !this.editor.can().chain().focus().toggleBold().run(),
                },
                {
                    label: "Italic",
                    icon: `<i>I</i>`,
                    action: () =>
                        this.editor.chain().focus().toggleItalic().run(),
                    isActive: () => this.editor.isActive("italic"),
                    isDisabled: () =>
                        !this.editor.can().chain().focus().toggleItalic().run(),
                },
                {
                    label: "Underline",
                    icon: `<u>U</u>`,
                    action: () =>
                        this.editor.chain().focus().toggleUnderline().run(),
                    isActive: () => this.editor.isActive("underline"),
                    isDisabled: () =>
                        !this.editor
                            .can()
                            .chain()
                            .focus()
                            .toggleUnderline()
                            .run(),
                },
                {
                    label: "Strike",
                    icon: `<s>S</s>`,
                    action: () =>
                        this.editor.chain().focus().toggleStrike().run(),
                    isActive: () => this.editor.isActive("strike"),
                    isDisabled: () =>
                        !this.editor.can().chain().focus().toggleStrike().run(),
                },
                {
                    label: "Highlight",
                    icon: `<span style="background:yellow;">H</span>`,
                    action: () =>
                        this.editor.chain().focus().toggleHighlight().run(),
                    isActive: () => this.editor.isActive("highlight"),
                },
                {
                    label: "Horizontal Rule",
                    icon: `hr`,
                    action: () =>
                        this.editor.chain().focus().setHorizontalRule().run(),
                    isActive: () => this.editor.isActive("horizontalrule"),
                },
                {
                    label: "Bullet List",
                    icon: "• List",
                    action: () =>
                        this.editor.chain().focus().toggleBulletList().run(),
                    isActive: () => this.editor.isActive("bulletList"),
                },
                {
                    label: "Ordered List",
                    icon: "1. List",
                    action: () =>
                        this.editor.chain().focus().toggleOrderedList().run(),
                    isActive: () => this.editor.isActive("orderedList"),
                },
                {
                    label: "Blockquote",
                    icon: "❝",
                    action: () =>
                        this.editor.chain().focus().toggleBlockquote().run(),
                    isActive: () => this.editor.isActive("blockquote"),
                },
                {
                    label: "Code Block",
                    icon: "&lt;/&gt;",
                    action: () =>
                        this.editor.chain().focus().toggleCodeBlock().run(),
                    isActive: () => this.editor.isActive("codeBlock"),
                },
                {
                    label: "Code",
                    icon: "<small class='text-base-content'>code</small>",
                    action: () =>
                        this.editor.chain().focus().toggleCode().run(),
                    isActive: () => this.editor.isActive("code"),
                },
                {
                    label: "Undo",
                    icon: "↺",
                    action: () => this.editor.chain().focus().undo().run(),
                    isDisabled: () =>
                        !this.editor.can().chain().focus().undo().run(),
                },
                {
                    label: "Redo",
                    icon: "↻",
                    action: () => this.editor.chain().focus().redo().run(),
                    isDisabled: () =>
                        !this.editor.can().chain().focus().redo().run(),
                },
                {
                    label: "Clear Marks",
                    icon: "✖",
                    action: () =>
                        this.editor.chain().focus().unsetAllMarks().run(),
                },
                {
                    label: "Clear Nodes",
                    icon: "🗑",
                    action: () =>
                        this.editor.chain().focus().clearNodes().run(),
                },
            ];
        },
        currentHeading() {
            for (let i = 1; i <= 6; i++) {
                if (
                    this.editor &&
                    this.editor.isActive("heading", { level: i })
                )
                    return `heading-${i}`;
            }
            if (this.editor && this.editor.isActive("paragraph"))
                return "paragraph";
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
                ListItem,
                Highlight,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
                Typography,
                Underline,
            ],
            content: `
        <h2>Hi there,</h2>
        <p>This is a <em>basic</em> example of <strong>Tiptap</strong> with a <mark>modern toolbar</mark>.</p>
        <ul>
          <li>Bullet list item</li>
          <li>Another item</li>
        </ul>
        <blockquote>Blockquote example</blockquote>
        <pre><code>console.log('code block')</code></pre>
      `,
        });
    },
    beforeUnmount() {
        if (this.editor) this.editor.destroy();
    },
};
</script>

<style scoped>
.editor-container {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.07);
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    background: #f6f8fa;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    align-items: center;
}

.toolbar-btn {
    border: none;
    background: none;
    padding: 0.4rem 0.7rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.15s;
    color: #333;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar-btn.is-active,
.toolbar-btn:active {
    background: #e0e7ef;
    color: #3a6df0;
}

.toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.toolbar-select {
    border: 1px solid #d0d7de;
    background: #fff;
    border-radius: 5px;
    padding: 0.3rem 0.6rem;
    font-size: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}

.tiptap {
    min-height: 250px;
    font-size: 1.1rem;
    line-height: 1.6;
    outline: none;
}

/* Editor content styles (reuse your previous ones, but improved) */
.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
}
.tiptap ul {
    list-style-type: disc;
    margin-left: 1.5rem; /* or whatever you prefer */
    padding-left: 0;
}

.tiptap ol {
    list-style-type: decimal;
    margin-left: 1.5rem;
    padding-left: 0;
}

.tiptap ul,
.tiptap ol {
    margin: 1.25rem 0 1.25rem 1.5rem;
}
.tiptap blockquote {
    border-left: 4px solid #b3b9c9;
    color: #555;
    margin: 1.5rem 0;
    padding-left: 1rem;
    font-style: italic;
    background: #f9fafb;
    border-radius: 4px;
}
.tiptap code {
    background: #f5f2fa;
    border-radius: 4px;
    padding: 0.2em 0.4em;
    font-size: 0.95em;
}
.tiptap pre {
    background: #23272f;
    color: #fff;
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    font-family: "JetBrains Mono", "Fira Mono", monospace;
}
</style>
