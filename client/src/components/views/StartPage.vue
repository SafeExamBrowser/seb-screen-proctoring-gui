<template>
    <v-row>
        <v-col>

            <v-data-table
                item-value="item.name"
                class="rounded-lg elevation-4"
                :sort-by="[{key: 'creationTime', order: 'desc'}]"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(groups)"
                :items-per-page-options="tableUtils.calcItemsPerPage(groups)"
                :headers="headers"
                :items="groups">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <CustomTableHeader
                        @addAddtionalExamHeaders="addAddtionalExamHeaders"
                        @removeAddtionalExamHeaders="removeAddtionalExamHeaders"
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

                <template v-slot:item.exam.name="{item}">
                    <td>
                        <div v-if="item.exam.name != '' && item.exam.name != null">
                            <v-chip :color="item.exam.isRunning ? 'green' : 'red'">
                                {{ item.exam.name }}
                            </v-chip>
                        </div>
                    </td>
                </template>

                <template v-slot:item.exam.startTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.exam.startTime)}}
                        </div>
                    </td>
                </template>

                <template v-slot:item.exam.endTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.exam.endTime)}}
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
    import { ref, onBeforeMount, onUnmounted } from "vue";
    import * as groupService from "@/services/api-services/groupService";
    import { useAppBarStore, useTableStore } from "@/store/app";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import CustomTableHeader from "@/utils/table/CustomTableHeader.vue";

    //stores
    const appBarStore = useAppBarStore();
    const tableStore = useTableStore();

    //table
    const groups = ref<Group[]>();
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Exam", key: "exam.name", width: "15%"},
        {title: "Name", key: "name", width: "15%"},
        {title: "Description", key: "description", width: "15%"},
        {title: "Start-Time", key: "creationTime", width: "15%"},
    ]);

    onBeforeMount(async () => {
        appBarStore.title = "Active SEB Groups"
        groups.value = await groupService.getGroups({pageSize: 500});
    });

    onUnmounted(() => {
        tableStore.isExamExpand = false;
    });

    function getGalleryViewLink(index: number) {
        if(groups.value != null){
            return "/galleryView/" + groups.value[index].uuid;
        }

        return "";
    }

    function addAddtionalExamHeaders(){
        tableStore.isExamExpand = true;

        headers.value.splice(1, 0, {title: "Exam Start-Time", key: "exam.startTime", width: "10%"});
        headers.value.splice(2, 0, {title: "Exam End-Time", key: "exam.endTime", width: "10%"});
    }

    function removeAddtionalExamHeaders(){
        tableStore.isExamExpand = false;

        headers.value.splice(1, 2);
    }

</script>

<style scoped>
    .default-color {
        color: #2196F3;
    }

</style>