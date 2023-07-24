// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useTitleStore = defineStore('title', () => {
  const title = ref("Example Title");

  return {title};
});

// export const useAuthenticationStore = de