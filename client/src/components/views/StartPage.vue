<template>
    <v-row>
        <v-col>

            <v-data-table
                item-value="item.name"
                class="rounded-lg elevation-4"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(groups)"
                :items-per-page-options="tableUtils.calcItemsPerPage(groups)"
                :headers="headers"
                :items="groups">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <CustomTableHeader
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="headerRefs">
                    </CustomTableHeader>
                </template>

                <template v-slot:item.name="{item, index, internalItem}">
                    <td>
                        <div 
                            role="button"
                            tabindex="0"
                            @keydown="tableUtils.handleTabKeyEvent($event, 'navigate', internalItem.index, {path: getGalleryViewLink(internalItem.index)})">
                            <router-link class="default-color" :to="getGalleryViewLink(internalItem.index)">{{item.name}}</router-link>
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

        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onMounted } from "vue";
    import * as groupService from "@/services/api-services/groupService";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import CustomTableHeader from "@/utils/table/CustomTableHeader.vue";


    //stores
    const appBarStore = useAppBarStore();
    const loadingStore = useLoadingStore();

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
    });

    function getGalleryViewLink(index: number) {
        if(groups.value != null){
            return "/galleryView/" + groups.value[index].uuid;
        }

        return "";
    }

</script>

<style scoped>
    .default-color {
        color: #2196F3;
    }

</style>