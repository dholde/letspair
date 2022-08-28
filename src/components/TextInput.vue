<script setup lang="ts">
import { ref } from "vue";
defineProps<{
  labelText: string;
  inputValue: string | undefined;
  inputType: "singleLine" | "multiLine";
  placeholder: string;
}>();
const emit = defineEmits<{
  (e: "save", value: string): void;
}>();

const isEdit = ref<boolean>(false);
const inputElement = ref<HTMLInputElement | null>(null);
function onFocus() {
  const inputDOMElement = inputElement.value;
  if (inputDOMElement) {
    inputDOMElement.addEventListener("blur", onBlur);
  }
  isEdit.value = true;
}
function onSave() {
  const inputDOMElement = inputElement.value;
  if (inputDOMElement) {
    inputDOMElement.removeEventListener("blur", onBlur);
    inputDOMElement.blur();
    emit("save", inputDOMElement.value);
  }
  isEdit.value = false;
}
function onCancel() {
  const inputDOMElement = inputElement.value;
  if (inputDOMElement) {
    inputDOMElement.removeEventListener("blur", onBlur);
    inputDOMElement.blur();
  }
  isEdit.value = false;
}

//Only loose focus on save and cancel
const onBlur = (event: Event) => {
  (event.target as HTMLInputElement).focus();
};
</script>
<template>
  <div class="textInputWrapper">
    <label>{{ labelText }}: </label>
    <input
      class="input"
      v-if="inputType === 'singleLine'"
      ref="inputElement"
      :value="inputValue"
      :placeholder="placeholder"
      @focus="onFocus"
    />
    <textarea
      class="input"
      v-if="inputType === 'multiLine'"
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
.textInputWrapper {
  display: block;
  margin-bottom: 15px;
}
input:hover {
  background-color: var(--bg-color-main);
}

.input {
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
.input:focus {
  outline: 2px solid var(--input-focus-color);
}
</style>
