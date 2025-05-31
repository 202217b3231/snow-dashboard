<template>
    <div>
        <EditorMenuBar :editor="editor" />
        <editor-content :editor="editor" class="editor-content" />
    </div>
</template>

<script setup>
import EditorMenuBar from "./EditorMenuBar.vue";
import { ref, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";

import { FontSize } from "./font-size.js";

const editor = ref(
    new Editor({
        extensions: [
            StarterKit,
            Image,
            TaskList,
            TaskItem,
            Typography,
            Highlight,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            FontSize,
        ],
        content: "<p>Hello <b>World!</b></p>",
    }),
);

onBeforeUnmount(() => {
    editor.value.destroy();
});
</script>

<style></style>
