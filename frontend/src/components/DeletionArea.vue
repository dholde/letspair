<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import { useDropEvent } from "@/composables/dragAndDrop";
const deletionAreaElement = ref<HTMLElement | null>(null);
const store = useStore();
useDropEvent(deletionAreaElement, undefined);
</script>
<template>
  <div
    id="deletionArea"
    ref="deletionAreaElement"
    class="deletion-area"
    @dragover.prevent
    @dragenter.prevent
  ></div>
</template>
<style scoped>
.deletion-area {
  margin: var(--margin-medium);
  padding: var(--padding-small);
  /*background-color: var(--bg-color-main);*/
  background-color: green;
}
</style>
