<template>

<div>example page</div>



</template>


<script setup lang="ts">
    import { useAppBarStore } from '@/store/app';

    const store = useAppBarStore();

    store.title = "Example Page";

</script>