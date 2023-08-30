<template>


    <v-alert 
        :title=props.alertProps.title
        :text=props.alertProps.text
        :color=props.alertProps.color 
        :icon=getIcon()>
    </v-alert>

</template>




<script setup lang="ts">

    const props = defineProps<{
        alertProps: AlertProps
    }>();

    function getIcon(): string{
        return "$" + props.alertProps.color
    }

</script>