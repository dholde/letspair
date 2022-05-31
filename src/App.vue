<script setup lang="ts"></script>

<template>
  <div class="container">
    <div id="header" class="header">Header</div>
    <div id="users" class="user-area">Users</div>
    <TaskArea class="task-area">Tasks</TaskArea>
    <div id="lanes" class="lane-area">Lanes</div>
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
