<template>
  <v-app>
    <loading
      color="#215CAF"
      :width=100
      :active="loadingStore.isLoading" />
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/css/index.css';
    import { useLoadingStore, useSettingsStore } from "@/store/store";
    import { onBeforeMount } from "vue";

    const loadingStore = useLoadingStore();
    const settingsStore = useSettingsStore();

    onBeforeMount(async () => {
        await settingsStore.setIsSebServerIntegratedMode();
    });

</script>

<style>

    .text-decoration-underline a:visited {
        color: #2196F3 !important;
    }

    .title-inherit-styling{
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }

    .title-no-line-break{
        display: inline;
    }

</style>
