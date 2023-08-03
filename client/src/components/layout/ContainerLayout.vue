<template>

    <v-navigation-drawer v-model="drawer" class="d-none d-sm-flex">
        <v-sheet class="pa-4">
            <v-img class="mx-auto h-12 w-auto" src="/img/logo.svg" alt="Logo ETH Zürich"></v-img>
            <div>SEB Screen Proctoring</div>
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

    <v-main>
        <v-container fluid>
            <v-app-bar>
                <v-app-bar-title>{{ appBarStore.title }}</v-app-bar-title>

                <v-app-bar-nav-icon class="d-none d-sm-flex d-md-none d-flex d-sm-none" variant="text"
                    @click.stop="drawer = !drawer">
                </v-app-bar-nav-icon>

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
                </template>

            </v-app-bar>
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import { ref, watch} from "vue"
    import { useDisplay } from "vuetify";
    import { useAppBarStore } from "@/store/app";
    import { useRoute } from "vue-router";

    const links = [
        ["SEB Groups Proctoring", "/start"],
        ["Example Page", "/example"],
    ];

    const gridSizes: GridSize[] = [
        {title: "2x2", value: 2},
        {title: "3x3", value: 3},
        {title: "4x4", value: 4},
    ];

    const appBarStore = useAppBarStore();
    const drawer = ref()

    //todo: remove --> see when display size changes
    const mobile = ref(useDisplay().sm)
    watch(mobile, () => {
        console.log(mobile.value) // false
    })
    //////////

    function signOut(){
        localStorage.clear();
    }

    function changeGridSize(gridSize: GridSize){
        appBarStore.galleryGridSize = gridSize;
    }


</script>