<template>
    <v-window v-model="currentWindow" @update:model-value="windowChange()" show-arrows>
        <v-window-item v-for="w in windowsAmount" class="padding-window">

            <v-row v-if="!noScreenshotData" v-for="i in appBarStore.galleryGridSize.value">
                <v-col v-for="n in appBarStore.galleryGridSize.value">

                    <v-card v-if="galleryViewService.currentIndexExists(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))" variant="outlined">
                        <v-toolbar color="white">
                            <v-toolbar-title>{{ group?.screenshots[galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value)].clientName  }}</v-toolbar-title>

                            <template v-slot:append>
                                <v-btn rounded="sm" color="primary" variant="outlined" @click="openDialog(galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))">
                                    Expand
                                </v-btn>

                                <v-btn :to="galleryViewService.getProctoringViewLink(group?.screenshots, groupUuid, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))" rounded="sm" color="primary" variant="flat" class="ml-2">
                                    Details View
                                </v-btn>
                            </template>
                        </v-toolbar>

                        <v-img v-if="group != undefined && group.screenshots[galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value)].active"
                            :src="galleryViewService.createImageLinkWithToken(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value)) + '&t=' + timestamp"></v-img>
                        <v-img v-else :src="galleryViewService.createImageLinkWithToken(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))"></v-img>
                    </v-card>

                </v-col>
            </v-row>

            <v-alert v-else color="warning" icon="$warning" title="No data available"
                :text="galleryViewService.getAlertText(group?.name)"></v-alert>

            <v-dialog v-model="dialog" max-width="1500">
                <v-card>
                    <v-img :src="openedImageLink"></v-img>
                </v-card>
            </v-dialog>

        </v-window-item>
    </v-window>
</template>

<style>
    .padding-window {
        padding-top: 25px;
        padding-left: 100px;
        padding-right: 100px;
        padding-bottom: 25px;
    }

    .padding-select {
        padding-top: 25px;
    }
</style>



<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount, watch } from "vue";
    import { useRoute } from "vue-router";
    import * as galleryViewService from "@/services/component-services/galleryViewService";
    import { useAppBarStore } from "@/store/app";

    //todo: configure eslint
    const IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 5 * 1000;
    const SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 1 * 1000;

    const appBarStore = useAppBarStore();
    const groupUuid: string = useRoute().params.uuid.toString();

    const dialog = ref(false);
    const group = ref<GroupUuid | null>();
    const noScreenshotData = ref<boolean>(false);
    const timestamp = ref(Date.now());
    const windowsAmount = ref<number>(1);
    const currentWindow = ref<number>(0);

    let openedImageLink: string = "";
    let intervalGroup: any | null = null;
    let intervalImageUrl: any | null = null;

    onBeforeMount(async () => {
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

    function calcAmountOfWindows(){
        if (group.value?.numberOfSessions == null || group.value?.numberOfSessions == 0) {
            windowsAmount.value = 1;
            return;
        }

        windowsAmount.value = Math.ceil(group.value?.numberOfSessions / Math.pow(appBarStore.galleryGridSize.value, 2));
    }

    async function windowChange() {
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
        assignData();
    }

    function openDialog(index: number) {
        openedImageLink = galleryViewService.createImageLinkWithToken(group.value?.screenshots, index) + "&t=" + timestamp.value;
        dialog.value = true;
    }

    //=============interval==================
    function startIntervalGroup(){
        intervalGroup = setInterval(async () => {
            console.log("interval group")

            group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);
            assignData();

        }, IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S);
    }

    function startIntervalImageUrl(){
        intervalImageUrl = setInterval(() => {
            console.log("interval image")
            timestamp.value = Date.now();

        }, SCREENSHOTS_RELOAD_INTERVAL_IN_S);

    }

    function stopIntervalGroup(){
        if (intervalGroup) {
            clearInterval(intervalGroup);
        }
    }

    function stopIntervalImageUrl(){
        if (intervalImageUrl) {
            clearInterval(intervalImageUrl);
        }
    }

</script>