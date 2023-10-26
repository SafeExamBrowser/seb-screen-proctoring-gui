<template>
    <div class="text-h6 my-7">
        Screenshots
    </div>

    <v-data-table
        show-expand
        item-value="timelineScreenshotDataList[0].timestamp"
        class="elevation-5 mb-7"
        theme="tableTheme"
        :expanded="expandedItems"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(timelineSearchResult?.timelineGroupDataList)" 
        :items-per-page-options="tableUtils.calcItemsPerPage(timelineSearchResult?.timelineGroupDataList)"
        :headers="screenshotTableHeaders" 
        :items="timelineSearchResult?.timelineGroupDataList">

        <!------------headers------------>
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
                <template v-for="(column, index) in columns">
                    <td>
                        <span 
                            ref="screenshotTableHeadersRef"
                            tabindex="0" 
                            class="mr-2 cursor-pointer font-weight-bold" 
                            role="button" 
                            @keydown="handleTabKeyEvent($event, 'sort', 0, index)" 
                            @click="() => toggleSort(column)">
                            {{ column.title }}
                        </span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>
                    </td>
                </template>
            </tr>
        </template>

        <template v-slot:item.timestamp="{internalItem}">
            <td>
                <div>
                    {{timeUtils.formatTimestmapToTime(internalItem.columns.timestamp)}}
                </div>
            </td>
        </template>

        <template v-slot:item.groupName="{item}">
            <td>
                <div>
                    {{item.groupName}} ({{ item.timelineScreenshotDataList.length }})
                </div>
            </td>
        </template>

        <template v-slot:item.proctoringViewLink="{item}">
            <v-btn 
                @click="searchViewService.openProctoringView(timelineSearchResult.sessionUUID, item.timestamp)" 
                variant="text" 
                icon="mdi-video">
            </v-btn>
        </template>
        <!-------------------------------->


        <!------------content------------>
        <template v-slot:item.data-table-expand="{internalItem, item, isExpanded, toggleExpand}">
            <v-icon 
                v-if="item.timelineScreenshotDataList.length > 1"
                tabindex="0" 
                variant="text" 
                @click="toggleExpand(internalItem)"
                :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
            </v-icon>
        </template>

        <template v-slot:expanded-row="{ columns, item, index }">

            <template v-for="screenshot in groupingUtils.groupScreenshotsByMetadata(item.timelineScreenshotDataList, true)!">
                <tr>
                    <td>
                        {{ timeUtils.formatTimestmapToTime(screenshot.timelineScreenshotDataList[0].timestamp)}}
                    </td>

                    <td>
                    </td>

                    <td>
                        {{ screenshot.groupName }} ({{ screenshot.timelineScreenshotDataList.length }})
                    </td>

                    <td>
                        <v-btn 
                            @click="searchViewService.openProctoringView(timelineSearchResult.sessionUUID, screenshot.timelineScreenshotDataList[0].timestamp.toString())" 
                            variant="text" 
                            icon="mdi-video">
                        </v-btn>
                    </td>

                    <td>
                    </td>
                </tr>

            </template>
            <tr class="last-border"></tr>

        </template>
        <!-------------------------------->

    </v-data-table>
</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import { VDataTable } from "vuetify/labs/VDataTable";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import * as groupingUtils from "@/utils/groupingUtils";


    const props = defineProps<{
        timelineSearchResult: SearchTimeline
    }>();

    const timelineSearchResult = ref<SearchTimeline>();

    //table
    const expandedItems = ref<string[]>([]);
    const screenshotTableHeadersRef = ref<any[]>();
    const screenshotTableHeaders = ref([
        {title: "Capture-Time", key: "timestamp", value: "timelineScreenshotDataList[0].timestamp", width: "10%"},
        {title: "Application / Website", key: "groupName", width: "20%"},
        {title: "Activity Details", key: "activityDetails", value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataUserAction"},
        {title: "Video", key: "proctoringViewLink", width: "1%"},
        {title: "", key: "data-table-expand"}
    ]);

    onBeforeMount(() => {
        timelineSearchResult.value = props.timelineSearchResult;

        // console.log(timelineSearchResult)
    });

    watch(timelineSearchResult, (newList) => {
        if(newList == null){
            return;
        }

        expandedItems.value = newList?.timelineGroupDataList.map(item => item.timelineScreenshotDataList[0].timestamp.toString());
    });


    function handleTabKeyEvent(event: any, action: string, index: number, key: number){
        if (event.key == 'Enter' || event.key == ' ') {
            if(action == "sort"){
                sortTable(key)
            }
        }
    }

    function sortTable(key: number){
        if(screenshotTableHeadersRef.value != null){
            screenshotTableHeadersRef.value[key].click();
        }
    }
</script>

<style scoped>
    /* .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td, .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
        border-bottom: none !important;
    } */

    .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td {
        border-bottom: none !important;
    }

    .last-border{
        border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    } 
</style>
@/utils/table/tableUtils