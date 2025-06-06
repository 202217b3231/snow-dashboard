<template>
  <div class="flex flex-col">
    <div
      class="buttons flex flex-wrap items-center gap-2 p-2 border-b border-base-300 shrink-0"
    >
      <button
        @click="copySelectedNoteContent"
        class="btn btn-xs btn-outline btn-primary tooltip"
        :data-tip="copyHtmlTooltip"
      >
        Copy HTML
      </button>
      <button
        v-for="command in commands"
        :key="command.cmd"
        class="btn btn-xs btn-accent tooltip tooltip-bottom"
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
        <span v-else-if="command.displayText">{{ command.displayText }}</span>
        <span v-else>{{ command.cmd }}</span>
      </button>
      <select
        class="btn btn-xs text-sm bg-accent focus:outline-0 border-0 w-fit"
        title="Text Alignment"
        @change="handleAlignmentChange"
        v-model="selectedAlignment"
      >
        <option value="" disabled selected>Align</option>
        <option
          v-for="alignCmd in alignmentCommands"
          :key="alignCmd.cmd"
          :value="alignCmd.cmd"
        >
          {{ alignCmd.displayText || alignCmd.cmd.replace("justify", "") }}
        </option>
      </select>
      <select
        class="btn btn-xs text-sm bg-accent focus:outline-0 border-0 w-fit"
        title="Text Size"
        @change="handleSizeChange"
        v-model="selectedSize"
      >
        <option value="" disabled selected>Size</option>
        <option
          v-for="sizeCmd in textSizeCommands"
          :key="sizeCmd.cmd"
          :value="sizeCmd.val"
        >
          {{ sizeCmd.val }}
        </option>
      </select>
    </div>
    <div
      ref="editorDiv"
      class="h-full p-3 flex-1 outline-none w-270"
      contentEditable="true"
      @input="emit('update:modelValue', editorDiv ? editorDiv.innerHTML : '')"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits, computed } from "vue";

