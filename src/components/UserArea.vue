<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingUser from "./PairingUser.vue";

const store = useStore();
const users = computed(() => {
  return store.users;
});

function createUser() {
  store.createUser();
}
</script>

<template>
  <div id="userArea">
    Users
    <button @click="createUser">+</button>
    <PairingUser v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>
