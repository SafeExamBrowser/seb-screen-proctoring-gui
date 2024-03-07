<template>
    <v-row v-if="!showError">
        
        <!-----------video player---------->
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pt-4 pl-4 pr-4">
                <v-img 
                    eager
                    class="img-styling"
                    ref="videoPlayer"
                    :src="imageLink" 
                    :aspect-ratio="16/9">
                    <template v-slot:error>
                        no img available
                    </template>
                </v-img>

                <!-----------slider---------->
                <!-- <v-slider class="mt-4" :min="sliderMin" :max="lastScreenshotTime" :step="1000" v-model="sliderTime" thumb-label> -->
                <v-slider class="mt-4" :min="sliderMin" :max="sliderMax" :step="1000" v-model="sliderTime" thumb-label>
                    <template v-slot:thumb-label>
                        {{currentTimeString}}
                    </template>

                    <!-----------control buttons---------->
                    <template v-slot:prepend>
                        <v-btn @click="backwards()" size="small" variant="text" icon="mdi-step-backward"></v-btn>
                        <v-btn @click="pausePlay()" size="small" variant="text" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-btn>
                        <v-btn @click="forwards()" size="small" variant="text" icon="mdi-step-forward"></v-btn>

                        <v-btn 
                            v-if="isLive"
                            variant="text"
                            @click="goLive()">
                            <template v-slot:prepend>
                                <v-badge 
                                    dot
                                    inline 
                                    :color="isLiveSelected ? 'error' : ''">
                                </v-badge>
                            </template>
                            LIVE
                        </v-btn>
                    </template>
                    <!-------------------------->
                    <!-----------time---------->
                    <template v-slot:append>
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    :disabled="isLiveSelected"
                                    variant="text"
                                    icon="mdi-cog" 
                                    v-bind="props">
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item>
                                    Playback Speed
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item 
                                    v-for="(playbackSpeed, index) in playbackSpeeds" 
                                    :key="index" 
                                    :value="index" 
                                    @click="changePlaybackSpeed(playbackSpeed.id)">

                                    <template v-if="playbackSpeed.id == selectedSpeedId" v-slot:append>
                                        <v-icon icon="mdi-check"></v-icon>
                                    </template>
                                    
                                    {{ playbackSpeed.title }}
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-chip v-if="isLive" variant="outlined">
                            {{ liveSessionTime }}
                        </v-chip>
                        <v-chip v-else variant="outlined">
                            {{ currentTimeString }} / {{ endTimeString }}
                        </v-chip>
                        <v-btn @click="toggle" variant="text" icon="mdi-fullscreen"></v-btn>
                    </template>
                    <!-------------------------->


                </v-slider>
                <!-------------------------->

            </v-sheet>
        </v-col>
        <!-------------------------->

        <!-----------info box---------->
        <!-- <v-col cols="3" v-if="isMetadataInfo">
            placeholder
        </v-col> -->

        <v-col cols="4" v-if="isMetadataInfo">
            <v-card
                class="mx-auto">
                <template v-slot:title>
                    <v-btn
                        @click="hideShowMetadataInfo()"
                        variant="text"
                        icon="mdi-information">
                    </v-btn>
                    Details
                </template>
                <v-card-text>
                    <v-table density="comfortable" class="text-caption">
                        <thead>
                            <tr>
                                <th class="text-left text-no-wrap">SEB Session Info</th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(value, key) in sessionInfodata" :key="key">
                                <td>{{ key }}</td>
                                <td align="right">{{ value }}</td>
                            </tr>
                        </tbody>

                        <thead>
                            <tr>
                                <th class="text-left text-no-wrap">Screenshot Metadata</th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(value, key) in screenshotMetadata" :key="key">
                                <td>{{ key }}</td>
                                <td align="right">{{ value }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else cols="1" align="center">
            <v-card>
                <v-btn
                    @click="hideShowMetadataInfo()"
                    variant="text"
                    size="x-large"
                    density="default"
                    icon="mdi-information">
                </v-btn>
            </v-card>
        </v-col>
        <!-------------------------->

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
    import { useRoute } from "vue-router";
    import { ref, onBeforeMount, onBeforeUnmount, watch, computed } from "vue";
    import * as proctoringViewService from "@/services/component-services/proctoringViewService";
    import * as timeUtils from "@/utils/timeUtils";
    import * as groupingUtils from "@/utils/groupingUtils";
    import { useAppBarStore, useAuthStore } from "@/store/app";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import { useFullscreen } from "@vueuse/core";
    import * as liveService from "@/services/component-services/liveService";
    import { SortOrder } from "@/models/sortOrderEnum";


    //slider
    const sliderTime = ref<number>();
    const sliderMin = ref<number>();
    const sliderMax = ref<number>();

    //screenshots
    const isPlaying = ref<boolean>(false);
    const currentScreenshot = ref<ScreenshotData>();
    const firstScreenshotTime = ref<number>();
    
    const imageLink = ref<string>("");
    const showError = ref<boolean>(false);
    const searchTimeline = ref<SearchTimeline | null>();

    //live 
    const isLive = ref<boolean>(false);
    const isLiveSelected = ref<boolean>(false);
    const isLiveButtonDisabled = ref<boolean>(false);
    const liveTimestamp = ref<number>(Date.now());
    const liveSessionTime = ref<string>();

    //screenshot list
    const screenshotTimestamps = ref<number[]>([]);
    const screenshotTimestampsFloored = ref<number[]>([]);
    const timestampsIndex = ref<number>(0);
    const backwardsFirstTime = ref<boolean>(true);
    const forwardsFirstTime = ref<boolean>(true);

    //time constants
    const LIVE_INTERVAL: number = 1 * 1000;
    const REFRESH_INTERVAL: number = 3 * 1000;

    //playback speed
    const SLOW_PLAYBACK_SPEED: number = 1 * 2000;
    const DEFAULT_PLAYBACK_SPEED: number = 1 * 1000;
    const FAST_PLAYBACK_SPEED: number = 1 * 500;
    const PLAYBACK_SPEED = ref<number>(DEFAULT_PLAYBACK_SPEED);
    const selectedSpeedId = ref<number>(1);
    const playbackSpeeds: {title: string, id: number}[] = [
        {title: "0.5", id: 0},
        {title: "Normal", id: 1},
        {title: "2.0", id: 2}
    ];

    //intervals
    let intervalScreenshots: any | null = null;
    let intervalLiveImage: any | null = null;
    let intervalRefresh: any | null = null;

    //store
    const appBarStore = useAppBarStore();

    //router params
    const sessionId: string = useRoute().params.sessionId.toString();
    const searchTimestamp: string | undefined = useRoute().query.searchTimestamp?.toString();

    //fullscreen
    const videoPlayer = ref(null);
    const { isFullscreen, enter, exit, toggle } = useFullscreen(videoPlayer);

    //metadata
    const isMetadataInfo = ref<boolean>(true);


    //=============lifecycle and watchers==================
    onBeforeMount(async () => {
        await initialize();

        setStartingSliderTime();
        await setTimestampsList(SortOrder.asc);

        if(currentScreenshot.value?.active){
            goLive();       
        }

        appBarStore.title = "Proctoring View of Session: " + currentScreenshot.value?.clientName;
    });

    onBeforeUnmount(() => {
        stopIntervalScreenshots();  
        stopIntervalLiveImage();
        stopIntervalRefresh();
    });


    watch(sliderTime, async () => {
        if(sliderTime.value != null){
            if(sliderTime.value != sliderMax.value && !intervalScreenshots){
                pause();
                isLiveButtonDisabled.value = false;
            }
            
            if(isLiveSelected.value) return;

            if(screenshotTimestampsFloored.value.includes(Math.floor(sliderTime.value/1000))){
                timestampsIndex.value = screenshotTimestampsFloored.value.indexOf(Math.floor(sliderTime.value/1000));
            }else{
                await setTimestampsList(SortOrder.asc);
            }

            console.log("=====================")
            console.log("sliderTime.value")
            console.log(sliderTime.value)
            console.log("=====================")

            assignScreenshotDataByTimestamp(sliderTime.value.toString());
        }
    });

    watch(liveTimestamp, async () => {
        if(isLive.value && isLiveSelected.value){
            setImageLink(Date.now().toString());

            //no await makes sense here
            assignScreenshotData();
            return;
        }

        if(isLive.value){
            assignScreenshotData();
            return;
        }
    });

    watch(currentScreenshot, () => {
        if(currentScreenshot.value) {
            liveSessionTime.value = timeUtils.toTimeString(currentScreenshot.value?.endTime - currentScreenshot.value?.startTime);
            isLive.value = currentScreenshot.value.active;

            // if(!isLive.value) {
            //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            //     pause();
            // }
        }
    });

    async function initialize(){
        await assignScreenshotData()
        if(currentScreenshot.value == null){ 
            showError.value = true; 
            return;
        }

        setSliderMax(currentScreenshot.value.timestamp);
        searchTimeline.value = await searchViewService.searchTimeline(sessionId);

        await assignScreenshotDataByTimestamp(currentScreenshot.value?.startTime.toString());

        if(currentScreenshot.value == null) return;

        setSliderMin(currentScreenshot.value.timestamp);
        firstScreenshotTime.value = currentScreenshot.value.timestamp;
        setImageLink(Date.now().toString());
    }
    //==============================


    //=============screenshot list logic==================
    async function setTimestampsList(sortOrder: SortOrder){
        if(sliderTime.value == null) return;

        const timestampsResponse: number[] | null = await proctoringViewService.getScreenshotTimestamps(sessionId, sliderTime.value.toString(), sortOrder);
        if(timestampsResponse != null){
            screenshotTimestamps.value = timestampsResponse;
            screenshotTimestampsFloored.value = timestampsResponse.map(timestamp => Math.floor(timestamp / 1000));
        } 

        timestampsIndex.value = 0;
    }

    function setImageLink(timestamp: string){
        imageLink.value = liveService.getSpecificImageLink(currentScreenshot.value, timestamp);
    }
    

    //=============screenshot logic==================
    async function assignScreenshotData(){
        const screenshotDataResponse: ScreenshotData | null = await proctoringViewService.getScreenshotDataBySessionId(sessionId);
        if(screenshotDataResponse) currentScreenshot.value = screenshotDataResponse;
    }


    async function assignScreenshotDataByTimestamp(timestamp: string | undefined){
        if(timestamp == null) return;

        const screenshotDataResponse: ScreenshotData | null = await proctoringViewService.getScreenshotDataByTimestamp(sessionId, timestamp);
        if(screenshotDataResponse) currentScreenshot.value = screenshotDataResponse;
    }

    function setSliderMin(timestamp: number){
        sliderMin.value = timestamp;
    }

    function setSliderMax(timestamp: number){
        sliderMax.value = timestamp;
    }


    const currentTimeString = computed<string>(() => {
        if(sliderTime.value != null && sliderMin.value != null){
            const currentTime: number = sliderTime.value - sliderMin.value;
            return timeUtils.toTimeString(currentTime);
        }

        return "";
    });

    const endTimeString = computed<string>(() => {
        if(currentScreenshot.value != null && sliderMin.value != null){
            return timeUtils.toTimeString(currentScreenshot.value.endTime - sliderMin.value);
        }

        return "";
    });


    const sessionInfodata = computed<object>(() => {
        return proctoringViewService.getSessionInfodata(currentScreenshot.value || null);
    });
    //==============================

    //=========live=================
    function goLive(){
        if(isLiveSelected.value){
            isLiveSelected.value = false;
            return;
        }

        isLiveSelected.value = true;
        isPlaying.value = true;
        isLiveButtonDisabled.value = true;

        sliderTime.value = sliderMax.value;

        startIntervalLiveImage();
        startRefreshInterval();
    }

    
    function startIntervalLiveImage(){
        intervalLiveImage = setInterval(() => {
            liveTimestamp.value = Date.now();
            
        }, LIVE_INTERVAL);
    } 

    function stopIntervalLiveImage(){
        if(intervalLiveImage){
            clearInterval(intervalLiveImage);
        }
    }
    //==============================


    //=========interval=============
    function startRefreshInterval(){
        if(currentScreenshot.value?.active){
            intervalRefresh = setInterval(() => {

                if(currentScreenshot.value != null){
                    setSliderMax(currentScreenshot.value?.endTime);
                } 

                if(isLiveSelected.value){
                    sliderTime.value = sliderMax.value;
                }

            }, REFRESH_INTERVAL);
        }
    }

    function startIntervalScreenshots(){
        backwardsFirstTime.value = true;

        intervalScreenshots = setInterval(async () => {
            if(currentScreenshot.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) == timeUtils.toSeconds(currentScreenshot.value?.endTime)){
                stopIntervalScreenshots();
                isPlaying.value = false;
                return;
            }

            if(sliderTime.value != null) sliderTime.value += DEFAULT_PLAYBACK_SPEED;

            setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());

            timestampsIndex.value += 1;

        }, PLAYBACK_SPEED.value);
    }

    function stopIntervalScreenshots(){
        if (intervalScreenshots) {
            clearInterval(intervalScreenshots);
        }
    }

    function stopIntervalRefresh(){
        if (intervalRefresh) {
            clearInterval(intervalRefresh);
        }
    }
    //==============================


    //======video intercation=======
    function changePlaybackSpeed(id: number) {
        stopIntervalScreenshots();
        selectedSpeedId.value = id;

        if(id == 0) PLAYBACK_SPEED.value = SLOW_PLAYBACK_SPEED;
        if(id == 1) PLAYBACK_SPEED.value = DEFAULT_PLAYBACK_SPEED;
        if(id == 2) PLAYBACK_SPEED.value = FAST_PLAYBACK_SPEED;

        if(isPlaying.value){
            startIntervalScreenshots();
        }
    }

    function setStartingSliderTime(){
        if(searchTimestamp){
            sliderTime.value = parseInt(searchTimestamp);
        }else{
            sliderTime.value = sliderMin.value;
        }
    }

    async function backwards(){
        pause();
        forwardsFirstTime.value = true;

        if(currentScreenshot.value == null || sliderTime.value == null || sliderTime.value == currentScreenshot.value.startTime){
            return;
        }

        if(backwardsFirstTime.value){
            await setTimestampsList(SortOrder.desc);
            timestampsIndex.value = 1;
            
            setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
            sliderTime.value -= DEFAULT_PLAYBACK_SPEED;

            backwardsFirstTime.value = false;
            return;
        }

        timestampsIndex.value += 1;
        setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
        sliderTime.value -= DEFAULT_PLAYBACK_SPEED;
    }

    async function forwards(){
        pause();
        backwardsFirstTime.value = true;

        if(currentScreenshot.value == null || sliderTime.value == null || sliderTime.value == currentScreenshot.value.startTime){
            return;
        }

        if(forwardsFirstTime.value){
            await setTimestampsList(SortOrder.asc);
            timestampsIndex.value = 1;
            
            setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
            sliderTime.value += DEFAULT_PLAYBACK_SPEED;


            forwardsFirstTime.value = false;
            return;
        }


        timestampsIndex.value += 1;
        setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
        sliderTime.value += DEFAULT_PLAYBACK_SPEED;
    }

    function pause(){
        isLiveSelected.value = false;
        isPlaying.value = false;
        stopIntervalScreenshots();
    }


    function pausePlay() {
        if(sliderTime.value != currentScreenshot.value?.endTime){
            isPlaying.value = !isPlaying.value;
        }

        if(!isPlaying.value){
            pause();
            return;
        }

        if(isPlaying.value){
            startIntervalScreenshots();
            return;
        }
    }
    //==============================

    
    //=============metadata==================
    const screenshotMetadata = computed<object>(() => {
        if(currentScreenshot.value){
            console.log("it got here")
            console.log(currentScreenshot.value)
            return proctoringViewService.getScreenshotMetadata(sliderTime.value || 0, currentScreenshot.value.metaData, additionalMetadataInfo.value, totalNumberOfScreenshots.value);
        }

        return proctoringViewService.getScreenshotMetadata(sliderTime.value || 0, null, additionalMetadataInfo.value, totalNumberOfScreenshots.value);
    });

    const additionalMetadataInfo = computed<string>(() => {
        let result: string = "";

        searchTimeline.value?.timelineGroupDataList.forEach((timelineGroupData, firstIndex) => {
            const screenshotsGrouped: ScreenshotsGrouped[] | null = groupingUtils.groupScreenshotsByMetadata(timelineGroupData.timelineScreenshotDataList, false);

            if (screenshotsGrouped!= null){
                for(let i = 0; i < screenshotsGrouped.length; i++){
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
        if(currentScreenshot.value != null && firstScreenshotTime.value != null && sliderTime.value != null){
            const current: number = timeUtils.toSeconds(sliderTime.value - firstScreenshotTime.value);
            const total: number = timeUtils.toSeconds(currentScreenshot.value.endTime - firstScreenshotTime.value);

            return `${current}/${total}`;
        }

        return ""
    });

    function hideShowMetadataInfo(){
        isMetadataInfo.value ? isMetadataInfo.value = false : isMetadataInfo.value = true;
    }
    //==============================


</script>

<style scoped>
    .img-styling{
        background-color: black;
        transition: transform 0.3s ease-in-out;
    }

</style>