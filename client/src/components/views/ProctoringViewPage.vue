<template>

    <v-row v-if="!showError">
        <!-- <v-col cols="9"> -->
        <v-col>
            <v-img 
                class="img-styling"
                ref="videoPlayer"
                :src="imageLink" 
                :aspect-ratio="16/9">
                <template v-slot:error>
                    no img available
                </template>

                <!-- <div v-if="isFullscreen">
                    testtesttest
                </div> -->
            </v-img>

            <v-slider class="mt-4" :min="firstScreenshotTime" :max="lastScreenshotTime" :step="1000" v-model="sliderTime" thumb-label>
                <template v-slot:thumb-label>
                    {{currentTimeString}}
                </template>
                <template v-slot:prepend>
                    <v-btn @click="backwards()" size="small" variant="text" icon="mdi-step-backward"></v-btn>
                    <v-btn @click="pausePlay()" size="small" variant="text" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-btn>
                    <v-btn @click="forwards()" size="small" variant="text" icon="mdi-step-forward"></v-btn>
                </template>
                <template v-slot:append>
                    <v-chip variant="outlined">
                        {{ currentTimeString }} / {{ endTimeString }}
                    </v-chip>
                    <v-btn @click="toggle" variant="text" icon="mdi-fullscreen"></v-btn>
                </template>
            </v-slider>
        </v-col>

        <v-col cols="3" v-if="isMetadataInfo">
            <v-card color="#e2ecf7">
                <v-card-text>
                    <v-row>
                        <v-col cols="9">
                            <div class="text-h6">
                                SEB Session Info
                            </div>
                        </v-col>
                        <v-col cols="3" align="right">
                            <v-btn @click="hideShowMetadataInfo()" size="small" icon="mdi-arrow-expand-right"></v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-for="(value, key) in sessionInfodata" :key="key">
                        <v-col>
                            {{key}}
                        </v-col>
                        <v-col>
                            {{value}}
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-title>Screenshot Metadata</v-card-title>
                <v-card-text>
                    <v-row v-for="(value, key) in screenshotMetadata" :key="key">
                        <v-col>
                            {{key}}
                        </v-col>
                        <v-col>
                            {{value}}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else cols="1" align="center">
            <v-card color="#e2ecf7">
                <v-card-title>
                    <v-btn @click="hideShowMetadataInfo()" size="small" icon="mdi-arrow-expand-left"></v-btn>
                </v-card-title>
            </v-card>
        </v-col>


    </v-row>

    <AlertMsg 
        v-else
        :alertProps="{
            color: 'warning',
            type: 'alert',
            textKey: 'no-data'
        }">
    </AlertMsg>

