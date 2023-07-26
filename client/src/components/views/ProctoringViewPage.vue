<template>
    <v-row>
        <v-col cols="9">
            <v-img :src="imageLink">
                <template v-slot:error>
                    no img available
                </template>
            </v-img>
        </v-col>

        <v-col cols="3">
            <v-card>
                <v-card-title>SEB Session Info:</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            Client Name:
                        </v-col>
                        <v-col>
                            {{ session?.clientName }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client IP:
                        </v-col>
                        <v-col>
                            {{ session?.clientIp }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client Version:
                        </v-col>
                        <v-col>
                            {{ session?.clientVersion }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client Machine Name:
                        </v-col>
                        <v-col>
                            {{ session?.clientMachineName }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client OS:
                        </v-col>
                        <v-col>
                            {{ session?.clientOsName }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Is Session Active:
                        </v-col>
                        <v-col>
                            {{ session?.active }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="9">

            <v-slider :min="session?.startTime" :max="session?.endTime" :step="1000" show-ticks="always" v-model="sliderTime" thumb-label>
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
                <v-card-title>Screenshot Metadata:</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            Client Name:
                        </v-col>
                        <v-col>
                            {{ session?.clientName }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client IP:
                        </v-col>
                        <v-col>
                            {{ session?.clientIp }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client Version:
                        </v-col>
                        <v-col>
                            {{ session?.clientVersion }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client Machine Name:
                        </v-col>
                        <v-col>
                            {{ session?.clientMachineName }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Client OS:
                        </v-col>
                        <v-col>
                            {{ session?.clientOsName }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Is Session Active:
                        </v-col>
                        <v-col>
                            {{ session?.active }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref, onBeforeMount, onBeforeUnmount, watch } from "vue";
    import * as sessionService from "../../services/sessionService";
    import * as timeUtils from "../../utils/timeUtils";
    import { useTitleStore } from '@/store/app';
    import { computed } from 'vue';

    const SLIDER_INTERVAL: number = 1 * 1000;
    const SESSION_INTERVAL: number = 3 * 1000;
    const SCREENSHOTS_RELOAD_IN_MS: number = 1000;

    const titleStore = useTitleStore();
    const sessionId: string = useRoute().params.sessionId.toString();

    const isPlaying = ref<boolean>(false);
    //todo: cehck if ref can definied null --> ref<string | null>(null)
    const session = ref<Screenshot>();
    const sliderTime = ref<number>();
    const imageLink = ref<string>("");

    let intervalScreenshots: any | null = null;
    let intervalSession: any | null = null;

    onBeforeMount(async () => {
        await getAndAsignSession();
        titleStore.title = "Proctoring View of Group: " + session.value?.clientName;
        sliderTime.value = session.value?.startTime;

        if(session.value?.active){
            intervalSession = setInterval(async () => {
                await getAndAsignSession();
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
        }
    })

    async function getAndAsignSession(){
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

            return timeUtils.formatTime(currentTime);
        }

        return "";
    });

    const endTime = computed(() => {
        if(session.value != null){
            return timeUtils.formatTime(session.value.endTime - session.value.startTime);
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
            console.log("stil gets called")

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

                if(sliderTime.value != null){
                    sliderTime.value += SCREENSHOTS_RELOAD_IN_MS;
                }

                if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) == timeUtils.toSeconds(session.value?.endTime)){
                    stopIntervalScreenshots();
                    isPlaying.value = false;
                }

            }, SLIDER_INTERVAL);
        }
    }


</script>