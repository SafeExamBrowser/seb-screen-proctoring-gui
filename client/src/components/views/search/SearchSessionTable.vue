<template>

    <v-data-table
        show-expand
        item-value="sessionUUID" 
        class="elevation-1"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(sessions)" 
        :items-per-page-options="tableUtils.calcItemsPerPage(sessions)"
        :headers="[
            {title: $t('searchSessionTable.startTime'), key: 'startTime', width: '10%'},
            {title: $t('searchSessionTable.loginName'), key: 'clientName', width: '30%'},
            {title: $t('searchSessionTable.machineName'), key: 'clientMachineName', width: '20%'},
            {title: $t('searchSessionTable.groupName'), key: 'groupName', width: '20%'},
            {title: $t('searchSessionTable.examName'), key: 'exam.name', width: '20%'},
            {title: $t('searchSessionTable.slides'), key: 'nrOfScreenshots'},
            {title: $t('searchSessionTable.video'), key: 'proctoringViewLink'},
        ]"
        :items="sessions">

        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <CustomTableHeader
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="sessionTableHeadersRef">
            </CustomTableHeader>
        </template>

        <template v-slot:item.startTime="{item}">
            <td>
                <div>
                    {{timeUtils.formatTimestmapToTime(item.startTime)}}
                </div>
            </td>
        </template>

        <template v-slot:item.proctoringViewLink="{item}">
            <v-btn @click="searchViewService.openProctoringView(item.sessionUUID)" variant="text" icon="mdi-video"></v-btn>
        </template>

        <template v-slot:item.data-table-expand="{internalItem, isExpanded, toggleExpand}">
            <v-icon 
                tabindex="0" 
                variant="text" 
                @keydown.native.enter="searchTimeline(internalItem, isExpanded, toggleExpand)"
                @keydown.native.space="searchTimeline(internalItem, isExpanded, toggleExpand)"
                @click="searchTimeline(internalItem, isExpanded, toggleExpand)"
                :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
            </v-icon>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
            <tr>
                <td :colspan="columns.length">
                    <!--@vue-ignore-->
                    <SearchScreenshotsTable :timelineSearchResult="timelineSearchResults.find(i => i.sessionUUID == item.sessionUUID)"></SearchScreenshotsTable>
                </td>
            </tr>
        </template>

    </v-data-table>
</template>


<script setup lang="ts">
    import { ref } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils"
    import SearchScreenshotsTable from "./SearchScreenshotsTable.vue";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import CustomTableHeader from "@/utils/table/CustomTableHeader.vue";

    //props
    const props = defineProps<{
        sessions: Session[],
        metaData: MetaData
    }>();

    //reactive variables
    const timelineSearchResults = ref<SearchTimeline[]>([]);

    //table
    const sessionTableHeadersRef = ref<any[]>();
    // const sessionTableHeaders = ref([
    //     {title: "Start-Time", key: "startTime", width: "10%"},
    //     {title: "Login Name", key: "clientName", width: "30%"},
    //     {title: "Machine Name", key: "clientMachineName", width: "20%"},
    //     {title: "Group Name", key: "groupName", width: "20%"},
    //     {title: "Exam Name", key: "exam.name", width: "20%"},
    //     {title: "Slides", key: "nrOfScreenshots"},
    //     {title: "Video", key: "proctoringViewLink"},
    // ]);                 


    async function searchTimeline(item: any, isExpanded: Function, toggleExpand: Function){

        if(removeTableItemFromRefs(item, isExpanded, toggleExpand)){
            return;
        }

        const timelineSearchResponse: SearchTimeline | null = await searchViewService.searchTimeline(item.raw.sessionUUID, {screenProctoringMetadataWindowTitle: props.metaData.screenProctoringMetadataWindowTitle, screenProctoringMetadataUserAction: props.metaData.screenProctoringMetadataUserAction});

        if(timelineSearchResponse == null){
            return;
        }

        addTableItemToRefs(timelineSearchResponse, toggleExpand, item);
    }


    function addTableItemToRefs(timelineSearchResponse: SearchTimeline, toggleExpand: Function, item: any){
        timelineSearchResults.value.push(timelineSearchResponse);
        toggleExpand(item);
    }


    function removeTableItemFromRefs(item: any, isExpanded: Function, toggleExpand: Function): boolean{
        
        if(isExpanded(item)){
            toggleExpand(item);
            const index: number = timelineSearchResults.value.findIndex(i => i.sessionUUID == item.sessionUUID);

            if (index !== -1) {
                timelineSearchResults.value.splice(index, 1);
            }
            return true;
        }

        return false;

    }


</script>