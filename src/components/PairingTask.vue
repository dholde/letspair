<script setup lang="ts">
import { computed, ref } from "vue";
import {
  useDragEndEvent,
  useDragOverEvent,
  useDragStartEvent,
} from "@/composables/dragAndDrop";

const props = defineProps(["task"]);
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
      {{
        task.description !== ""
          ? task.description
          : "Add a task decription here"
      }}
    </div>
  </div>
  <div id="myModal" class="modal" :style="{ display: modalDisplay }">
    <!-- Modal content -->
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div class="modal-content-wrapper">
        <label>Description: </label>
        <input
          :value="props.task.decription"
          placeholder="Add the task description here"
        />
        <label>Link: </label>
        <input :value="props.task.decription" placeholder="Add the link here" />
        <label>Link text: </label>
        <input
          :value="props.task.decription"
          placeholder="Add the link text here"
        />
      </div>
    </div>
  </div>
</template>

<style>
.task {
  height: 2em;
  position: relative;
  background-color: var(--bg-color-task);
  margin: 5px;
}
.inner {
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
</style>
