<template>

    <v-row v-if="!showError">
        <v-col cols="9">

            <v-img 
                class="img-styling"
                :src="imageLink" 
                :aspect-ratio="16/9">
                <template v-slot:error>
                    no img available
                </template>
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
                </template>
            </v-slider>

        </v-col>

        <v-col cols="3">
            <v-card>
                <v-card-title>SEB Session Info:</v-card-title>
                <v-card-text>
                    <v-row v-for="(value, key) in sessionInfodata" :key="key">
                        <v-col>
                            {{key}}
                        </v-col>
                        <v-col>
                            {{value}}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>   

            <v-card class="mt-4">
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
    import { useAppBarStore } from '@/store/app';


    //reactive variables
    const isPlaying = ref<boolean>(false);
    const session = ref<Screenshot>();
    const currentScreenshot = ref<Screenshot>();
    const sliderTime = ref<number>();
    const firstScreenshotTime = ref<number>();
    const lastScreenshotTime = ref<number>();
    const imageLink = ref<string>("");
    const showError = ref<boolean>(false);

    //time constants
    const SLIDER_INTERVAL: number = 1 * 1000;
    const SESSION_INTERVAL: number = 3 * 1000;

    //intervals
    let intervalScreenshots: any | null = null;
    let intervalSession: any | null = null;

    //remaining
    const appBarStore = useAppBarStore();
    const sessionId: string = useRoute().params.sessionId.toString();
    const searchTimestamp: string | undefined = useRoute().query.searchTimestamp?.toString();


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
        imageLink.value = currentScreenshot.value.latestImageLink + "/" + timestamp + "/" + "?access_token=" + localStorage.getItem("accessToken");
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

    const screenshotMetadata = computed<object>(() => {
        if(currentScreenshot.value){
            return proctoringViewService.getScreenshotMetadata(sliderTime.value || 0, currentScreenshot.value.metaData);
        }

        return proctoringViewService.getScreenshotMetadata(sliderTime.value || 0, null);
    });

    const sessionInfodata = computed<object>(() => {
        return proctoringViewService.getSessionInfodata(session.value || null);
    });
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