</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref, onBeforeMount, onBeforeUnmount, watch, computed } from "vue";
    import * as proctoringViewService from "@/services/component-services/proctoringViewService";
    import * as timeUtils from "@/utils/timeUtils";
    import * as groupingUtils from "@/utils/groupingUtils";
    import { useAppBarStore, useAuthStore } from '@/store/app';
    import * as searchViewService from "@/services/component-services/searchViewService";
    import { useFullscreen } from '@vueuse/core'

    //reactive variables
    const isPlaying = ref<boolean>(false);
    const session = ref<Screenshot>();
    const currentScreenshot = ref<Screenshot>();
    const sliderTime = ref<number>();
    const firstScreenshotTime = ref<number>();
    const lastScreenshotTime = ref<number>();
    const imageLink = ref<string>("");
    const showError = ref<boolean>(false);
    const searchTimeline = ref<SearchTimeline | null>();

    //time constants
    const SLIDER_INTERVAL: number = 1 * 1000;
    const SESSION_INTERVAL: number = 3 * 1000;

    //intervals
    let intervalScreenshots: any | null = null;
    let intervalSession: any | null = null;

    //remaining
    const appBarStore = useAppBarStore();
    const authStore = useAuthStore();
    const sessionId: string = useRoute().params.sessionId.toString();
    const searchTimestamp: string | undefined = useRoute().query.searchTimestamp?.toString();

    //fullscreen
    const videoPlayer = ref(null);
    const { isFullscreen, enter, exit, toggle } = useFullscreen(videoPlayer);

    //metadata
    const isMetadataInfo = ref<boolean>(true);


    //=============lifecycle and watchers==================
    onBeforeMount(async () => {
        await getAndAssignSession();
        await getFirstScreenshotTime();
        setStartingSliderTime();
        startIntervalSession();

        appBarStore.title = "Proctoring View of Session: " + session.value?.clientName;
    });

    onBeforeUnmount(() => {
        stopIntervalScreenshots();  
        stopIntervalSessions();
    });

    watch(sliderTime, async () => {
        if(sliderTime.value != null){
            await getCurrentScreenshot(sliderTime.value?.toString());
        }
    })

    async function getAndAssignSession(){
        const sessionResponse: Screenshot | null = await proctoringViewService.getSessionBySessionId(sessionId);

        if(sessionResponse == null){
            showError.value = true;
            return;
        }

        session.value = sessionResponse;
        lastScreenshotTime.value = session.value.timestamp;

        searchTimeline.value = await searchViewService.searchTimeline(sessionId);

        if(!session.value.active){
            stopIntervalSessions()
        }

    }
    //==============================


    //=============screenshot logic==================
    async function getFirstScreenshotTime(){
        let specificSessionResponse: Screenshot | null = null;
        if(session.value != null){
            specificSessionResponse = await proctoringViewService.getSessionByTimestamp(sessionId, session.value?.startTime.toString());
        }

        //error does not have to be shown here - if the slider moves too fast, some screenshots cannot be shown
        if(specificSessionResponse == null) return;

        const imageLinkSplitted: string[] = specificSessionResponse.imageLink.split("/");
        firstScreenshotTime.value = parseInt(imageLinkSplitted[imageLinkSplitted.length-1]);
    }

    async function getCurrentScreenshot(timestamp: string){
        const specificSessionResponse: Screenshot | null = await proctoringViewService.getSessionByTimestamp(sessionId, timestamp);

        //error does not have to be shown here - if the slider moves too fast, some screenshots cannot be shown
        if(specificSessionResponse == null) return;

        currentScreenshot.value = specificSessionResponse;
        imageLink.value = currentScreenshot.value.latestImageLink + "/" + timestamp + "/" + "?access_token=" + authStore.getAccessToken();
    }

    const currentTimeString = computed<string>(() => {
        if(sliderTime.value != null && firstScreenshotTime.value != null){
            const currentTime: number = sliderTime.value - firstScreenshotTime.value;
            return timeUtils.toTimeString(currentTime);
        }

        return "";
    });

    const endTimeString = computed<string>(() => {
        if(session.value != null && firstScreenshotTime.value != null){
            return timeUtils.toTimeString(session.value.endTime - firstScreenshotTime.value);
        }

        return "";
    });


    const sessionInfodata = computed<object>(() => {
        return proctoringViewService.getSessionInfodata(session.value || null);
    });
    //==============================

    //=============metadata==================
    const screenshotMetadata = computed<object>(() => {
        if(currentScreenshot.value){
            return proctoringViewService.getScreenshotMetadata(sliderTime.value || 0, currentScreenshot.value.metaData, additionalMetadataInfo.value, totalNumberOfScreenshots.value);
        }

        return proctoringViewService.getScreenshotMetadata(sliderTime.value || 0, null, additionalMetadataInfo.value, totalNumberOfScreenshots.value);
    });

    const additionalMetadataInfo = computed<string>(() => {
        let result: string = "";

        searchTimeline.value?.timelineGroupDataList.forEach((timelineGroupData, firstIndex) => {
            const screenshotsGrouped: ScreenshotsGrouped[] | null = groupingUtils.groupScreenshotsByMetadata(timelineGroupData.timelineScreenshotDataList, false);

            if (screenshotsGrouped!= null){
                for(var i = 0; i < screenshotsGrouped.length; i++){
                    const index: number = screenshotsGrouped[i].timelineScreenshotDataList.findIndex((group) => timeUtils.toTimeString(group.timestamp) == timeUtils.toTimeString(sliderTime.value!));

                    if(index !== -1){
                        result = `(${index+1}/${screenshotsGrouped[i].timelineScreenshotDataList?.length})`;
                        break;
                    }
                }
            }

        });

        return result;
    });

    const totalNumberOfScreenshots = computed<string>(() => {
        if(session.value != null && firstScreenshotTime.value != null && sliderTime.value != null){
            const current: number = timeUtils.toSeconds(sliderTime.value - firstScreenshotTime.value);
            const total: number = timeUtils.toSeconds(session.value.endTime - firstScreenshotTime.value);

            return `${current}/${total}`;
        }

        return ""
    });

    function hideShowMetadataInfo(){
        isMetadataInfo.value ? isMetadataInfo.value = false : isMetadataInfo.value = true;
    }

    //==============================




    //=============interval==================
    function startIntervalSession(){
        if(session.value?.active){
            intervalSession = setInterval(async () => {
                await getAndAssignSession();
            }, SESSION_INTERVAL);
        }
    }

    function stopIntervalSessions(){
        if (intervalSession) {
            clearInterval(intervalSession);
        }
    }

    function startIntervalScreenshots(){
        intervalScreenshots = setInterval(async () => {
            if(sliderTime.value != null) {
                sliderTime.value += SLIDER_INTERVAL;
            }

            if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) == timeUtils.toSeconds(session.value?.endTime)){
                stopIntervalScreenshots();
                isPlaying.value = false;
            }

        }, SLIDER_INTERVAL);
    }

    function stopIntervalScreenshots(){
        if (intervalScreenshots) {
            clearInterval(intervalScreenshots);
        }
    }
    //==============================

    
    //=============video intercation==================
    function setStartingSliderTime(){
        if(searchTimestamp){
            sliderTime.value = parseInt(searchTimestamp);
        }else{
            sliderTime.value = firstScreenshotTime.value;
        }
    }

    function backwards(){
        if(session.value != null && sliderTime.value != null && sliderTime.value != session.value.startTime){
            sliderTime.value -= SLIDER_INTERVAL;
        }
    }

    function forwards(){
        if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) != timeUtils.toSeconds(session.value?.endTime)){
            sliderTime.value += SLIDER_INTERVAL;
        }
    }

    function pausePlay() {
        if(sliderTime.value != session.value?.endTime){
            isPlaying.value = !isPlaying.value;
        }

        if(!isPlaying.value){
            stopIntervalScreenshots();
            return;
        }

        if(isPlaying.value){
            startIntervalScreenshots();
        }
    }
    //==============================


</script>

<style scoped>
    .img-styling{
        background-color: black;
        transition: transform 0.3s ease-in-out;
    }

    .temp-img-container{
        width: 500px
    }


</style>