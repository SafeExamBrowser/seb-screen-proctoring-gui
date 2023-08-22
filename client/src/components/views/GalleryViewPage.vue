<template>
    <v-window v-model="currentWindow" @update:model-value="windowChange()" show-arrows>
        <v-window-item v-for="(w , index) in windowsAmount" :key="index">

            <template v-if="!noScreenshotData">
                <v-row  v-for="i in appBarStore.galleryGridSize.value" :key="i" align-strech no-gutters>
                    <v-col v-for="n in appBarStore.galleryGridSize.value" :key="n" class="col-style">

                        <v-hover v-slot="{isHovering, props}" >
                            <!--todo: add max height  -->
                            <v-img
                                v-if="galleryViewService.currentIndexExists(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))"
                                v-bind="props"
                                id="imgElement"
                                class="img-styling"
                                :aspect-ratio="16/9"
                                :class="{'on-hover': isHovering}"
                                :src="galleryViewService.createImageLinkWithToken(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value), timestamp)">

                                <div v-if="isHovering" class="hover-overlay d-flex align-end">
                                    <v-row>
                                        <v-col align-self="end" >
                                            <v-sheet class="d-flex pa-2 button-row">
                                                <span v-if="appBarStore.isNameEnabled" class="text-h6 title-box">
                                                    {{group?.screenshots[galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value)].clientName}}
                                                </span>
                                                <v-spacer></v-spacer>
                                                <span>
                                                    <v-btn rounded="sm" color="white" variant="outlined"
                                                        @click="openDialog(galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))">
                                                        Expand
                                                    </v-btn>

                                                    <v-btn
                                                        :to="galleryViewService.getProctoringViewLink(group?.screenshots, groupUuid, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))"
                                                        rounded="sm" color="primary" variant="flat" class="ml-2">
                                                        Details View
                                                    </v-btn>
                                                </span>
                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-img>

                            <v-img 
                                v-else 
                                class="content-filler"
                                :aspect-ratio="16/9"
                                :src="galleryViewService.createImageLinkWithToken(group?.screenshots, 0, timestamp)">
                            </v-img>

                        </v-hover>

                    </v-col>
                </v-row>
            </template>

            <v-alert v-else color="warning" icon="$warning" title="No data available"
                :text="galleryViewService.getAlertText(group?.name)"></v-alert>


            <v-dialog v-model="dialog" max-width="1500">
                <v-card>
                    <v-img 
                        class="img-styling"
                        :aspect-ratio="16/9"
                        :src="openedImageLink">
                    </v-img>
                </v-card>
            </v-dialog>

        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount, watch } from "vue";
    import { useRoute } from "vue-router";
    import * as galleryViewService from "@/services/component-services/galleryViewService";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import { storeToRefs } from "pinia";


    //reactive variables
    const dialog = ref(false);
    const group = ref<GroupUuid | null>();
    const noScreenshotData = ref<boolean>(false);
    const timestamp = ref(Date.now());
    const windowsAmount = ref<number>(1);
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
    let openedImageLink = "";
    let intervalGroup: NodeJS.Timer | null = null;
    let intervalImageUrl: NodeJS.Timer | null = null;


    //=============lifecycle and watchers==================
    onBeforeMount(async () => {
        //todo: add error handling
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        appBarStore.title = "Gallery View of Group: " + group.value?.name;

        assignData();
        startIntervalGroup();
        startIntervalImageUrl();
    });

    onBeforeUnmount(() => {
        stopIntervalGroup();
        stopIntervalImageUrl();
    });

    watch(appBarStoreRef.galleryGridSize, async () => {
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        assignData();
    });

    function assignData() {
        calcAmountOfWindows();
        noScreenshotData.value = false;

        if (group.value?.screenshots == null || group.value?.screenshots.length == 0) {
            noScreenshotData.value = true;
            return;
        }

        // screenshots.value = groupUuidResponse.screenshots.slice(0, -4);
        group.value.screenshots = group.value?.screenshots.flatMap(f => f ? [f] : []);

        if (group.value.screenshots.length == 0) {
            noScreenshotData.value = true;
        }
    }
    //==============================


    //=====window functions======
    function calcAmountOfWindows() {
        if (group.value?.numberOfSessions == null || group.value?.numberOfSessions == 0) {
            windowsAmount.value = 1;
            return;
        }

        windowsAmount.value = Math.ceil(group.value?.numberOfSessions / Math.pow(appBarStore.galleryGridSize.value, 2));
    }

    async function windowChange() {
        loadingStore.isLoading = true;
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        loadingStore.isLoading = false;
        assignData();
    }

    function openDialog(index: number) {
        openedImageLink = galleryViewService.createImageLinkWithToken(group.value?.screenshots, index, timestamp.value);
        dialog.value = true;
    }
    //==============================


    //=============interval==================
    function startIntervalGroup() {
        intervalGroup = setInterval(async () => {
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
        intervalImageUrl = setInterval(() => {
            timestamp.value = Date.now();

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

    .content{
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .img-styling{
        background-color: black;
    }

    .img-styling .hover-overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        background-color: rgba(255, 255, 255, 0.3);
    }

    .button-row {
        background-color: #404040;
        width: 100%;
        /* height: 100px; */
    }

    .title-box{
        color: white;
    }

    .content-filler{
        visibility: hidden;
    }

</style>