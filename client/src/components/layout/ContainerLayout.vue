<template>

    <v-navigation-drawer v-model="drawer" class="d-none d-sm-flex">
        
        <!--page title with logo-->
        <v-sheet class="pa-4">
            <v-img max-height="100" src="/img/seb-logo-no-border.png" alt="Logo ETH Zürich"></v-img>
            <div class="app-title text-h6">{{ $t("navigation.title") }}</div>
        </v-sheet>

        <!--navigation items-->
        <v-list>
            <v-list-item v-for="[title, link] in navigationLinks" :key="title" :to="link" link>
                <v-list-item-title>{{ title }}</v-list-item-title>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>

    <v-app-bar>

        <!--menu icon-->
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>

        <!--current site title-->
        <v-app-bar-title>{{ appBarStore.title }}</v-app-bar-title>


        <template v-slot:append>

            <!--gallery view specfic items-->
            <template v-if="useRoute().name == 'GalleryViewPage'">

                <div>
                    <v-chip class="session-info-item">
                        Page: {{ appBarStore.galleryCurrentPage }} / {{ appBarStore.galleryMaxPages }}
                    </v-chip>
                    <v-chip class="session-info-item">
                        Number of Sessions: {{ appBarStore.gallerNumberOfSessions }}
                    </v-chip>
                    <v-chip class="session-info-item">
                        Description: {{ appBarStore.galleryDescription }}
                    </v-chip>
                </div>

                <div class="grid-size-container">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" rounded="sm" color="primary" variant="flat">
                                <v-icon start icon="mdi-chevron-down" size="x-large"></v-icon>
                                Grid Size: {{ appBarStore.galleryGridSize.title }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item class="d-flex justify-center align-center" v-for="(gridSize, index) in gridSizes" :key="index" :value="index" @click="changeGridSize(gridSize)">
                                <v-list-item-title>{{ gridSize.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

                <div>
                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-btn 
                                icon="mdi-cog" 
                                v-bind="props"
                                color="primary">
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-switch class="mx-auto" label="Show Name" color="primary" v-model="appBarStore.galleryIsNameEnabled" hide-details></v-switch>
                                <v-switch class="mx-auto" label="Show Metadata" color="primary" v-model="appBarStore.galleryIsMetadataEnabled" hide-details></v-switch>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </template>
            <!-------–--------------------->

            <!--profile icon menu-->
            <div class="profile-icon-container">
                <v-menu
                    :close-on-content-click="false">

                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="primary" icon="mdi-account-circle" size="x-large" @click="userMenuOpened()"></v-btn>
                    </template>

                    <v-list>
                        <v-list-item class="d-flex">
                            <v-list-item-title>Logged in as: {{ userAccountStore.userAccount?.name }}</v-list-item-title>
                        </v-list-item>

                        <v-list-item class="d-flex" to="/account">
                            <v-list-item-title>Account</v-list-item-title>
                        </v-list-item>

                        <v-divider></v-divider>

                        <v-list-item>
                            <v-btn-toggle v-model="themeToggle" variant="text" mandatory>
                                <v-btn icon="mdi-white-balance-sunny"></v-btn>
                                <v-btn icon="mdi-weather-night"></v-btn>
                            </v-btn-toggle>
                        </v-list-item>

                        <v-divider></v-divider>

                        <v-list-item class="d-flex text-decoration-underline text-blue" @click="authStore.logout()">
                            <v-list-item-title>{{ $t("navigation.sign-out") }}</v-list-item-title>
                        </v-list-item>

                    </v-list>
                </v-menu>
            </div>

        </template>

    </v-app-bar>

    <!--main content view-->
    <v-main>
        <v-container fluid>
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import { ref, watchEffect } from "vue"
    import { useAppBarStore, useAuthStore, useUserAccountStore } from "@/store/app";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useRoute } from "vue-router";
    import { useTheme } from "vuetify";

    //navigation
    const drawer = ref();
    const navigationLinks = [
        ["SEB Groups Proctoring", "/start"],
        ["Search", "/search"],
    ];

    //stores
    const appBarStore = useAppBarStore();
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();

    //theme
    const theme = useTheme();
    const themeToggle = ref(0)

    //gallery view
    const gridSizes: GridSize[] = [
        {title: "2x2", value: 2},
        {title: "3x3", value: 3},
        {title: "4x4", value: 4},
        // {title: "5x5", value: 5},
        // {title: "6x6", value: 6},
    ];

    watchEffect(() => {
        const lightMode = themeToggle.value !== 1
        theme.global.name.value = lightMode ? "light" : "dark";
    });

    function changeGridSize(gridSize: GridSize){
        appBarStore.galleryGridSize = gridSize;
    }

    async function userMenuOpened(){
        await userAccountViewService.setPersonalUserAccount();
    }

</script>  

<style scoped>

    .app-title{
        text-align: center;
    }

    .session-info-item{
        margin-right: 10px;
    }

    .grid-size-container{
        margin-right: 10px;
    }

    .switch-container{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-right: 10px;
    }
</style>