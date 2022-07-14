<script setup lang="ts">
defineProps(["user"]);
</script>
<template>
  <div class="user" draggable="true">
    <div class="inner">
      {{ user.name ? user.name : "User Name" }}
    </div>
  </div>
</template>

<style>
.user {
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
