<script setup lang="ts">
import { ref } from "vue";
defineProps<{
  labelText: string;
  inputValue: string;
  placeholder: string;
}>();
const emit = defineEmits(["save"]);

const isEdit = ref<boolean>(false);
const inputElement = ref<HTMLInputElement | null>(null);
function onFocus() {
  isEdit.value = true;
}
function onSave() {
  isEdit.value = false;
  if (inputElement.value) {
    emit("save", inputElement.value.value);
  }
}
function onCancel() {
  isEdit.value = false;
}
</script>
<template>
  <div class="textInput">
    <label>{{ labelText }}: </label>
    <input
      ref="inputElement"
      :value="inputValue"
      :placeholder="placeholder"
      @focus="onFocus"
    />
    <div v-if="isEdit">
      <button @click="onSave">Save</button>
      <button @click="onCancel">Cancel</button>
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
