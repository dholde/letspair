<script setup lang="ts">
import { useStore } from "@/stores/letsPairStore";
defineProps(["task"]);
</script>
<template>
  <div class="task">
    {{
      task.description !== "" ? task.description : "Add a task decription here"
    }}
  </div>
</template>

<style>
.task {
  height: 3em;
}
</style>
