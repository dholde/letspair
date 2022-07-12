<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingLane from "@/components/PairingLane.vue";
const store = useStore();
const lanes = computed(() => {
  return store.lanes;
});

function createLane() {
  store.createLane();
}
</script>
<template>
  <div id="laneArea">
    <button @click="createLane">+</button>
    <ul class="no-bullets">
      <li v-for="lane in lanes" :key="lane.id">
        <PairingLane :lane="lane" />
      </li>
    </ul>
  </div>
</template>
