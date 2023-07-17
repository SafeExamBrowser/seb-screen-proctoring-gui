<template>
    <!-- @vue-ignore -->
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="groups" item-value="name" class="elevation-1">

        <template v-slot:item.name="{item}">
            <td class="text-decoration-underline text-blue">
                <div>
                    <router-link :to="returnGalleryViewLink(item.index)">{{item.columns.name}}</router-link>
                </div>
            </td>
        </template>

    </v-data-table>


</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as groupService from "../../services/groupService";
    import router from "@/router";
    import { VDataTable } from "vuetify/labs/VDataTable"

    const groups = ref<Group[]>();

    onBeforeMount(async () => {
        try {
            groups.value = await groupService.getGroups();

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }

    });

    const headers = ref([
        {title: "Name", key: "name"},
        {title: "Description", key: "description"},
        {title: "Start-Time", key: "creationTime"},
    ])

    const itemsPerPage = ref<number>(5)

    function returnGalleryViewLink(index: number) {
        if(groups.value != null){
            return "/galleryView/" + groups.value[index].uuid;
        }
        
        return "";
    }


</script>

<style>
.table-container {
    width: 50%;
}
</style>