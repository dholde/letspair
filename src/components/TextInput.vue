<script setup lang="ts">
import { ref } from "vue";
defineProps<{
  labelText: string;
  inputValue: string;
  placeholder: string;
}>();
const isEdit = ref<boolean>(false);
</script>
<template>
  <div class="textInput">
    <label>{{ labelText }}: </label>
    <input :value="inputValue" :placeholder="placeholder" />
    <div v-if="isEdit">
      <button>Save</button>
      <button>Cancel</button>
    </div>
  </div>
</template>

<style>
.textInput {
  display: block;
  margin-bottom: 15px;
}
input:hover {
  background-color: var(--bg-color-main);
}

input {
  position: relative;
  height: 50px;
  margin: 2px;
  border: none;
  background-color: transparent;
  padding: 8px;
  width: 98%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
input:focus {
  outline: 2px solid var(--input-focus-color);
}
</style>
