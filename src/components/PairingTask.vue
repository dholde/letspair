<script setup lang="ts">
import { computed, ref } from "vue";
import {
  useDragEndEvent,
  useDragOverEvent,
  useDragStartEvent,
} from "@/composables/dragAndDrop";
import TextInput from "@/components/TextInput.vue";
import { useStore } from "@/stores/letspairStore";
import type { Task } from "@/models/Task";

const store = useStore();
const props = defineProps<{ task: Task }>();
const taskAsString = computed(() => JSON.stringify(props.task));
const taskElement = ref<HTMLElement | null>(null);
const isDragged = ref<boolean>(false);
const modalDisplay = ref<string>("none");
useDragStartEvent(
  props.task.id,
  "task",
  taskAsString.value,
  taskElement,
  isDragged
);
useDragEndEvent(taskElement, isDragged, "task");
useDragOverEvent(props.task.id, taskElement);

function editTask() {
  modalDisplay.value = "block";
}

function closeModal() {
  modalDisplay.value = "none";
}

function onSaveDescription(value: string) {
  const task = { ...props.task };
  task.description = value;
  store.updateTask(task);
}

function onSaveLink(value: string) {
  const task = { ...props.task };
  task.link = value;
  task.link = prependProtocol(task.link);
  if (!hasLinkText(task)) {
    task.linkText = value;
  }
  store.updateTask(task);
}

function hasLinkText(task: Task): boolean {
  return task.linkText != null && task.linkText !== "";
}

function prependProtocol(taskLink: string) {
  if (!taskLink.startsWith("http") && !taskLink.startsWith("https")) {
    taskLink = `https://${taskLink}`;
  }
  return taskLink;
}

function onSaveLinkText(value: string) {
  const task = { ...props.task };
  task.linkText = value;
  store.updateTask(task);
}
</script>
<template>
  <div
    class="task"
    draggable="true"
    :class="{ draft: task.isDraft, dragged: isDragged }"
    ref="taskElement"
    @click="editTask"
  >
    <div class="inner">
      <div v-if="task.link">
        <a :href="task.link" target="_blank">{{ task.linkText }}</a>
      </div>
      <div>
        {{
          task.description !== ""
            ? task.description
            : "Add a task decription here"
        }}
      </div>
    </div>
  </div>
  <div id="myModal" class="modal" :style="{ display: modalDisplay }">
    <!-- Modal content -->
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div class="modal-content-wrapper">
        <TextInput
          input-type="singleLine"
          label-text="Description"
          :input-value="props.task.description"
          placeholder="Add the task description here"
          @save="onSaveDescription"
        />
        <TextInput
          input-type="singleLine"
          label-text="Link"
          :input-value="props.task.link"
          placeholder="Add the link here"
          @save="onSaveLink"
        />
        <TextInput
          input-type="singleLine"
          label-text="Link text"
          :input-value="props.task.linkText"
          placeholder="Add the link text here"
          @save="onSaveLinkText"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.task {
  min-height: 2em;
  background-color: var(--bg-color-task);
  margin: 5px;
}
.inner {
  padding: 0.5em;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/*Will properly align labels and input fields regardless the close button*/
.modal-content-wrapper {
  overflow: auto;
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

input:hover {
  background-color: var(--bg-color-main);
}

input {
  position: relative;
  height: 50px;
  margin: 2px;
  border: none;
  background-color: transparent;
  padding: 8px;
  width: 98%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
input:focus {
  outline: 2px solid var(--input-focus-color);
}
</style>
