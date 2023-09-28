<template>
    <div class="mb-10">
        <v-row v-for="screenshot in screenshotsGrouped">
            <v-col>
                {{ timeUtils.formatTimestmapToTime(screenshot.timelineScreenshotDataList[0].timestamp)}}
            </v-col>
            <v-col>

            </v-col>
            <v-col>

            </v-col>
            <v-col>

            </v-col>

            <v-col>
                {{ screenshot.groupName }} ({{ screenshot.timelineScreenshotDataList.length }})
            </v-col>

            <v-col>
                <v-btn 
                    @click="openProctoringView(sessionUuid, screenshot.timelineScreenshotDataList[0].timestamp.toString())" 
                    variant="text" 
                    icon="mdi-video"
                    density="compact"
                >
                </v-btn>
            </v-col>
        </v-row>
    </div>

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


    function openProctoringView(sessionId: string, timestamp?: string){
        const url: string = "/recording/" + sessionId + "?searchTimestamp=" + timestamp;
        //@ts-ignore
        window.open("", "_blank").location.href = router.resolve(url).href;
    }



</script>