<template>
    
    <div class="table-container">
        <div class="table d-flex align-center">
            <v-data-table 
                item-value="item.name" 
                class="elevation-1"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(groups)" 
                :items-per-page-options="tableUtils.calcItemsPerPage(groups)"
                :headers="headers" 
                :items="groups">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <tr>
                        <template v-for="(column, index) in columns">
                        <td>
                            <span 
                                ref="headerRefs"
                                tabindex="0" 
                                class="mr-2 cursor-pointer font-weight-bold" 
                                role="button" 
                                @keydown="handleTabKeyEvent($event, 'sort', 0, index)" 
                                @click="() => toggleSort(column)"
                            >
                                {{ column.title }}
                            </span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>
                        </td>
                        </template>
                    </tr>
                </template>

                <template v-slot:item.name="{item, index, internalItem}">
                    <td class="text-decoration-underline text-blue">
                        <div 
                            role="button" 
                            tabindex="0" 
                            @keydown="handleTabKeyEvent($event, 'navigate', internalItem.index, 0)">
                            <router-link :to="getGalleryViewLink(internalItem.index)">{{item.name}}</router-link>
                        </div>
                    </td>
                </template>
                <template v-slot:item.creationTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.creationTime)}}
                        </div>
                    </td>
                </template>

            </v-data-table>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onMounted } from "vue";
    import * as groupService from "@/services/api-services/groupService";
    import { VDataTable } from "vuetify/labs/VDataTable";
    import { useAppBarStore } from "@/store/app";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils";
    import router from "@/router";

    //stores
    const appBarStore = useAppBarStore();

    //table
    const groups = ref<Group[]>();
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Exam", key: "exam.name"},
        {title: "Name", key: "name"},
        {title: "Description", key: "description"},
        {title: "Start-Time", key: "creationTime"},
    ]);

    onBeforeMount(async () => {
        appBarStore.title = "Active SEB Groups"
        groups.value = await groupService.getGroups({pageSize: 500});

        console.log(groups.value)
    });

    onMounted(() => {
        //sort by start-time desc
        sortTable(3);
        sortTable(3);
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