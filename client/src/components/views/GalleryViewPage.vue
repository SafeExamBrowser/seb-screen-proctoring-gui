<template>
    <v-window v-model="currentWindow" @update:model-value="windowChange()" show-arrows>
        <v-window-item v-for="(w , index) in windowsAmount">

            <v-row v-if="!noScreenshotData" v-for="i in appBarStore.galleryGridSize.value" no-gutters>
                <v-col v-for="n in appBarStore.galleryGridSize.value">

                    <v-hover v-slot="{isHovering, props}">
                        <v-img
                            v-if="galleryViewService.currentIndexExists(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value))"
                            v-bind="props"
                            :class="{'on-hover': isHovering}"
                            :src="galleryViewService.createImageLinkWithToken(group?.screenshots, galleryViewService.calcIndex(i, n, appBarStore.galleryGridSize.value), timestamp)">

                            <div v-if="isHovering" class="button-container hover-overlay d-flex align-end">
                                <v-sheet class="d-flex pa-2 button-row">
                                    <span v-if="appBarStore.isNameEnabled" class="text-h5 title-box">
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
                            </div>
                            
                        </v-img>
                    </v-hover>

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

<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount, watch } from "vue";
    import { useRoute } from "vue-router";
    import * as galleryViewService from "@/services/component-services/galleryViewService";
    import { useAppBarStore } from "@/store/app";
    import { storeToRefs } from "pinia";

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
    const nextWindowNotVisible = ref(true);
    const appBarStoreRef = storeToRefs(appBarStore);

    let openedImageLink: string = "";
    let intervalGroup: any | null = null;
    let intervalImageUrl: any | null = null;
    let firstLoad: boolean = true;

    onBeforeMount(async () => {
        group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);

        // group.value = {
        //         uuid: "demo2",
        //         name: "demo2",
        //         description: "demo2",
        //         numberOfSessions: 15,
        //         pageNumber: 1,
        //         pageSize: 16,
        //         sortOrder: "DESCENDING",
        //         sortBy: "",
        //         screenshots: [
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             },
        //             {
        //                 "startTime": 1691137360055,
        //                 "timestamp": 1691137479450,
        //                 "endTime": 1691137480072,
        //                 "active": false,
        //                 "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "clientName": "seb_14",
        //                 "clientIp": "0.0.0.0",
        //                 "clientMachineName": "localhost",
        //                 "clientOsName": "windows",
        //                 "clientVersion": "0.1-httpBot",
        //                 "imageFormat": "PNG",
        //                 "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
        //                 "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
        //             }
        //         ]
        // }

        appBarStore.title = "Gallery View of Group: " + group.value?.name;

        assignData();
        firstLoad = false;

        startIntervalGroup();
        startIntervalImageUrl();
    });

    onBeforeUnmount(() => {
        stopIntervalGroup();
        stopIntervalImageUrl();
    });

    watch(currentWindow, (newVal) => {
        if (newVal + 1 < windowsAmount.value) {
            nextWindowNotVisible.value = false;
        }
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

    //=====window functions======
    function calcAmountOfWindows() {
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
        openedImageLink = galleryViewService.createImageLinkWithToken(group.value?.screenshots, index, timestamp.value);
        dialog.value = true;
    }
    //==============================

    //=============interval==================
    function startIntervalGroup() {
        intervalGroup = setInterval(async () => {
            group.value = await galleryViewService.getGroup(groupUuid, currentWindow.value, appBarStore.galleryGridSize.value);


            // group.value = {
            //     uuid: "demo2",
            //     name: "demo2",
            //     description: "demo2",
            //     numberOfSessions: 15,
            //     pageNumber: 1,
            //     pageSize: 9,
            //     sortOrder: "DESCENDING",
            //     sortBy: "",
            //     screenshots: [
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         },
            //         {
            //             "startTime": 1691137360055,
            //             "timestamp": 1691137479450,
            //             "endTime": 1691137480072,
            //             "active": false,
            //             "uuid": "23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "clientName": "seb_14",
            //             "clientIp": "0.0.0.0",
            //             "clientMachineName": "localhost",
            //             "clientOsName": "windows",
            //             "clientVersion": "0.1-httpBot",
            //             "imageFormat": "PNG",
            //             "latestImageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8",
            //             "imageLink": "http://localhost:8090/admin-api/v1/proctoring/screenshot/23da1ef6-a0d3-41d8-a927-2a7e026181d8/1691486907433",
            //         }
            //     ]
            // }


            assignData();

        }, IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S);
    }

    function startIntervalImageUrl() {
        intervalImageUrl = setInterval(() => {
            timestamp.value = Date.now();

        }, SCREENSHOTS_RELOAD_INTERVAL_IN_S);

    }

    function stopIntervalGroup() {
        if (intervalGroup) {
            clearInterval(intervalGroup);
        }
    }

    function stopIntervalImageUrl() {
        if (intervalImageUrl) {
            clearInterval(intervalImageUrl);
        }
    }

</script>

<style scoped>

    .v-img {
        border: 2px solid black;
    }
    
    .v-img .hover-overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        background-color: rgba(255, 255, 255, 0.3);
    }

    .button-container {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
    }

    .button-row {
        background-color: #404040;
        width: 100%;
    }

    .title-box{
        color: white;
    }

    .hidden-window {
        display: none;
    }

</style>