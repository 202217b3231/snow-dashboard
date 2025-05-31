<script setup>
import { onMounted, ref } from "vue";
import { Trash } from "lucide-vue-next";
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const timeout = undefined;
const isRemove = ref(false);
const selectedNote = ref();
const Notes = ref([]);

const saveNotes = () => {
  localStorage.setItem("notes", JSON.stringify(Notes.value));
  console.log("Saved!!");
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
  Notes.value = Notes.value.filter((n) => n.id != note.id);
  saveNotes();
};

const selectNote = (note) => {
  selectedNote.value = note;
};

onMounted(() => {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    Notes.value = JSON.parse(savedNotes);
  }
});

const debouncedSavedNotes = debounce(saveNotes, 1000);
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
      <ul class="flex-1 pt-2 space-y-2 overflow-y-scroll">
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
          <div class="truncate pl-5">{{ note.content.split("\n")[0] }}</div>
          <p
            v-if="isRemove"
            class="p-1 bg-error text-error-content rounded-r-lg"
            @click="removeNote(note)"
          >
            <Trash size="20" />
          </p>
        </li>
      </ul>
    </aside>
    <section class="flex flex-1 flex-col p-3">
      <template v-if="selectedNote">
        <textarea
          class="border rounded w-full h-full bg-base-200"
          v-model="selectedNote.content"
          @input="debouncedSavedNotes"
        ></textarea>
      </template>
      <p v-else>Select a note</p>
    </section>
  </main>
</template>

<style></style>
