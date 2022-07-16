<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/stores/letspairStore";
const props = defineProps(["lane"]);
const store = useStore();
const users = computed(() => {
  return store.usersForLaneId(props.lane.id);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDrop(event: any) {
  event.preventDefault();
}
</script>
<template>
  <div
    :id="lane.id"
    class="pairing-lane"
    @drop="onDrop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="users">
      <ul class="no-bullets">
        <li v-for="user in users" :key="user.id">{{ user.name }}</li>
      </ul>
    </div>
    <div class="tasks"></div>
  </div>
</template>
<style scoped>
.pairing-lane {
  margin: var(--margin-medium);
  padding: var(--padding-small);
  /*background-color: var(--bg-color-main);*/
  background-color: red;
}
.users {
  min-height: 35px;
}
.tasks {
  min-height: 50px;
}
</style>
