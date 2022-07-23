<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingUser from "./PairingUser.vue";
import axios from "axios";
import DraggableElement from "./DraggableElement.vue";
const props = defineProps(["lane"]);
const store = useStore();
const users = computed(() => {
  return store.usersForLaneId(props.lane.id);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onDrop(event: DragEvent) {
  event.preventDefault();
  const userAsString: string = event.dataTransfer?.getData("user") as string;
  const userFromDropEvent = JSON.parse(userAsString);
  await axios.put("http://localhost:3000/user", userFromDropEvent);
  store.addUserToLane(userFromDropEvent, props.lane.id);
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
        <li v-for="user in users" :key="user.id">
          <DraggableElement :user="user" />
        </li>
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
