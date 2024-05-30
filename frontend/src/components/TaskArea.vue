<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingTask from "./PairingTask.vue";
import { useDropEvent } from "@/composables/dragAndDrop";
const store = useStore();
const tasks = computed(() => {
  return store.unassignedTasks;
});
const taskAreaElement = ref<HTMLElement | null>(null);
function createTask() {
  store.createEntity("task");
}

useDropEvent(taskAreaElement, undefined);
</script>
<template>
  <div id="taskArea" @dragenter.prevent @dragover.prevent ref="taskAreaElement">
    Tasks
    <button @click="createTask">+</button>
    <PairingTask v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

/* In TaskArea.vue */
<style scoped>
#taskArea {
  background-color: var(--bg-color-secondary);
  padding: var(--padding-medium);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button {
  margin-top: var(--margin-small);
  margin-bottom: var(--margin-small);
}
</style>
