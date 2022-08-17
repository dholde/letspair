<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import type { User } from "@/models/User";
import axios from "axios";
import PairingUser from "./PairingUser.vue";
import { useDropEvent } from "@/composables/dragAndDrop";

const store = useStore();
const userAreaElement = ref<HTMLElement | null>(null);
const users = computed(() => {
  return store.unassignedUsers;
});

function createUser() {
  store.createUser();
}

useDropEvent(userAreaElement, "http://localhost:3000/user");
</script>

<template>
  <div
    id="userArea"
    @dragenter.prevent
    @dragover.prevent
    @drop="onDrop($event)"
    ref="userAreaElement"
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
