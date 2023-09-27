<template>

    <v-data-table
                show-expand
                item-value="sessionUUID"
                class="elevation-1"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(sessions)" 
                :items-per-page-options="tableUtils.calcItemsPerPage(sessions)"
                :headers="sessionTableHeaders"
                :items="sessions">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <tr>
                        <template v-for="(column, index) in columns">
                        <td>
                            <span 
                                ref="sessionTableHeadersRef"
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

                <template v-slot:item.startTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.columns.startTime)}}
                        </div>
                    </td>
                </template>

                <template v-slot:item.proctoringViewLink="{item}">
                    <v-btn @click="openProctoringView(item.raw.sessionUUID)" variant="text" icon="mdi-video"></v-btn>
                </template>

                <template v-slot:item.data-table-expand="{item, isExpanded, toggleExpand}">
                    <v-icon 
                        tabindex="0" 
                        variant="text" 
                        @click="searchTimeline(item, isExpanded, toggleExpand)"
                        :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
                    </v-icon>
                </template>

                <template v-slot:expanded-row="{ columns, item }">
                    <tr>
                        <td :colspan="columns.length">
                            <!--@vue-ignore-->
                            <SearchScreenshotsTable :timelineSearchResult="timelineSearchResults.find(i => i.sessionUUID == item.raw.sessionUUID)"></SearchScreenshotsTable>
                        </td>
                    </tr>
                </template>

            </v-data-table>



</template>


<script setup lang="ts">
    import { ref, onBeforeMount, watch, computed, reactive } from "vue";
    import { VDataTable } from "vuetify/labs/VDataTable"
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils"
    import SearchScreenshotsTable from "./SearchScreenshotsTable.vue";
    import * as searchViewService from "@/services/component-services/searchViewService";

    //props
    const props = defineProps<{
        sessions: Session[]
    }>();


    //reactive variables
    const timelineSearchResults = ref<SearchTimeline[]>([]);
    const timelineSearchResult = ref<SearchTimeline>();


    //table
    const sessionTableHeadersRef = ref<any[]>();
    const sessionTableHeaders = ref([
        {title: "Start-Time", key: "startTime"},
        {title: "Login Name", key: "clientName"},
        {title: "Machine Name", key: "clientMachineName"},
        {title: "Group Name", key: "groupName"},
        {title: "Slides", key: "nrOfScreenshots"},
        {title: "Video", key: "proctoringViewLink"},
    ]);                 


    async function searchTimeline(item: any, isExpanded: Function, toggleExpand: Function){

        if(removeTableItemFromRefs(item, isExpanded, toggleExpand)){
            return;
        }

        const timelineSearchResponse: SearchTimeline | null = await searchViewService.searchTimeline(item.raw.sessionUUID);
        console.log(timelineSearchResponse?.timelineGroupDataList[0].groupName)

        if(timelineSearchResponse == null){
            return;
        }


        timelineSearchResult.value = timelineSearchResponse;
        console.log(timelineSearchResponse)

        addTableItemToRefs(timelineSearchResponse, toggleExpand, item);
    }


    function openProctoringView(sessionId: string){
        const url: string = "/recording/" + sessionId;
        //@ts-ignore
        window.open("", "_blank").location.href = router.resolve(url).href;
    }

    function handleTabKeyEvent(event: any, action: string, index: number, key: number){
        if (event.key == 'Enter' || event.key == ' ') {
            if(action == "sort"){
                sortTable(key)
            }
        }
    }

    function sortTable(key: number){
        if(sessionTableHeadersRef.value != null){
            sessionTableHeadersRef.value[key].click();
        }
    }


    function addTableItemToRefs(timelineSearchResponse: SearchTimeline, toggleExpand: Function, item: any){
        timelineSearchResults.value.push(timelineSearchResponse);
        toggleExpand(item);
    }


    function removeTableItemFromRefs(item: any, isExpanded: Function, toggleExpand: Function): boolean{
        
        if(isExpanded(item)){
            toggleExpand(item);
            const index: number = timelineSearchResults.value.findIndex(i => i.sessionUUID == item.raw.sessionUUID);

            if (index !== -1) {
                timelineSearchResults.value.splice(index, 1);
            }
            return true;
        }

        return false;

    }


</script>