<template>
    applications work

</template>



<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore, useTableStore, useLoadingStore } from "@/store/store";


    //store
    const appBarStore = useAppBarStore();
    const tableStore = useTableStore();
    const loadingStore = useLoadingStore();




    onBeforeMount(async () => {
        appBarStore.title = "Applications"
    });


</script>




<style scoped>

</style>