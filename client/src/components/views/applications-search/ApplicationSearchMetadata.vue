<template>

    <v-row>
        <v-col align="left" class="text-h6">
            {{ exam.name }}
        </v-col>
        <v-col align="right" class="text-h6">
            {{ timeUtils.formatTimestampToFullDate(exam.startTime) }}
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import * as applicationsSearchViewService from "@/services/component-services/applicationsSearchViewService";


    //props
    const props = defineProps<{
        exam: Exam
    }>();


    //main data
    const metadataAppList = ref<string[]>([]);

    onBeforeMount(async () => {
        const groupIds: number[] | null = await applicationsSearchViewService.getGroupIdsForExam(props.exam.id);

        if(groupIds == null){
            //todo: add error handling here
            return;
        }


        console.log(generalUtils.createStringIdList(groupIds))


        // await applicationsSearchViewService.getDistinctMetadataAppForExam(generalUtils.createStringIdList(groupIds));

        // metadataAppList.value





    });







</script>


<style scoped>


</style>