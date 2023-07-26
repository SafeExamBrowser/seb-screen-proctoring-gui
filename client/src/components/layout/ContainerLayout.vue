<template>

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
                <v-list-item-title>{{ title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-main>
        <v-container fluid>
            <v-app-bar>
                <v-app-bar-title>{{ store.title }}</v-app-bar-title>

                <v-app-bar-nav-icon class="d-none d-sm-flex d-md-none d-flex d-sm-none" variant="text"
                    @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </v-app-bar>
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watch, onUpdated, onBeforeMount } from 'vue'
import { useDisplay } from 'vuetify';
import * as groupService from "../../services/groupService";
import { useTitleStore } from '@/store/app';


const links = [
    ['SEB Groups Proctoring', '/start'],
    ['Example Page', '/example'],
]

const store = useTitleStore();
const drawer = ref()
const groupName = ref()

//todo: remove --> see when display size changes
const mobile = ref(useDisplay().sm)
watch(mobile, () => {
    console.log(mobile.value) // false
})
    //////////

</script>