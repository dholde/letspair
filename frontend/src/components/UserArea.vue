<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
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

useDropEvent(userAreaElement, undefined);
</script>

<template>
  <div id="userArea" @dragenter.prevent @dragover.prevent ref="userAreaElement">
    Users
    <button @click="createUser">+</button>
    <PairingUser v-for="user in users" :key="user.id" :user="user" />
    <!-- <ul class="no-bullets">
      <li v-for="user in users" :key="user.id" :user="user">
        <PairingUser :user="user" />
      </li>
    </ul> -->
  </div>
</template>

<style scoped>
#userArea {
  background-color: var(--bg-color-secondary);
  padding: var(--padding-medium);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: var(--margin-medium);
}

button {
  margin-top: var(--margin-small);
  margin-bottom: var(--margin-small);
}

ul.no-bullets {
  padding: 0;
}

.user {
  background-color: var(--bg-color-task);
  border-radius: 5px;
  margin-bottom: var(--margin-small);
  padding: var(--padding-small);
  transition: background-color 0.3s ease;
}

.user:hover {
  background-color: var(--input-focus-color);
}

input {
  width: 100%;
  padding: var(--padding-small);
  border: none;
  background-color: transparent;
  box-shadow: inset 0 -1px 0 0 var(--bg-color-main);
}
</style>
