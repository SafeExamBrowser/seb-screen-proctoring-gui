<template>
    <template v-if="userAccount != null">
        {{ userAccount.surname }}

        








    </template>
</template>


<script setup lang="ts">

    //props
    const props = defineProps<{
        userAccount: UserAccount | null,
    }>();




</script>