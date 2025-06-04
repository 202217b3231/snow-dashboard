<template>
  <div class="flex flex-col">
    <div
      class="buttons flex flex-wrap gap-1 p-2 border-b border-gray-200 shrink-0"
    >
      <button
        v-for="command in commands"
        :key="command.cmd"
        class="btn btn-xs btn-success"
        :title="command.desc"
        @click="doCommand(command)"
        @mousedown.prevent
      >
        {{ command.cmd }}
      </button>
    </div>
    <div
      ref="editorDiv"
      class="h-full p-3 flex-1 outline-none"
      contentEditable="true"
      @input="onEditorInput"
    ></div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editorDiv = ref(null);

const commands = [
  {
    cmd: "backColor",
    val: "lime",
    desc: "Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead. This requires a color value string to be passed in as a value argument. (Internet Explorer uses this to set text background color.)",
  },
  {
    cmd: "bold",
    icon: "bold",
    desc: "Toggles bold on/off for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)",
  },
  {
    cmd: "createLink",
    val: "chrome://newTab",
    icon: "link",
    desc: "Creates an anchor link from the selection, only if there is a selection. This requires the HREF URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)",
  },
  {
    cmd: "fontName",
    val: "'Inconsolata', monospace",
    desc: 'Changes the font name for the selection or at the insertion point. This requires a font name string ("Arial" for example) to be passed in as a value argument.',
  },
  {
    cmd: "fontSize",
    val: "1-7",
    icon: "text-height",
    desc: "Changes the font size for the selection or at the insertion point. This requires an HTML font size (1-7) to be passed in as a value argument.",
  },
  {
    cmd: "foreColor",
    val: "blue",
    desc: "Changes a font color for the selection or at the insertion point. This requires a color value string to be passed in as a value argument.",
  },
  {
    cmd: "formatBlock",
    val: "<blockquote>",
    desc: 'Adds an HTML block-style tag around the line containing the current selection, replacing the block element containing the line if one exists (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag-name string to be passed in as a value argument. Virtually all block style tags can be used (eg. "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer supports only heading tags H1 - H6, ADDRESS, and PRE, which must also include the tag delimiters &lt; &gt;, such as "&lt;H1&gt;".)',
  },
  {
    cmd: "hiliteColor",
    val: "Orange",
    desc: "Changes the background color for the selection or at the insertion point. Requires a color value string to be passed in as a value argument. UseCSS must be turned on for this to function. (Not supported by Internet Explorer.)",
  },
  {
    cmd: "indent",
    icon: "indent",
    desc: "Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different levels of indentation, only the least indented lines in the selection will be indented.",
  },
  {
    cmd: "insertHorizontalRule",
    desc: "Inserts a horizontal rule at the insertion point (deletes selection).",
  },
  {
    cmd: "insertImage",
    val: "http://dummyimage.com/160x90",
    icon: "picture-o",
    desc: "Inserts an image at the insertion point (deletes selection). Requires the image SRC URI string to be passed in as a value argument. The URI must contain at least a single character, which may be a white space. (Internet Explorer will create a link with a null URI value.)",
  },
  {
    cmd: "insertOrderedList",
    icon: "list-ol",
    desc: "Creates a numbered ordered list for the selection or at the insertion point.",
  },
  {
    cmd: "insertUnorderedList",
    icon: "list-ul",
    desc: "Creates a bulleted unordered list for the selection or at the insertion point.",
  },
  {
    cmd: "insertText",
    val: new Date(),
    icon: "file-text-o",
    desc: "Inserts the given plain text at the insertion point (deletes selection).",
  },
  {
    cmd: "italic",
    icon: "italic",
    desc: "Toggles italics on/off for the selection or at the insertion point. (Internet Explorer uses the EM tag instead of I.)",
  },
  {
    cmd: "justifyCenter",
    icon: "align-center",
    desc: "Centers the selection or insertion point.",
  },
  {
    cmd: "justifyFull",
    icon: "align-justify",
    desc: "Justifies the selection or insertion point.",
  },
  {
    cmd: "justifyLeft",
    icon: "align-left",
    desc: "Justifies the selection or insertion point to the left.",
  },
  {
    cmd: "justifyRight",
    icon: "align-right",
    desc: "Right-justifies the selection or the insertion point.",
  },
  {
    cmd: "outdent",
    icon: "outdent",
    desc: "Outdents the line containing the selection or insertion point.",
  },
  {
    cmd: "redo",
    icon: "repeat",
    desc: "Redoes the previous undo command.",
  },
  {
    cmd: "removeFormat",
    desc: "Removes all formatting from the current selection.",
  },
  {
    cmd: "strikeThrough",
    icon: "strikethrough",
    desc: "Toggles strikethrough on/off for the selection or at the insertion point.",
  },
  {
    cmd: "subscript",
    icon: "subscript",
    desc: "Toggles subscript on/off for the selection or at the insertion point.",
  },
  {
    cmd: "superscript",
    icon: "superscript",
    desc: "Toggles superscript on/off for the selection or at the insertion point.",
  },
  {
    cmd: "underline",
    icon: "underline",
    desc: "Toggles underline on/off for the selection or at the insertion point.",
  },
  {
    cmd: "undo",
    icon: "undo",
    desc: "Undoes the last executed command.",
  },
  {
    cmd: "unlink",
    icon: "chain-broken",
    desc: "Removes the anchor tag from a selected anchor link.",
  },
];

const doCommand = (cmd) => {
  let val = "";
  if (typeof cmd.val !== "undefined") {
    if (typeof window !== "undefined" && window.prompt) {
      val = window.prompt("Value for " + cmd.cmd + "?", cmd.val) || "";
    } else {
      console.warn(
        `Prompt not available in this environment for command: ${cmd.cmd}`
      );
      return;
    }
  }

  document.execCommand(cmd.cmd, false, val);
};
</script>

<script>
export default {
  watch: {
    "$refs.editor.innerHTML"(newContent) {
      this.$emit("update-content", newContent);
    },
  },
};
</script>
