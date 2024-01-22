<template>
    <div>
        <div>{{ formatTimestampToTime(1705914637760) }}</div>
        <div>
            <v-select
            label="Select your Timezone"
            :items="['UTC+1 Berlin', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            ></v-select>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { formatTimestampToTime } from "@/utils/timeUtils";
    import { useAppBarStore } from '@/store/app';
    const store = useAppBarStore();
    store.title = "Example Page";
</script>