<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingUser from "./PairingUser.vue";
import PairingTask from "./PairingTask.vue";
import axios from "axios";
import type { User } from "@/models/User";
import type { Task } from "@/models/Task";
const props = defineProps(["lane"]);
const store = useStore();
const users = computed(() => {
  return store.usersForLaneId(props.lane.id);
});
const tasks = computed(() => {
  return store.tasksForLaneId(props.lane.id);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onDrop(event: DragEvent) {
  event.preventDefault();
  const dataTransfer = event.dataTransfer;
  if (dataTransfer) {
    const dataTransferType = dataTransfer?.items[0].type;
    const dataTransferData = dataTransfer?.getData(dataTransferType) as string;

    if (dataTransferType === "user") {
      const userFromDropEvent: User = JSON.parse(dataTransferData);
      await axios.put("http://localhost:3000/user", userFromDropEvent);
      store.addUserToLane(userFromDropEvent, props.lane.id);
    } else if (dataTransferType === "task") {
      const taskFromDropEvent: Task = JSON.parse(dataTransferData);
      await axios.put("http://localhost:3000/task", taskFromDropEvent);
      store.addTaskToLane(taskFromDropEvent, props.lane.id);
    }
  }
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
          <PairingUser :user="user" />
        </li>
      </ul>
    </div>
    <div class="tasks">
      <ul class="no-bullets">
        <li v-for="task in tasks" :key="task.id">
          <PairingTask :task="task" />
        </li>
      </ul>
    </div>
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
