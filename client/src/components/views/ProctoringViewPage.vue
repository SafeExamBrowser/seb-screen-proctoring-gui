<template>
    <v-row>
        <v-col cols="9">

            <v-img :src="imageLink">
                <template v-slot:error>
                    no img available
                </template>
            </v-img>

            <v-slider class="mt-4" :min="session?.startTime" :max="session?.endTime" :step="1000" v-model="sliderTime" thumb-label>
                <template v-slot:thumb-label>
                    {{currentTime}}
                </template>
                <template v-slot:prepend>
                    <v-btn @click="backwards()" size="small" variant="text" icon="mdi-step-backward"></v-btn>
                    <v-btn @click="pausePlay()" size="small" variant="text" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-btn>
                    <v-btn @click="forwards()" size="small" variant="text" icon="mdi-step-forward"></v-btn>
                </template>
                <template v-slot:append>
                    <v-chip variant="outlined">
                        {{ currentTime }} / {{ endTime }}
                    </v-chip>
                </template>
            </v-slider>

        </v-col>

        <v-col cols="3">
            <v-card>
                <v-card-title>SEB Session Info:</v-card-title>
                <v-card-text>
                    <v-row v-for="info in sessionInfoData">
                        <v-col>
                            {{info.name}}
                        </v-col>
                        <v-col>
                            {{info.data}}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card class="mt-4">
                <v-card-title>Screenshot Metadata:</v-card-title>
                <v-card-text>
                    <v-row v-for="info in screenshotMetaData">
                        <v-col>
                            {{info.name}}
                        </v-col>
                        <v-col>
                            {{info.data}}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref, onBeforeMount, onBeforeUnmount, watch, reactive } from "vue";
    import * as sessionService from "@/services/api-services/sessionService";
    import * as timeUtils from "@/utils/timeUtils";
    import { useAppBarStore } from '@/store/app';
    import { computed } from 'vue';

    const SLIDER_INTERVAL: number = 1 * 1000;
    const SESSION_INTERVAL: number = 3 * 1000;
    const SCREENSHOTS_RELOAD_IN_MS: number = 1000;

    const appBarStore = useAppBarStore();
    const sessionId: string = useRoute().params.sessionId.toString();

    const isPlaying = ref<boolean>(false);
    //todo: cehck if ref can definied null --> ref<string | null>(null)
    const session = ref<Screenshot>();
    const sliderTime = ref<number>();
    const imageLink = ref<string>("");
    const sessionInfoData = reactive<{name: string, data: string}[]>([]);
    const screenshotMetaData = reactive<{name: string, data: any}[]>([]);

    let intervalScreenshots: any | null = null;
    let intervalSession: any | null = null;


    onBeforeMount(async () => {
        await getAndassignSession();
        appBarStore.title = "Proctoring View of Group: " + session.value?.clientName;
        sliderTime.value = session.value?.startTime;

        if(session.value != null){
            sessionInfoData.push(
                {name: "Client Name:", data: session.value?.clientName},
                {name: "Client IP:", data: session.value?.clientIp},
                {name: "Client Version:", data: session.value?.clientVersion},
                {name: "Client Machine Name:", data: session.value?.clientMachineName},
                {name: "Client OS:", data: session.value?.clientOsName},
                {name: "Is Session Active:", data: session.value?.active.toString()}
            );
        }
        
        if(sliderTime.value != null){
            screenshotMetaData.push(
                {name: "Date:", data: timeUtils.formatTimestmapToDate(sliderTime.value)},
                {name: "Time:", data: timeUtils.formatTimestmapToTime(sliderTime.value)},
            )
        }
        

        if(session.value?.active){
            intervalSession = setInterval(async () => {
                await getAndassignSession();
            }, SESSION_INTERVAL);
        }
        
    });

    onBeforeUnmount(() => {
        stopIntervalScreenshots();
        stopIntervalSessions();
    });

    watch(sliderTime, () => {
        if(sliderTime.value != null){
            imageLink.value = getImageLink(sliderTime.value?.toString());

            screenshotMetaData.splice(0, screenshotMetaData.length, 
                {name: "Date:", data: timeUtils.formatTimestmapToDate(sliderTime.value)},
                {name: "Time:", data: timeUtils.formatTimestmapToTime(sliderTime.value)}
            );
        }
    })

    async function getAndassignSession(){
        try {
            const sessionResponse: Screenshot = await sessionService.getSessionBySessionId(sessionId);
            console.log(sessionResponse)

            if(sessionResponse != null){
                session.value = sessionResponse;
            }

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }
    }

    const currentTime = computed(() => {
        if(sliderTime.value != null && session.value != null){
            const currentTime: number = sliderTime.value - session.value.startTime;

            return timeUtils.toTimeString(currentTime);
        }

        return "";
    });

    const endTime = computed(() => {
        if(session.value != null){
            return timeUtils.toTimeString(session.value.endTime - session.value.startTime);
        }

        return "";
    });

    function getImageLink(timestamp: string): string{
        if(session.value != null && sliderTime.value == session.value.startTime){
            return session.value.latestImageLink  + "?access_token=" + localStorage.getItem("accessToken");
        }

        if(session.value != null){
            return session.value.latestImageLink + "/" + timestamp + "/" + "?access_token=" + localStorage.getItem("accessToken");
        }

        return "";
    }

    function stopIntervalScreenshots(){
        if (intervalScreenshots) {
            clearInterval(intervalScreenshots);
        }
    }

    function stopIntervalSessions(){
        if (intervalSession) {
            clearInterval(intervalSession);
        }
    }

    function backwards(){
        if(session.value != null && sliderTime.value != null && sliderTime.value != session.value.startTime){
            sliderTime.value -= SCREENSHOTS_RELOAD_IN_MS;
        }
    }

    function forwards(){
        if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) != timeUtils.toSeconds(session.value?.endTime)){
            sliderTime.value += SCREENSHOTS_RELOAD_IN_MS;
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

        if(isPlaying){
            intervalScreenshots = setInterval(async () => {
                if(sliderTime.value != null) sliderTime.value += SCREENSHOTS_RELOAD_IN_MS;

                if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) == timeUtils.toSeconds(session.value?.endTime)){
                    stopIntervalScreenshots();
                    isPlaying.value = false;
                }

            }, SLIDER_INTERVAL);
        }
    }


</script>