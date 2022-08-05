<script setup lang="ts">
import { computed, ref } from "vue";
import { useDragAndDrop } from "@/composables/dragAndDrop";

const props = defineProps(["task"]);
const taskAsString = computed(() => JSON.stringify(props.task));
const taskElement = ref<HTMLElement | null>(null);
const isDragged = useDragAndDrop(
  props.task.id,
  "task",
  taskAsString.value,
  taskElement
);
</script>
<template>
  <div
    class="task"
    draggable="true"
    :class="{ draft: task.isDraft, dragged: isDragged }"
    ref="taskElement"
  >
    <div class="inner">
      {{
        task.description !== ""
          ? task.description
          : "Add a task decription here"
      }}
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
</style>
