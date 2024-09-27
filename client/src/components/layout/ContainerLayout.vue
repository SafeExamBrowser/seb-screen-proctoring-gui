<template>
    <v-navigation-drawer v-model="drawer" :permanent="true">

        <v-sheet class="pa-4">
            <a :href="getHomePageRoute()" class="text-decoration-none text-black">
                <v-img max-height="100" src="/img/seb-logo-no-border.png" alt="Screen Proctoring Homepage"></v-img>
                <div class="app-title text-h6 text-title">{{ $t("navigation.title") }}</div>
            </a>
        </v-sheet>

        <v-list>
            <v-list-item v-for="[title, link] in navigationLinks" :key="title" :to="link" link>
                <v-list-item-title>{{ title }}</v-list-item-title>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>

    <v-app-bar>
        <!--menu icon-->
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" aria-label="Navigation Bar" :aria-expanded="drawer">
        </v-app-bar-nav-icon>

        <!--current site title-->
        <v-app-bar-title>
            <h1 class="title-inherit-styling">{{ appBarStore.title }}</h1>
        </v-app-bar-title>

        <template v-slot:append>

        <!--exams overview specfic items-->
        <template v-if="useRoute().name == 'ExamsOverview'">
            <div>
                <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            aria-label="Running Exams Settings"
                            icon="mdi-cog" 
                            v-bind="props"
                            color="primary">
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-switch 
                                hide-details
                                class="mx-auto" 
                                label="Show past exams" 
                                color="primary" 
                                v-model="appBarStore.examOverviewShowPastExams">
                            </v-switch>
                        </v-list-item>
                        <v-list-item>
                            <v-switch 
                                hide-details
                                class="mx-auto" 
                                label="Show upcoming exams" 
                                color="primary" 
                                v-model="appBarStore.examOverviewShowUpcomingExams">
                            </v-switch>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>

            </template>
            <!-------–--------------------->
        
            <!--gallery view specfic items-->
            <template v-if="useRoute().name == 'GalleryViewPage'">
                
                <!--session infos-->
                <v-chip class="app-bar-item-margin" role="none">
                    Page: {{ appBarStore.galleryCurrentPage }} / {{ appBarStore.galleryMaxPages }}
                </v-chip>
                <v-chip class="app-bar-item-margin" role="none">
                    Sessions: {{ appBarStore.galleryLiveSessions }} / {{ appBarStore.galleryAmountOfSessions }}
                    <v-tooltip
                        role="none"
                        activator="parent"
                        location="bottom"
                        aria-label="currently live / total amount of sessions">
                        currently live / total amount of sessions
                    </v-tooltip>
                </v-chip>

                <!--change grid size-->
                <div class="app-bar-item-margin">
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

                <!--settings-->
                <div>
                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-btn 
                                aria-label="Gallery View Settings"
                                icon="mdi-cog" 
                                v-bind="props"
                                color="primary">
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-switch class="mx-auto" label="Show Name" color="primary" v-model="appBarStore.galleryIsNameEnabled" hide-details></v-switch>
                                <v-switch class="mx-auto" label="Show IP" color="primary" v-model="appBarStore.galleryIsIpEnabled" hide-details></v-switch>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list-item>
                                <v-btn
                                    variant="outlined"
                                    @click="appBarStore.galleryIsNameSortAsc = !appBarStore.galleryIsNameSortAsc">
                                    Sort by Name
                                    <template v-slot:append>
                                        <v-icon size="x-large" :icon="appBarStore.galleryIsNameSortAsc ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                                    </template>
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

            </template>
            <!-------–--------------------->

            <!--profile icon menu-->
            <div class="profile-icon-container">
                <v-menu :close-on-content-click="false">

                    <template v-slot:activator="{ props }">
                        <v-btn 
                            aria-label="Profile"
                            v-bind="props" 
                            color="primary" 
                            icon="mdi-account-circle" 
                            size="x-large" 
                            @click="userMenuOpened()">
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item class="d-flex">
                            <v-list-item-title>{{ $t('navigation.loggedInAs') }}: {{ userAccountStore.userAccount?.name }}</v-list-item-title>
                        </v-list-item>

                        <v-list-item class="d-flex" :to=constants.ACCOUNT_VIEW_ROUTE>
                            <v-list-item-title>{{ $t('navigation.accountSettings') }}</v-list-item-title>
                        </v-list-item>

                        <v-divider></v-divider>

                        <!-- <v-list-item>
                            <v-btn-toggle v-model="languageToggle" variant="text" mandatory>
                                <v-btn>EN</v-btn>
                                <v-btn>DE</v-btn>
                            </v-btn-toggle>
                        </v-list-item> -->

                        <!-- <v-list-item>
                            <v-btn-toggle v-model="themeToggle" variant="text" mandatory>
                                <v-btn icon="mdi-white-balance-sunny"></v-btn>
                                <v-btn icon="mdi-weather-night"></v-btn>
                            </v-btn-toggle>
                        </v-list-item> -->

                        <v-divider></v-divider>

                        <v-list-item tabindex="0" class="text-decoration-underline text-blue mx-auto" @click="authStore.logout()">
                            <v-list-item-title class="mx-auto">{{ $t("navigation.signOut") }}</v-list-item-title>
                        </v-list-item>

                        <!-- <v-divider></v-divider>

                        <v-list-item class="d-flex">
                            <v-list-item-title>GUI Version: {{ gitTag }}</v-list-item-title>
                        </v-list-item> -->


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
    import { ref, watch } from "vue"
    import { useAppBarStore, useAuthStore, useUserAccountStore } from "@/store/store";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useRoute } from "vue-router";
    import { useTheme } from "vuetify";
    import { useI18n } from "vue-i18n";
    import * as constants from "@/utils/constants";


    //navigation
    const drawer = ref();
    const navigationLinks = [
        ["Running Exams", constants.RUNNING_EXAMS_ROUTE],
        ["Search", constants.SEARCH_ROUTE],
    ];

    //stores
    const appBarStore = useAppBarStore();
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();

    //theme
    const theme = useTheme();
    const localstorageTheme: string | null = localStorage.getItem("theme");
    theme.global.name.value = localstorageTheme ?? theme.global.name.value ?? "light";
    const themeToggle = ref<number>(theme.global.name.value === "dark" ? 1 : 0);

    //gallery view
    const gridSizes: GridSize[] = [
        {title: "2x2", value: 2},
        {title: "3x3", value: 3},
        {title: "4x4", value: 4},
        // {title: "5x5", value: 5},
        // {title: "6x6", value: 6},
    ];

    //i18n
    const { locale } = useI18n();
    const localStorageLocale: string | null = localStorage.getItem("locale");
    locale.value = localStorageLocale ?? "en";
    const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);
    
    //git tag
    //@ts-ignore
    // const gitTag = __GIT_TAG__;

    //watchers
    watch(languageToggle, () => {
        locale.value = languageToggle.value === 0 ? "en" : "de";
        localStorage.setItem("locale", locale.value);
    });

    watch(themeToggle, () => {
        theme.global.name.value = themeToggle.value === 0 ? "light" : "dark";
        localStorage.setItem("theme", theme.global.name.value);
    });


    //methods
    function changeGridSize(gridSize: GridSize){
        appBarStore.galleryGridSize = gridSize;
    }

    async function userMenuOpened(){
        await userAccountViewService.setPersonalUserAccount();
    }

    function getHomePageRoute(){
        if(process.env.VITE_SUB_PATH == null){
            return constants.RUNNING_EXAMS_ROUTE;
        }

        return process.env.VITE_SUB_PATH + constants.RUNNING_EXAMS_ROUTE;
    }

</script>  

<style scoped>
    .app-title{
        text-align: center;
    }

    .app-bar-item-margin{
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