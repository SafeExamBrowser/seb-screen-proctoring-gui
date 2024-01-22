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
    import { ref, onBeforeMount } from "vue";
    import { setPersonalUserAccount } from "@/services/component-services/userAccountViewService";
    import { formatTimestampToTime } from "@/utils/timeUtils";
    import { useAppBarStore } from '@/store/app';
    import { formatInTimeZone } from 'date-fns-tz'
    console.log(formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ssXXX'))

    const userAccount = ref<UserAccount | null>();
    onBeforeMount(async () => {
        userAccount.value = await setPersonalUserAccount()
        console.log(userAccount.value?.timeZone)
    });

    const store = useAppBarStore();
    store.title = "Example Page";
</script>