import {
  Palette,
  Bold,
  Type,
  Pilcrow,
  Highlighter,
  Indent,
  Minus,
  Image,
  ListOrdered,
  List,
  FileText,
  Italic,
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
const selectedAlignment = ref("");
const selectedSize = ref("");
const copyHtmlTooltip = ref("Copy");
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

const allCommandsDefinition = [
  {
    cmd: "bold",
    iconComponent: Bold,
  },
  {
    cmd: "italic",
    iconComponent: Italic,
  },
  {
    cmd: "underline",
    iconComponent: Underline,
  },
  {
    cmd: "strikeThrough",
    iconComponent: Strikethrough,
  },
  {
    cmd: "fontName",
    val: "'Inconsolata', monospace",
    iconComponent: Type,
  },
  {
    cmd: "fontSize",
    val: "1",
    skipPrompt: true,
  },
  {
    cmd: "fontSize",
    val: "2",
    skipPrompt: true,
  },
  {
    cmd: "fontSize",
    val: "3",
    skipPrompt: true,
  },
  {
    cmd: "fontSize",
    val: "4",
    skipPrompt: true,
  },
  {
    cmd: "fontSize",
    val: "5",
    skipPrompt: true,
  },
  {
    cmd: "fontSize",
    val: "6",
    skipPrompt: true,
  },
  {
    cmd: "fontSize",
    val: "7",
    skipPrompt: true,
  },
  {
    cmd: "foreColor",
    val: "blue",
    iconComponent: Palette,
  },
  {
    cmd: "backColor",
    val: "lime",
    iconComponent: Palette,
  },
  {
    cmd: "hiliteColor",
    val: "Orange",
    iconComponent: Highlighter,
  },
  {
    cmd: "formatBlock",
    val: "<pre>",
    iconComponent: Code2,

    skipPrompt: true,
  },
  {
    cmd: "formatBlock",
    val: "<blockquote>",
    iconComponent: Pilcrow,

    skipPrompt: true,
  },
  {
    cmd: "insertHorizontalRule",
    iconComponent: Minus,
  },
  {
    cmd: "insertImage",
    val: "http://dummyimage.com/160x90",
    iconComponent: Image,
  },
  {
    cmd: "insertOrderedList",
    iconComponent: ListOrdered,
  },
  {
    cmd: "insertUnorderedList",
    iconComponent: List,
  },
  {
    cmd: "insertText",
    val: new Date(),
    iconComponent: FileText,
  },
  {
    cmd: "justifyCenter",
    displayText: "Center",
  },
  {
    cmd: "justifyFull",
    displayText: "Justify",
  },
  {
    cmd: "justifyLeft",
    displayText: "Left",
  },
  {
    cmd: "justifyRight",
    displayText: "Right",
  },
  {
    cmd: "outdent",
    iconComponent: Outdent,
  },
  {
    cmd: "indent",
    iconComponent: Indent,
  },
  {
    cmd: "redo",
    iconComponent: Redo2,
  },
  {
    cmd: "undo",
    iconComponent: Undo2,
  },
  {
    cmd: "removeFormat",
    iconComponent: RemoveFormatting,
  },
  {
    cmd: "subscript",
    iconComponent: Subscript,
  },
  {
    cmd: "superscript",
    iconComponent: Superscript,
  },
];

const commands = computed(() => {
  const alignmentCmds = [
    "justifyCenter",
    "justifyFull",
    "justifyLeft",
    "justifyRight",
    "fontSize",
  ];
  return allCommandsDefinition.filter(
    (cmd) => !alignmentCmds.includes(cmd.cmd)
  );
});

const alignmentCommands = computed(() => {
  const alignmentCmds = [
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "justifyFull",
  ];
  return allCommandsDefinition.filter((cmd) => alignmentCmds.includes(cmd.cmd));
});

const textSizeCommands = computed(() => {
  return allCommandsDefinition.filter((cmd) => cmd.cmd == "fontSize");
});

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
      console.log(
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
const handleAlignmentChange = (event) => {
  const selectedCmd = event.target.value;
  if (selectedCmd) {
    const commandToExecute = allCommandsDefinition.find(
      (cmd) => cmd.cmd === selectedCmd
    );
    if (commandToExecute) {
      doCommand(commandToExecute);
    }
    selectedAlignment.value = "";
  }
};
const handleSizeChange = (event) => {
  const selectedValue = event.target.value;
  if (selectedValue) {
    const commandToExecute = allCommandsDefinition.find(
      (cmd) => cmd.cmd === "fontSize" && cmd.val === selectedValue
    );
    if (commandToExecute) {
      doCommand(commandToExecute);
    }
    selectedSize.value = "";
  }
};
async function copySelectedNoteContent() {
  if (props.modelValue) {
    try {
      const htmlContent = props.modelValue;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);
      copyHtmlTooltip.value = "Copied HTML!";
    } catch (err) {
      console.error("Failed to copy HTML content: ", err);
      try {
        await navigator.clipboard.writeText(
          props.modelValue.replace(/<[^>]*>?/gm, "") // Use props.modelValue
        );
        copyHtmlTooltip.value = "Copied as plain text (HTML copy failed)";
      } catch (fallbackErr) {
        console.error("Fallback plain text copy failed: ", fallbackErr);
        copyHtmlTooltip.value = "Failed to copy";
      }
    }
  } else {
    copyHtmlTooltip.value = "Nothing to copy";
  }

  // Reset tooltip after a delay
  // Ensure this runs regardless of which path was taken, if the tooltip changed.
  const initialTooltip = "Copy";
  if (copyHtmlTooltip.value !== initialTooltip) {
    setTimeout(() => {
      copyHtmlTooltip.value = initialTooltip;
    }, 2500); // Adjust delay as needed
  }
}
</script>
