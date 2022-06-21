<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";

const store = useStore();
const users = computed(() => {
  return store.users;
});

function createUser() {
  store.createUser();
}
</script>
