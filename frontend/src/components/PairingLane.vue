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
  background-color: var(--bg-color-secondary);
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: var(--padding-medium);
  margin-bottom: var(--margin-medium);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.users,
.tasks {
  min-height: 50px;
}

.no-bullets {
  padding-left: 0;
}
</style>
