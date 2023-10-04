<template>
    <table class="table">
        <tr v-for="screenshot in screenshotsGrouped">

            <td class="col-time">
                {{ timeUtils.formatTimestmapToTime(screenshot.timelineScreenshotDataList[0].timestamp)}}
            </td>

            <td class="col-empty">
            </td>

            <td class="col-group-name">
                {{ screenshot.groupName }} ({{ screenshot.timelineScreenshotDataList.length }})
            </td>

            <td class="col-video-icon">
                <v-btn 
                    @click="searchViewService.openProctoringView(sessionUuid, screenshot.timelineScreenshotDataList[0].timestamp.toString())" 
                    variant="text" 
                    icon="mdi-video">
                </v-btn>
            </td>

            <td class="col-empty2">
            </td>

        </tr>
    </table>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import * as timeUtils from "@/utils/timeUtils";

    const props = defineProps<{
        sessionUuid: string,
        timelineScreenshotDataList: ScreenshotGroup[]
    }>();

    const screenshotsGrouped = ref<ScreenshotsGrouped[]>([]);
 

    onBeforeMount(() => {
        screenshotsGrouped.value = searchViewService.groupScreenshotsByMetadata(props.timelineScreenshotDataList)!;
        screenshotsGrouped.value.shift();
    });
</script>

<style scoped>

    .table{
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .col-time{
        width: 150px;
    }

    .col-empty{
        width: 300px;
    }

    .col-group-name{
        width: 800px;
    }

    .col-video-icon{
    }

    .col-empty2{
    }

</style>