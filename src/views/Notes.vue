<script setup>
import { onMounted, ref, watch } from "vue";
import { Trash } from "lucide-vue-next";
import Editor from "@/components/Editor.vue";
import initialDefaultNoteContent from "@/components/DefaultNote.vue";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DEFAULT_NOTE_ID = "system-default-note-001";
const defaultNoteObject = {
  id: DEFAULT_NOTE_ID,
  content: initialDefaultNoteContent,
};

let timeout = undefined;
const isRemove = ref(false);
const selectedNote = ref(null);
const Notes = ref([]);

const saveNotes = () => {
  localStorage.setItem("notes", JSON.stringify(Notes.value));
};

const addNote = () => {
  const newNote = {
    id: Date.now(),
    content: "",
  };
  Notes.value.push(newNote);
  selectedNote.value = newNote;
  saveNotes();
};

const toggleRemove = () => {
  isRemove.value = !isRemove.value;

  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    isRemove.value = !isRemove.value;
  }, 5000);
};

const removeNote = (note) => {
  if (note.id === DEFAULT_NOTE_ID) {
    return;
  }
  Notes.value = Notes.value.filter((n) => n.id != note.id);
  if (selectedNote.value && selectedNote.value.id === note.id) {
    selectedNote.value =
      Notes.value.find((n) => n.id === DEFAULT_NOTE_ID) ||
      (Notes.value.length > 0 ? Notes.value[0] : null);
  }
  saveNotes();
};

const selectNote = (note) => {
  selectedNote.value = note;
};
onMounted(() => {
  const savedNotesRaw = localStorage.getItem("notes");
  let notesFromStorage = [];
  if (savedNotesRaw) {
    try {
      notesFromStorage = JSON.parse(savedNotesRaw);
      if (!Array.isArray(notesFromStorage)) {
        notesFromStorage = [];
      }
    } catch (e) {
      console.error("Error parsing notes from localStorage:", e);
      notesFromStorage = [];
    }
  }

  let finalNotes = [...notesFromStorage];
  const defaultNoteIndex = finalNotes.findIndex(
    (note) => note.id === DEFAULT_NOTE_ID
  );

  if (defaultNoteIndex === -1) {
    finalNotes.unshift({ ...defaultNoteObject });
    Notes.value = finalNotes;
    saveNotes();
  } else {
    const existingDefaultNote = finalNotes.splice(defaultNoteIndex, 1)[0];
    finalNotes.unshift({
      ...defaultNoteObject,
      ...existingDefaultNote,
      id: DEFAULT_NOTE_ID,
    });
    Notes.value = finalNotes;
    if (defaultNoteIndex !== 0) {
      saveNotes();
    }
  }
  if (!selectedNote.value && Notes.value.length > 0) {
    selectedNote.value =
      Notes.value.find((n) => n.id === DEFAULT_NOTE_ID) || Notes.value[0];
  }
});

const debouncedSavedNotes = debounce(saveNotes, 1000);

watch(
  () => selectedNote.value?.content,
  (newContent, oldContent) => {
    if (selectedNote.value && newContent !== oldContent) {
      debouncedSavedNotes();
    }
  }
);
</script>

<template>
  <main class="flex w-full h-full p-3">
    <aside class="flex flex-col gap-2 max-h-145 w-64">
      <label class="input rounded mt-5">
        <button class="label btn text-xl rounded text-info" @click="addNote">
          ➕&#65038;
        </button>
        <input
          type="search"
          placeholder="Search"
          class="col-span-5 focus:outline-0 pl-2"
        />
        <button
          class="label btn text-xl rounded text-error"
          @click="toggleRemove"
        >
          <Trash size="20" />
        </button>
      </label>
      <ul class="flex-1 pt-1 px-0 space-y-2 overflow-y-scroll">
        <li
          :key="note.id"
          v-for="(note, index) in Notes"
          class="bg-base-300 flex justify-between text-center h-8 rounded-lg relative cursor-pointer"
          :class="{
            'bg-info text-info-content':
              selectedNote && selectedNote.id === note.id,
          }"
          @click="selectNote(note)"
        >
          <p class="badge badge-xs">{{ index + 1 }}</p>
          <p
            v-if="note.id != DEFAULT_NOTE_ID"
            class="truncate pl-5 flex-1 text-left"
          >
            {{ (note.content || "").split("<div>")[0].replace(/<.*?>|<\/.*?>/g, "") || "Empty Note" }}
          </p>
          <p
            v-if="isRemove && note.id !== DEFAULT_NOTE_ID"
            class="p-1 bg-error text-error-content rounded-r-lg"
            @click.stop="removeNote(note)"
          >
            <Trash size="20" />
          </p>
        </li>
      </ul>
    </aside>
    <section class="flex flex-1 flex-col p-3">
      <template v-if="selectedNote">
        <Editor
          class="border rounded w-full h-full bg-base-100"
          v-model="selectedNote.content"
        />
      </template>
      <p v-else>Select a note</p>
    </section>
  </main>
</template>

<style scoped></style>
