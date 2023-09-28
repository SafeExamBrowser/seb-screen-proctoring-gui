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

        <template v-slot:item.timestamp="{item}">
            <td>
                <div>
                    {{timeUtils.formatTimestmapToTime(item.columns.timestamp)}}
                </div>
            </td>
        </template>

        <template v-slot:item.groupName="{item}">
            <td>
                <div>
                    {{item.columns.groupName}} ({{ item.raw.timelineScreenshotDataList.length }})
                </div>
            </td>
        </template>

        <template v-slot:item.proctoringViewLink="{item}">
            <v-btn @click="openProctoringView(timelineSearchResult.sessionUUID, item.columns.timestamp)" variant="text" icon="mdi-video"></v-btn>
        </template>
        <!-------------------------------->


        <!------------content------------>
        <template v-slot:item.data-table-expand="{item, isExpanded, toggleExpand}">
            <v-icon 
                v-if="item.raw.timelineScreenshotDataList.length > 1"
                tabindex="0" 
                variant="text" 
                @click="toggleExpand(item)"
                :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
            </v-icon>
        </template>

        <template v-slot:expanded-row="{ columns, item, index }">
            <tr>
                <td :colspan="columns.length">
                    <SearchScreenshotsList :session-uuid="timelineSearchResult.sessionUUID" :timeline-screenshot-data-list="item.raw.timelineScreenshotDataList" ></SearchScreenshotsList>
                </td>
            </tr>
        </template>
        <!-------------------------------->

    </v-data-table>
</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils";
    import { VDataTable } from "vuetify/labs/VDataTable";
    import SearchScreenshotsList from "./SearchScreenshotsList.vue";
    import router from "@/router";


    const props = defineProps<{
        timelineSearchResult: SearchTimeline
    }>();

    const timelineSearchResult = ref<SearchTimeline>();

    //table
    const expandedItems = ref<string[]>([]);
    const screenshotTableHeadersRef = ref<any[]>();
    const screenshotTableHeaders = ref([
        {title: "Capture-Time", key: "timestamp", value: "timelineScreenshotDataList[0].timestamp"},
        {title: "Application / Website", key: "groupName"},
        {title: "Activity Details", key: "activityDetails", value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataUserAction"},
        {title: "Video", key: "proctoringViewLink"}
    ]);

    onBeforeMount(() => {
        timelineSearchResult.value = props.timelineSearchResult;
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

    function openProctoringView(sessionId: string, timestamp?: string){
        const url: string = "/recording/" + sessionId + "?searchTimestamp=" + timestamp;
        //@ts-ignore
        window.open("", "_blank").location.href = router.resolve(url).href;
    }


</script>

<style scoped>
    /* ::v-deep v-data-table__expanded {
        border-bottom: none !important;
    } */

    .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td, .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
        /* border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity)); */
        border-bottom: none !important;

    }
</style>
