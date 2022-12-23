<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingUser from "./PairingUser.vue";
import PairingTask from "./PairingTask.vue";
import { useDropEvent } from "@/composables/dragAndDrop";
const props = defineProps(["lane"]);
const laneElement = ref<HTMLElement | null>(null);
const store = useStore();
const users = computed(() => {
  return store.usersForLaneId(props.lane.id);
});
const tasks = computed(() => {
  return store.tasksForLaneId(props.lane.id);
});

useDropEvent(laneElement, props.lane.id);

function onDragEnter(event: DragEvent) {
  if (store.dragAndDropInfo.currentLaneId !== props.lane.id) {
    store.dragAndDropInfo.currentLaneId = props.lane.id;
    const dataTransferType = event.dataTransfer?.items[0].type;
    if (dataTransferType) {
      store.removeDraftItem(dataTransferType);
    }
  }
}
</script>
<template>
  <div
    :id="lane.id"
    class="pairing-lane"
    ref="laneElement"
    @dragenter="onDragEnter($event)"
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
