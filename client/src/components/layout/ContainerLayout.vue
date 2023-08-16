<template>

    <v-navigation-drawer v-model="drawer" class="d-none d-sm-flex">
        <v-sheet class="pa-4">
            <v-img class="mx-auto h-12 w-auto" src="/img/logo.svg" alt="Logo ETH Zürich"></v-img>
            <div class="app-title">SEB Screen Proctoring</div>
        </v-sheet>

        <v-sheet color="grey-lighten-4" class="pa-4">
            <div>sebserver-admin</div>
            <div class="text-decoration-underline text-blue">
                <router-link @click="signOut()" to="/">Sign out</router-link>
            </div>
        </v-sheet>

        <v-divider></v-divider>

        <v-list>
            <v-list-item v-for="[title, link] in links" :key="title" :to="link" link>
                <v-list-item-title>{{ title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar>
        <v-app-bar-nav-icon variant="text"
            @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>
        <v-app-bar-title>{{ appBarStore.title }}</v-app-bar-title>

        <template v-if="useRoute().name == 'GalleryViewPage'" v-slot:append>
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
            <div class="switch-container">
                <v-switch class="mx-auto" label="Show Name" color="primary" v-model="appBarStore.isNameEnabled"></v-switch>
            </div>
        </template>
    </v-app-bar>

    <v-main>
        <v-container fluid>
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import { ref } from "vue"
    import { useAppBarStore } from "@/store/app";
    import { useRoute } from "vue-router";

    const drawer = ref();

    const appBarStore = useAppBarStore();

    const links = [
        ["SEB Groups Proctoring", "/start"],
        ["Search", "/search"],
        ["Example Page", "/example"],
    ];

    const gridSizes: GridSize[] = [
        {title: "2x2", value: 2},
        {title: "3x3", value: 3},
        {title: "4x4", value: 4},
        // {title: "5x5", value: 5},
        // {title: "6x6", value: 6},
    ];

    function signOut(){
        localStorage.clear();
    }

    function changeGridSize(gridSize: GridSize){
        appBarStore.galleryGridSize = gridSize;
    }

</script>

<style>
    .app-title{
        text-align: center;
    }

    .switch-container{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-left: 10px;
    }

</style>