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
import { stopCoverage } from 'v8';

    const SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 1 * 1000;
    const SCREENSHOTS_RELOAD_INTERVAL_IN_MS: number = 1000;

    const store = useTitleStore();

    const isPlaying = ref<boolean>(false);
    const session = ref<Screenshot>();
    const sliderTime = ref<number>();
    const imageLink = ref<string>("");

    let intervalScreenshots: any | null = null;



    onBeforeMount(async () => {

        try {
            const sessionResponse: Screenshot = await sessionService.getSessionBySessionId(useRoute().params.sessionId.toString());
            console.log(sessionResponse)

            if(sessionResponse != null){
                session.value = sessionResponse;
                store.title = "Proctoring View of Group: " + session.value.clientName;
                sliderTime.value = session.value.startTime;
            }

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }
        
    });

    onBeforeUnmount(() => {
        stopInterval();
    });

    watch(sliderTime, () => {
        if(sliderTime.value != null){
            imageLink.value = getImageLink(sliderTime.value?.toString());
        }
    })

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
            return session.value.latestImageLink  + "?access_token=" + localStorage.getItem("token");
        }

        if(session.value != null){
            return session.value.latestImageLink + "/" + timestamp + "/" + "?access_token=" + localStorage.getItem("token");
        }

        return "";
    }

    function stopInterval(){
        if (intervalScreenshots) {
            clearInterval(intervalScreenshots);
        }
    }

    function backwards(){
        if(session.value != null && sliderTime.value != null && sliderTime.value != session.value.startTime){
            sliderTime.value -= SCREENSHOTS_RELOAD_INTERVAL_IN_MS;
        }
    }

    function forwards(){
        if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) != timeUtils.toSeconds(session.value?.endTime)){
            console.log("stil gets called")

            sliderTime.value += SCREENSHOTS_RELOAD_INTERVAL_IN_MS;
        }
    }

    function pausePlay() {
        if(sliderTime.value != session.value?.endTime){
            isPlaying.value = !isPlaying.value;
        }

        if(!isPlaying.value){
            stopInterval();
            return;
        }

        if(isPlaying){
            intervalScreenshots = setInterval(async () => {

                if(sliderTime.value != null){
                    sliderTime.value += SCREENSHOTS_RELOAD_INTERVAL_IN_MS;
                }

                if(session.value != null && sliderTime.value != null && timeUtils.toSeconds(sliderTime.value) == timeUtils.toSeconds(session.value?.endTime)){
                    stopInterval();
                    isPlaying.value = false;
                }

            }, SCREENSHOTS_RELOAD_INTERVAL_IN_S);
        }
    }


</script>