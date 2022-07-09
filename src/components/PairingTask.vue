<script setup lang="ts">
defineProps(["task"]);
</script>
<template>
  <div class="task">
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
