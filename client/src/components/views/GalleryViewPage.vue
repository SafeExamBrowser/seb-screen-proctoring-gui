<template>

    <v-row v-if="!noScreenshotData" v-for="i in GRID_SIZE">
        <v-col v-for="n in GRID_SIZE">

            <v-card v-if="currentIndexExists(calcIndex(i, n))" max-width="600">
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



</template>


<script setup lang="ts">
    import {ref, onBeforeMount, onBeforeUnmount} from "vue";
    import {useRoute} from "vue-router";
    import * as groupService from "../../services/groupService";
    import {SortOrder} from "../../models/sortOrderEnum";
    import router from "@/router";

    //todo: configure eslint

    const GRID_SIZE: number = 3
    const IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 5 * 1000;
    const SCREENSHOTS_RELOAD_INTERVAL_IN_S: number = 1 * 1000;


    const dialog = ref(false);
    const screenshots = ref<Screenshot[]>();
    const noScreenshotData = ref<boolean>(false);
    const timestamp = ref(Date.now());

    const groupUuid: string = useRoute().params.uuid.toString();
    let groupName: string = "";
    let openedImageLink: string = "";
    let intervalScreenshots: any | null = null;
    let intervalImageUrl: any | null = null;

    onBeforeMount(async () => {
        await getAndAsingScreenshots();

        //relaod data as long as atleast one item has an active session
        if(screenshots.value?.some(screenshot => screenshot.active)){

            console.log("teeeeeeest")

            intervalScreenshots = setInterval(async () => {
                await getAndAsingScreenshots();
            }, IMG_URL_SCREENSHOTS_RELOAD_INTERVAL_IN_S);

            intervalImageUrl = setInterval(() => {
                timestamp.value = Date.now();
            }, SCREENSHOTS_RELOAD_INTERVAL_IN_S);
        }
        
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
            const groupUuidResponse: GroupUuidResponse = await groupService.getGroupByUuid(groupUuid, {sortOrder: SortOrder.desc});
            groupName = groupUuidResponse.name;

            if(groupUuidResponse.screenshots == null || groupUuidResponse.screenshots.length == 0){
                noScreenshotData.value = true;
                return;
            }

            // screenshots.value = groupUuidResponse.screenshots.slice(0, -4);
            screenshots.value = groupUuidResponse.screenshots.flatMap(f => f ? [f] : []);

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
            // console.log("imageLink with token: " + screenshots.value[index].latestImageLink + "?access_token=" + localStorage.getItem("token"))
            return screenshots.value[index].latestImageLink  + "?access_token=" + localStorage.getItem("token");
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
    .gallery-view-container{
        width: 60%;
        height: 60%;
    }
</style>
