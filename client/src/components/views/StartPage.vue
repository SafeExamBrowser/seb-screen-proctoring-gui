<template>
    
    <div class="table-container">
        <div class="table d-flex align-center">
            <v-data-table 
                item-value="name" 
                class="elevation-1"
                :items-per-page="defaultItemsPerPage" 
                :items-per-page-options="calculateItemsPerPage()"
                :headers="headers" 
                :items="groups">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <tr>
                        <template v-for="(column, index) in columns">
                        <td>
                            <span 
                                ref="headerRefs"
                                tabindex="0" 
                                class="mr-2 cursor-pointer" 
                                role="button" 
                                @keydown="handleTabKeyEvent($event, 'sort', 0, index)" 
                                @click="() => toggleSort(column)">{{ column.title }}
                            </span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>
                        </td>
                        </template>
                    </tr>
                </template>


                <template v-slot:item.name="{item}">
                    <td class="text-decoration-underline text-blue">
                        <div 
                            role="button" 
                            tabindex="0" 
                            @keydown="handleTabKeyEvent($event, 'navigate', item.index, 0)">
                            <router-link :to="getGalleryViewLink(item.index)">{{item.columns.name}}</router-link>
                        </div>
                    </td>
                </template>
                <template v-slot:item.creationTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.columns.creationTime)}}
                        </div>
                    </td>
                </template>

            </v-data-table>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as groupService from "@/services/api-services/groupService";
    import { VDataTable } from "vuetify/labs/VDataTable"
    import { useAppBarStore } from "@/store/app";
    import * as timeUtils from "@/utils/timeUtils";
    import router from "@/router";

    const appBarStore = useAppBarStore();
    const groups = ref<Group[]>();
    const defaultItemsPerPage = ref<number>(0)
    const headerRefs = ref<any[]>();

    const headers = ref([
        {title: "Name", key: "name"},
        {title: "Description", key: "description"},
        {title: "Start-Time", key: "creationTime"},
    ]);

    onBeforeMount(async () => {
        try {
            appBarStore.title = "Active SEB Groups"
            groups.value = await groupService.getGroups({pageSize: 500});

            // groups.value = groups.value + groups.value + groups.value

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }
    });


    function getGalleryViewLink(index: number) {
        if(groups.value != null){
            return "/galleryView/" + groups.value[index].uuid;
        }
        
        return "";
    }

    function handleTabKeyEvent(event: any, action: string, index: number, key: number){
        if (event.key == 'Enter' || event.key == ' ') {

            if(action == "sort"){
                sortTable(key)
            }

            if(action == "navigate"){
                navigateToGalleryView(index);
            }
        }
    }

    function navigateToGalleryView(index: number){
        router.push({
            path: getGalleryViewLink(index)
        });
    }

    function sortTable(key: number){
        if(headerRefs.value != null){
            headerRefs.value[key].click();
        }
    }

    function calculateItemsPerPage(): {value: number, title: string}[]{ 
        if(groups == null || groups.value == null || groups.value.length == 0){
            return [{value: 0, title: "0"}];
        }


        if (groups.value.length < 5){
            defaultItemsPerPage.value = groups.value.length;
            return [
                {value: groups.value.length, title: 'All'},
            ]
        }

        if (groups.value.length < 10){
            defaultItemsPerPage.value = 5;
            return [
                {value: 5, title: '5'},
                {value: groups.value.length, title: 'All'},
            ]
        }

        if (groups.value.length < 15){
            defaultItemsPerPage.value = 10;
            return [
                {value: 5, title: '5'},
                {value: 10, title: '10'},
                {value: groups.value.length, title: 'All'},
            ]
        }

        defaultItemsPerPage.value = 15;

        return [
            {value: 5, title: '5'},
            {value: 10, title: '10'},
            {value: 15, title: '15'},
            {value: groups.value.length, title: 'All'},
        ];
    }

</script>

<style>
    .table-container{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .table {
        width: 75%;
    }
</style>