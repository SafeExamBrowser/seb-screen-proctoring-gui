<template>

    

    <v-row v-for="i in 3">
        <v-col v-for="n in 3">
            <v-card>
                <v-card-title> {{returnClientName((i-1) * 3 + (n-1))}}</v-card-title>
                <v-img :src="createImageLinkWithToken((i-1) * 3 + (n-1))" max-height="400px"></v-img>
            </v-card>
        </v-col>
    </v-row>



    <!-- <div class="gallery-view-container">

        <div class="container">
            <div class="row">

                <div v-for="screenshot in screenshots" :key="screenshot.uuid" class="col-lg-4 col-md-4 col-sm-12">

                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ screenshot.clientName }}</h5>
                        </div>
                        <img :src=createImageLinkWithToken(screenshot.imageLink) class="card-img-top" alt="Image Title 1">
                    </div>

                </div>

            </div>
        </div>

    </div> -->

</template>


<script setup lang="ts">
    import {ref, onBeforeMount} from "vue";
    import {useRoute} from "vue-router";
    import * as groupService from "../../services/groupService";


    const screenshots = ref<Screenshot[]>();


    onBeforeMount(async () => {
        try {
            const groupUuidResponse: GroupUuidResponse = await groupService.getGroupByUuid(useRoute().params.uuid.toString());
            screenshots.value = groupUuidResponse.screenshots;

            // console.log(groupUuidResponse)

            // if(groupUuidResponse.screenshots.length != 0){
            //     const imageLink: string = groupUuidResponse.screenshots[0].latestImageLink + "?access_token=" + localStorage.getItem("token");
            // }

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }

    });

    function returnClientName(index: number): string{
        if(screenshots.value != null){
            return screenshots.value[index].clientName;
        }

        return "";
    }

    function createImageLinkWithToken(index: number): string{
        if(screenshots.value != null){
            return screenshots.value[index].latestImageLink  + "?access_token=" + localStorage.getItem("token");
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