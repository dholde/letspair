<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import type { User } from "@/models/User";
import axios from "axios";
import PairingUser from "./PairingUser.vue";

const store = useStore();
const users = computed(() => {
  return store.unassignedUsers;
});

function createUser() {
  store.createUser();
}

async function onDrop(event: DragEvent) {
  event.preventDefault();
  const userAsString: string = event.dataTransfer?.getData("user") as string;
  const userFromDropEvent = JSON.parse(userAsString) as User;
  userFromDropEvent.laneId = undefined;
  await axios.put("http://localhost:3000/user", userFromDropEvent);
  store.freeUpUser(userFromDropEvent);
}
</script>

<template>
  <div
    id="userArea"
    @dragenter.prevent
    @dragover.prevent
    @drop="onDrop($event)"
  >
    Users
    <button @click="createUser">+</button>
    <ul class="no-bullets">
      <li v-for="user in users" :key="user.id" :user="user">
        <PairingUser :user="user" />
      </li>
    </ul>
  </div>
</template>
