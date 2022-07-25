<script setup lang="ts">
import { computed } from "vue";
import { dragStartHandler } from "@/utils/dragStartEventHandler";

const props = defineProps(["task"]);
const taskAsString = computed(() => JSON.stringify(props.task));
</script>
<template>
  <div
    class="task"
    draggable="true"
    @dragstart="dragStartHandler('task', taskAsString, $event)"
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
