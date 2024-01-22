<template>
    <v-window v-model="currentWindow" @update:model-value="windowChange()" show-arrows>
        <v-window-item v-for="(w , index) in maxPages" :key="index">
        <!-- <v-window-item> -->

            <template v-if="!noScreenshotData">
                <v-row v-for="i in appBarStore.galleryGridSize.value" :key="i" align-strech no-gutters>
                    <v-col v-for="n in appBarStore.galleryGridSize.value" :key="n">

                        <GalleryImage
                            :screenshot="group?.screenshots[galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value)]"
                            :timestamp="timestamp"
                            :group-uuid="groupUuid"
                        >
                        </GalleryImage>

                    </v-col>
                </v-row>
            </template>

            <AlertMsg 
                v-else 
                :alertProps="{
                    textKey: 'no-data',
                    color: 'warning',
                    type: 'alert',
                }">
            </AlertMsg>

        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount, watch, computed } from "vue";
    import { useRoute } from "vue-router";
    import * as galleryViewService from "@/services/component-services/galleryViewService";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import { storeToRefs } from "pinia";
    import GalleryImage from "./GalleryImage.vue";


    //reactive variables
    const group = ref<GroupUuid | null>();
    const noScreenshotData = ref<boolean>(false);
    const timestamp = ref(Date.now());
    const maxPages = ref<number>(1);
    const currentWindow = ref<number>(0);   

    //time constants
    const GROUP_INTERVAL: number = 5 * 1000;
    const SCREENSHOT_INTERVAL: number = 1 * 1000;

    //store
    const appBarStore = useAppBarStore();
    const appBarStoreRef = storeToRefs(appBarStore);
    const loadingStore = useLoadingStore();

    //remaining
    const groupUuid: string = useRoute().params.uuid.toString();
    let intervalGroup: any | null = null;
    let intervalImageUrl: any | null = null;


    //=============lifecycle and watchers==================
    onBeforeMount(async () => {
        //todo: add error handling

        loadingStore.skipLoading = true;
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        // console.log(group.value)

        if(group.value){
            appBarStore.title = "Gallery View of Group: " + group.value.name;
            appBarStore.gallerNumberOfSessions = group.value.numberOfSessions;
            appBarStore.galleryDescription = group.value.description;
        }

        assignData();
        startIntervalGroup();
        startIntervalImageUrl();
    });

    onBeforeUnmount(() => {
        stopIntervalGroup();
        stopIntervalImageUrl();
    });

    watch(appBarStoreRef.galleryGridSize, async () => {
        loadingStore.skipLoading = true;
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        assignData();
    });

    watch(currentWindow, () => {
        appBarStore.galleryCurrentPage = currentWindow.value;
        appBarStore.galleryCurrentPage+=1;
    });

    watch(appBarStore, () => {
        if (appBarStore.galleryCurrentPage > appBarStore.galleryMaxPages) {
            currentWindow.value = 1
            appBarStore.galleryCurrentPage = 1
        }
    }, {deep: true});

    function assignData() {
        calcAmountOfWindows();
        noScreenshotData.value = false;

        if (group.value?.screenshots == null || group.value?.screenshots.length == 0) {
            noScreenshotData.value = true;
            return;
        }

        // screenshots.value = groupUuidResponse.screenshots.slice(0, -4);
        group.value.screenshots = group.value?.screenshots.flatMap(f => f ? [f] : []);
        appBarStore.gallerNumberOfSessions = group.value.numberOfSessions;
        appBarStore.galleryMaxPages = maxPages.value;

        if (group.value.screenshots.length == 0) {
            noScreenshotData.value = true;
        }
    }
    //==============================


    //=====window functions======
    async function windowChange() {
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        assignData();
    }

    function calcAmountOfWindows() {
        if (group.value?.numberOfSessions == null || group.value?.numberOfSessions == 0) {
            maxPages.value = 1;
            return;
        }

        maxPages.value = Math.ceil(group.value?.numberOfSessions / Math.pow(appBarStore.galleryGridSize.value, 2));
    }
    //==============================


    //=============interval==================
    function startIntervalGroup() {
        intervalGroup = setInterval(async () => {
            loadingStore.skipLoading = true;
            group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
            assignData();

        }, GROUP_INTERVAL);
    }

    function stopIntervalGroup() {
        if (intervalGroup) {
            clearInterval(intervalGroup);
        }
    }

    function startIntervalImageUrl() {
        intervalImageUrl = setInterval(async () => {
            //update image url
            timestamp.value = Date.now();

            //update metadata
            if(appBarStore.galleryIsMetadataEnabled && group?.value?.screenshots != null){
                for(let i = 0; i < group.value?.screenshots.length; i++){
                    const screenshot: ScreenshotData | null = await galleryViewService.getLatestScreenshotData(group.value.screenshots[i].uuid, timestamp.value);
                    const metaData: MetaData | undefined = screenshot?.metaData;
                    group.value.screenshots[i].metaData = metaData == null ? {} : metaData;
                }
            }


        }, SCREENSHOT_INTERVAL);

    }

    function stopIntervalImageUrl() {
        if (intervalImageUrl) {
            clearInterval(intervalImageUrl);
        }
    }
    //==============================
</script>

<style scoped>
</style>