<template>
    <div class="toolbar">
        <select
            @change="onHeadingChange"
            :value="currentHeading"
            class="select w-fit"
        >
            <option value="">p</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
        </select>
        <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ active: editor.isActive('bold') }"
        >
            <strong> Bold </strong>
        </button>
        <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ active: editor.isActive('italic') }"
        >
            <em> Italic </em>
        </button>
        <button
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ active: editor.isActive('strike') }"
        >
            <s> Strike </s>
        </button>

        <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ active: editor.isActive('bulletList') }"
            class="tooltip tooltip-bottom"
            data-tip="Bullet List"
        >
            <List />
        </button>
        <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ active: editor.isActive('orderedList') }"
            class="tooltip tooltip-bottom"
            data-tip="Ordered List"
        >
            <ListOrdered />
        </button>
        <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ active: editor.isActive('codeBlock') }"
            class="tooltip tooltip-bottom"
            data-tip="Code Block"
        >
            <Code />
        </button>
        <button
            @click="editor.chain().focus().setHorizontalRule().run()"
            class="tooltip tooltip-bottom"
            data-tip="Horizontal Rule"
        >
            <SeparatorHorizontal />
        </button>
        <button
            @click="editor.chain().focus().toggleCode().run()"
            :class="{ active: editor.isActive('code') }"
            class="tooltip tooltip-bottom"
            data-tip="Inline Code: Ctrl+E"
        >
            <SquareCode />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('left').run()"
            class="tooltip tooltip-bottom"
            data-tip="Align Left"
        >
            <AlignLeft />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('center').run()"
            class="tooltip tooltip-bottom"
            data-tip="Align Center"
        >
            <AlignCenter />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('right').run()"
            class="tooltip tooltip-bottom"
            data-tip="Align Right"
        >
            <AlignRight />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('justify').run()"
            class="tooltip tooltip-bottom"
            data-tip="Align Justify"
        >
            <AlignJustify />
        </button>
        <button
            @click="editor.chain().focus().toggleHighlight().run()"
            :class="{ active: editor.isActive('highlight') }"
            class="tooltip tooltip-bottom"
            data-tip="Highlight"
        >
            <Highlighter />
        </button>
        <button
            @click="editor.chain().focus().undo().run()"
            class="tooltip tooltip-bottom"
            data-tip="Undo"
        >
            <Undo />
        </button>
        <button
            @click="editor.chain().focus().redo().run()"
            class="tooltip tooltip-bottom"
            data-tip="Redo"
        >
            <Redo />
        </button>
    </div>
</template>

<script setup>
import {
    Undo,
    Redo,
    Code,
    ListOrdered,
    List,
    SquareCode,
    SeparatorHorizontal,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
} from "lucide-vue-next";

defineProps({
    editor: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}
</style>
