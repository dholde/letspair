<script setup lang="ts">
defineProps(["lane"]);
</script>
<template>
  <div :id="lane.id" class="pairing-lane">
    <div class="users"></div>
    <div class="tasks"></div>
  </div>
</template>
<style scoped>
.pairing-lane {
  margin: var(--margin-medium);
  padding: var(--padding-small);
  background-color: var(--bg-color-main);
}
.users {
  min-height: 35px;
}
.tasks {
  min-height: 50px;
}
</style>
