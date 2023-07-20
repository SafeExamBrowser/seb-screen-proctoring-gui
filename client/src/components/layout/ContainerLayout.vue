<template>
    <v-container>
        <v-row>

            <!--Sidenav-->
            <v-col cols="1">
                <v-navigation-drawer v-model="drawer" class="d-none d-sm-flex">

                    <v-sheet class="pa-4">
                        <v-img class="mx-auto h-12 w-auto" src="/img/logo.svg" alt="Logo ETH Zürich"></v-img>
                        <div>SEB Screen Proctoring</div>
                    </v-sheet>

                    <v-sheet color="grey-lighten-4" class="pa-4">
                        <div>sebserver-admin</div>
                        <div class="text-decoration-underline">Sign out</div>
                    </v-sheet>

                    <v-divider></v-divider>

                    <v-list>
                        <v-list-item v-for="[title, link] in links" :key="title" :to="link" link>
                            <v-list-item-title>{{title}}</v-list-item-title>
                        </v-list-item>
                    </v-list>

                </v-navigation-drawer>
            </v-col>

            <!--Main Content-->
            <v-col cols="11">
                <v-main>
                    <v-app-bar>
                        <v-app-bar-title>{{ getTitle() }}</v-app-bar-title>
                        <v-app-bar-nav-icon class="d-none d-sm-flex d-md-none d-flex d-sm-none" variant="text"
                            @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                    </v-app-bar>
                    <router-view></router-view>
                </v-main>
            </v-col>

        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref, watch, onUpdated, onBeforeMount } from 'vue'
    import { useDisplay } from 'vuetify';
    import * as groupService from "../../services/groupService";


    const links = [
        ['SEB Groups Proctoring', '/start'],
        ['Example Page', '/example'],
    ]

    const drawer = ref()
    let groupName = ref()

    //todo: remove --> see when display size changes
    const mobile = ref(useDisplay().sm)
    watch(mobile, () => {
        console.log(mobile.value) // false
    })

    onBeforeMount(async () => {
        getGroupName();
    });

    onUpdated(async () => {
        getGroupName();
    });

    function getTitle(): string{
        switch(useRoute().name?.toString()){
            case "StartPage":
                return "Active SEB Groups";
            
            case "ExamplePage":
                return "Example Page";
            
            case "GalleryViewPage":
                return "Proctoring View of Group: " + groupName.value;

            default:
                return "";
        }
    }

    async function getGroupName(){
        if(useRoute().name?.toString() == "GalleryViewPage"){
            try {
                const groupUuidResponse: GroupUuidResponse = await groupService.getGroupByUuid(useRoute().params.uuid.toString());
                groupName.value = groupUuidResponse.name

            } catch (error) {
                return "group not found"
            }
        }
    }

</script>