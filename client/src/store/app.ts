import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAppBarStore = defineStore('appBar', () => {
  const title = ref<string>("Example Title");

  const galleryGridSize = ref<GridSize>({
    title: "3x3",
    value: 3
  });
  const galleryIsNameEnabled = ref<boolean>(true);
  const galleryIsMetadataEnabled = ref<boolean>(false);
  const gallerNumberOfSessions = ref<number>(0);
  const galleryDescription = ref<string>("");

  return {title, galleryGridSize, galleryIsNameEnabled, galleryIsMetadataEnabled, gallerNumberOfSessions, galleryDescription};
});

export const useLoadingStore = defineStore("loading", () => {
  const skipLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  return {skipLoading, isLoading};
});