<script setup lang="ts">
import TaskArea from "@/components/TaskArea.vue";
import UserArea from "@/components/UserArea.vue";
import LaneArea from "@/components/LaneArea.vue";
import DeletionArea from "@/components/DeletionArea.vue";
</script>

<template>
  <div class="container">
    <!-- <div id="header" class="header">Header</div> -->
    <DeletionArea class="deletion-area" />
    <UserArea class="user-area" />
    <TaskArea class="task-area" />
    <LaneArea class="lane-area" />
  </div>
</template>

<style>
@import "@/assets/base.css";
.container {
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color-main);
  display: grid;
  grid-gap: 0.3em;
  grid-template-columns: 25% auto;
  grid-template-rows: 10% 45% 45%;
  grid-template-areas:
    "header header"
    "userarea lanearea"
    "taskarea lanearea";
}
.header {
  grid-area: header;
  background-color: var(--bg-color-secondary);
}

.deletion-area {
  grid-area: header;
  background-color: var(--bg-color-secondary);
}

.user-area {
  grid-area: userarea;
  background-color: var(--bg-color-secondary);
}

.task-area {
  grid-area: taskarea;
  background-color: var(--bg-color-secondary);
}

.lane-area {
  grid-area: lanearea;
  background-color: var(--bg-color-secondary);
}
</style>
