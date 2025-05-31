<template>
    <div v-if="editor" class="container">
        <div class="control-group">
            <div class="button-group">
                <button
                    @click="
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    "
                    :class="{
                        'is-active': editor.isActive('heading', { level: 1 }),
                    }"
                >
                    H1
                </button>
                <button
                    @click="
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    "
                    :class="{
                        'is-active': editor.isActive('heading', { level: 2 }),
                    }"
                >
                    H2
                </button>
                <button
                    @click="
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    "
                    :class="{
                        'is-active': editor.isActive('heading', { level: 3 }),
                    }"
                >
                    H3
                </button>
                <button
                    @click="editor.chain().focus().setParagraph().run()"
                    :class="{ 'is-active': editor.isActive('paragraph') }"
                >
                    Paragraph
                </button>
                <button
                    @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }"
                >
                    Bold
                </button>
                <button
                    @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }"
                >
                    Italic
                </button>
                <button
                    @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }"
                >
                    Strike
                </button>
                <button
                    @click="editor.chain().focus().toggleHighlight().run()"
                    :class="{ 'is-active': editor.isActive('highlight') }"
                >
                    Highlight
                </button>
                <button
                    @click="editor.chain().focus().setTextAlign('left').run()"
                    :class="{
                        'is-active': editor.isActive({ textAlign: 'left' }),
                    }"
                >
                    Left
                </button>
                <button
                    @click="editor.chain().focus().setTextAlign('center').run()"
                    :class="{
                        'is-active': editor.isActive({ textAlign: 'center' }),
                    }"
                >
                    Center
                </button>
                <button
                    @click="editor.chain().focus().setTextAlign('right').run()"
                    :class="{
                        'is-active': editor.isActive({ textAlign: 'right' }),
                    }"
                >
                    Right
                </button>
                <button
                    @click="
                        editor.chain().focus().setTextAlign('justify').run()
                    "
                    :class="{
                        'is-active': editor.isActive({ textAlign: 'justify' }),
                    }"
                >
                    Justify
                </button>
            </div>
        </div>
        <editor-content :editor="editor" />
    </div>
</template>

<script>
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";

export default {
    components: {
        EditorContent,
    },

    data() {
        return {
            editor: null,
        };
    },

    mounted() {
        this.editor = new Editor({
            extensions: [StarterKit, Highlight, Typography],
            content: `
        <p>
          Markdown shortcuts make it easy to format the text while typing.
        </p>
        <p>
          To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.
        </p>
        <p>
          Those conventions are called input rules in Tiptap. Some of them are enabled by default. Try <code>></code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>\`foobar\`</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.
        </p>
        <p>
          You can overwrite existing input rules or add your own to nodes, marks and extensions.
        </p>
        <p>
          For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-></code>, <code>>></code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.
        </p>
      `,
        });
    },

    beforeUnmount() {
        this.editor.destroy();
    },
};
</script>

<style lang="scss">
/* Basic editor styles */
</style>
