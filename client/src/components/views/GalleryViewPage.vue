<template>
    <v-window v-model="currentWindow" @update:model-value="windowChange()" show-arrows>
        <v-window-item v-for="w in windowsAmount" class="padding">   

            <v-row v-if="!noScreenshotData" v-for="i in GRID_SIZE">
                <v-col v-for="n in GRID_SIZE">
                    <v-card v-if="currentIndexExists(calcIndex(i, n))">
                        <v-card-title> {{returnClientName(calcIndex(i, n))}}</v-card-title>
                        <v-img v-if="screenshots != undefined && screenshots[calcIndex(i, n)].active" :src="createImageLinkWithToken(calcIndex(i, n)) + '&t=' + timestamp"></v-img>
                        <v-img v-else :src="createImageLinkWithToken(calcIndex(i, n))"></v-img>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn rounded="sm" color="primary" variant="outlined" @click="openDialog(calcIndex(i, n))">
                                Expand
                            </v-btn>
                            
                            <v-btn :to="getProctoringViewLink(calcIndex(i, n))" rounded="sm" color="primary" variant="flat">
                                Details View
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <v-alert v-else color="warning" icon="$warning" title="No data available" :text="getAlertText()"></v-alert>

            <v-dialog v-model="dialog" max-width="1500">
                <v-card>
                    <v-img :src="openedImageLink"></v-img>
                </v-card>
            </v-dialog>

        </v-window-item>

    </v-window>




</template>


<script setup lang="ts">
    import {ref, onBeforeMount, onBeforeUnmount, computed} from "vue";
    import {useRoute} from "vue-router";
    import * as groupService from "../../services/groupService";
    import {SortOrder} from "../../models/sortOrderEnum";
    import router from "@/router";
    import { useTitleStore } from "@/store/app";

    //todo: configure eslint

    const GRID_SIZE: number = 3;
    const IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 5 * 1000;
    const SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 1 * 1000;

    const titleStore = useTitleStore();
    const groupUuid: string = useRoute().params.uuid.toString();

    const dialog = ref(false);
    const screenshots = ref<Screenshot[]>();
    const noScreenshotData = ref<boolean>(false);
    const timestamp = ref(Date.now());
    const windowsAmount = ref<number>(1);
    const currentWindow = ref<number>(0);
    const numberOfSessions = ref<number>();

    let openedImageLink: string = "";
    let intervalScreenshots: any | null = null;
    let intervalImageUrl: any | null = null;
    let groupName: string = "";

    onBeforeMount(async () => {
        await getAndAsingScreenshots();
        titleStore.title = "Gallery View of Group: " + groupName;
        windowsAmount.value = calcAmountOfWindows();
        

        //relaod data as long as atleast one item has an active session
        if(screenshots.value?.some(screenshot => screenshot.active) || screenshots.value == null){

            intervalScreenshots = setInterval(async () => {
                console.log("test")
                await getAndAsingScreenshots();
            }, IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S);

            intervalImageUrl = setInterval(() => {
                timestamp.value = Date.now();
            }, SCREENSHOTS_RELOAD_INTERVAL_IN_S);
        }

        console.log("windowsAmount: " + windowsAmount.value)
        
    });

    onBeforeUnmount(() => {
        if (intervalScreenshots) {
            clearInterval(intervalScreenshots);
        }

        if (intervalImageUrl) {
            clearInterval(intervalImageUrl);
        }
    });

    async function getAndAsingScreenshots(){
        try {
            const groupUuidResponse: GroupUuidResponse = await groupService.getGroupByUuid(groupUuid, {sortOrder: SortOrder.desc, pageNumber: (currentWindow.value == 0) ? 1 : currentWindow.value});
            //todo: extract groupname
            groupName = groupUuidResponse.name;
            groupUuidResponse.numberOfSessions
            noScreenshotData.value = false;

            if(groupUuidResponse.screenshots == null || groupUuidResponse.screenshots.length == 0){
                noScreenshotData.value = true;
                return;
            }

            //todo: maybe change object to reactive instead of ref
            // screenshots.value = groupUuidResponse.screenshots.slice(0, -4);
            screenshots.value = groupUuidResponse.screenshots.flatMap(f => f ? [f] : []);
            numberOfSessions.value = groupUuidResponse.numberOfSessions;

            if(screenshots.value.length == 0){
                noScreenshotData.value = true;
                return;
            }

            console.log(screenshots.value)

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }
    }

    function calcAmountOfWindows(): number{
        if(numberOfSessions.value == null){
            return 1;
        }

        return Math.ceil(numberOfSessions.value / Math.pow(GRID_SIZE, 2));
    }

    async function windowChange(){
        console.log(currentWindow.value)
        await getAndAsingScreenshots();
    }

    //todo: change to computed prop
    function calcIndex(i: number, n: number): number{
        return (i - 1) * 3 + (n - 1);
    }

    function currentIndexExists(index: number): boolean{
        if(screenshots.value != null && screenshots.value.length > index){
            return true;
        }

        return false;
    }

    function returnClientName(index: number): string{

        if(screenshots.value != null){
            return screenshots.value[index].clientName;
        }

        return "";
    }

    function createImageLinkWithToken(index: number): string{
        if(screenshots.value != null){
            // console.log("latestImageLink: " + screenshots.value[index].latestImageLink)
            // console.log("imageLink with token: " + screenshots.value[index].latestImageLink + "?access_token=" + localStorage.getItem("accessToken"))
            return screenshots.value[index].latestImageLink  + "?access_token=" + localStorage.getItem("accessToken");
        }

        return "";
    }

    function getAlertText(): string{
        return "The group: " + groupName + " has no recorded sessions"
    }

    function openDialog(index: number){
        openedImageLink = createImageLinkWithToken(index) + "&t=" + timestamp.value;
        dialog.value = true;
    }

    function getProctoringViewLink(index: number): string{
        if(screenshots.value != null){
            return "/galleryView/" + groupUuid + "/recording/" + screenshots.value[index].uuid;
        }

        return "";
    }



</script>

<style>
    .padding{
        padding-top: 25px;
        padding-left: 100px;
        padding-right: 100px;
        padding-bottom: 25px;
    }

</style>
