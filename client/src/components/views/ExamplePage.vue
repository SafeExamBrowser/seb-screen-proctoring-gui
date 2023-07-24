<template>

<div>example page</div>



</template>


<script setup lang="ts">
    import { useTitleStore } from '@/store/app';

    const store = useTitleStore();

    store.title = "Example Page";

</script>