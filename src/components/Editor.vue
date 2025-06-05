<template>
  <div class="flex flex-col">
    <div
      class="buttons flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 shrink-0"
    >
      <button
        v-for="command in commands"
        :key="command.cmd"
        class="btn btn-xs btn-success tooltip tooltip-bottom"
        :title="command.desc"
        :data-tip="command.cmd"
        @click="doCommand(command)"
        @mousedown.prevent
      >
        <component
          v-if="command.iconComponent"
          :is="command.iconComponent"
          :size="16"
        />
        <span v-else>{{ command.cmd }}</span>
      </button>
    </div>
    <div
      ref="editorDiv"
      class="h-full p-3 flex-1 outline-none"
      contentEditable="true"
      @input="emit('update:modelValue', editorDiv ? editorDiv.innerHTML : '')"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from "vue";
import {
  Palette,
  Bold,
  Type,
  Baseline,
  Pilcrow,
  Highlighter,
  Indent,
  Minus,
  Image,
  ListOrdered,
  List,
  FileText,
  Italic,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Outdent,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Code2,
  Undo2,
} from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorDiv = ref(null);

watch(
  () => props.modelValue,
  (newValue) => {
    const currentEditorHTML = editorDiv.value ? editorDiv.value.innerHTML : "";
    if (editorDiv.value && currentEditorHTML !== (newValue || "")) {
      editorDiv.value.innerHTML = newValue || "";
    }
  }
);

onMounted(() => {
  if (editorDiv.value) {
    editorDiv.value.innerHTML = props.modelValue || "";
  }
});

const commands = [
  {
    cmd: "bold",
    iconComponent: Bold,
    desc: "Toggles bold on/off for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)",
  },
  {
    cmd: "italic",
    iconComponent: Italic,
    desc: "Toggles italics on/off for the selection or at the insertion point. (Internet Explorer uses the EM tag instead of I.)",
  },
  {
    cmd: "underline",
    iconComponent: Underline,
    desc: "Toggles underline on/off for the selection or at the insertion point.",
  },
  {
    cmd: "strikeThrough",
    iconComponent: Strikethrough,
    desc: "Toggles strikethrough on/off for the selection or at the insertion point.",
  },
  {
    cmd: "fontName",
    val: "'Inconsolata', monospace",
    iconComponent: Type,
    desc: 'Changes the font name for the selection or at the insertion point. This requires a font name string ("Arial" for example) to be passed in as a value argument.',
  },
  {
    cmd: "fontSize",
    val: "1-7",
    iconComponent: Baseline,
    desc: "Changes the font size for the selection or at the insertion point. This requires an HTML font size (1-7) to be passed in as a value argument.",
  },
  {
    cmd: "foreColor",
    val: "blue",
    iconComponent: Palette,
    desc: "Changes a font color for the selection or at the insertion point. This requires a color value string to be passed in as a value argument.",
  },
  {
    cmd: "backColor",
    val: "lime",
    iconComponent: Palette,
    desc: "Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead. This requires a color value string to be passed in as a value argument. (Internet Explorer uses this to set text background color.)",
  },
  {
    cmd: "hiliteColor",
    val: "Orange",
    iconComponent: Highlighter,
    desc: "Changes the background color for the selection or at the insertion point. Requires a color value string to be passed in as a value argument. UseCSS must be turned on for this to function. (Not supported by Internet Explorer.)",
  },
  {
    cmd: "formatBlock",
    val: "<pre>",
    iconComponent: Code2,
    desc: 'Adds an HTML block-style tag around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag-name string to be passed in as a value argument. Virtually all block style tags can be used (eg. "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer supports only heading tags H1 - H6, ADDRESS, and PRE, which must also include the tag delimiters &lt; &gt;, such as "&lt;H1&gt;".)',
    skipPrompt: true,
  },
  {
    cmd: "formatBlock",
    val: "<blockquote>",
    iconComponent: Pilcrow,
    desc: 'Adds an HTML block-style tag around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag-name string to be passed in as a value argument. Virtually all block style tags can be used (eg. "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer supports only heading tags H1 - H6, ADDRESS, and PRE, which must also include the tag delimiters &lt; &gt;, such as "&lt;H1&gt;".)',
    skipPrompt: true,
  },
  {
    cmd: "insertHorizontalRule",
    iconComponent: Minus,
    desc: "Inserts a horizontal rule at the insertion point (deletes selection).",
  },
  {
    cmd: "insertImage",
    val: "http://dummyimage.com/160x90",
    iconComponent: Image,
    desc: "Inserts an image at the insertion point (deletes selection). Requires the image SRC URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)",
  },
  {
    cmd: "insertOrderedList",
    iconComponent: ListOrdered,
    desc: "Creates a numbered ordered list for the selection or at the insertion point.",
  },
  {
    cmd: "insertUnorderedList",
    iconComponent: List,
    desc: "Creates a bulleted unordered list for the selection or at the insertion point.",
  },
  {
    cmd: "insertText",
    val: new Date(),
    iconComponent: FileText,
    desc: "Inserts the given plain text at the insertion point (deletes selection).",
  },
  {
    cmd: "justifyCenter",
    iconComponent: AlignCenter,
    desc: "Centers the selection or insertion point.",
  },
  {
    cmd: "justifyFull",
    iconComponent: AlignJustify,
    desc: "Justifies the selection or insertion point.",
  },
  {
    cmd: "justifyLeft",
    iconComponent: AlignLeft,
    desc: "Justifies the selection or insertion point to the left.",
  },
  {
    cmd: "justifyRight",
    iconComponent: AlignRight,
    desc: "Right-justifies the selection or the insertion point.",
  },
  {
    cmd: "outdent",
    iconComponent: Outdent,
    desc: "Outdents the line containing the selection or insertion point.",
  },
  {
    cmd: "indent",
    iconComponent: Indent,
    desc: "Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different levels of indentation, only the least indented lines in the selection will be indented.",
  },
  {
    cmd: "redo",
    iconComponent: Redo2,
    desc: "Redoes the previous undo command.",
  },
  {
    cmd: "undo",
    iconComponent: Undo2,
    desc: "Undoes the last executed command.",
  },
  {
    cmd: "removeFormat",
    iconComponent: RemoveFormatting,
    desc: "Removes all formatting from the current selection.",
  },
  {
    cmd: "subscript",
    iconComponent: Subscript,
    desc: "Toggles subscript on/off for the selection or at the insertion point.",
  },
  {
    cmd: "superscript",
    iconComponent: Superscript,
    desc: "Toggles superscript on/off for the selection or at the insertion point.",
  },
];

const doCommand = (command) => {
  let valueArgument = command.val;
  if (command.skipPrompt !== true && typeof command.val !== "undefined") {
    if (typeof window !== "undefined" && window.prompt) {
      const promptedValue = window.prompt(
        `Value for ${command.cmd}?`,
        command.val
      );
      if (promptedValue === null) {
        return;
      }
      valueArgument = promptedValue;
    } else {
      console.warn(
        `Prompt not available in this environment for command: ${cmd.cmd}`
      );
      return;
    }
  }

  document.execCommand(command.cmd, false, valueArgument);
  if (editorDiv.value) {
    editorDiv.value.focus();
    emit("update:modelValue", editorDiv.value.innerHTML);
  }
};
</script>
