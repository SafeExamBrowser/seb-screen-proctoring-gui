<template>
    <!-- <v-tabs v-model="temp" bg-color="primary" grow>
        <v-tab v-for="item in screenshotTableTabsItems" :key="item" :value="item">
            {{ item }}
        </v-tab>
    </v-tabs> -->

    <!-- <v-window v-model="temp">

        <v-window-item value="Timeline"> -->

            <!-- @vue-ignore -->
            <!--:group-by="groupTest"-->
            
            <v-data-table
                show-expand
                item-value="timelineScreenshotDataList[0].timestamp"
                class="elevation-1"
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
                                class="mr-2 cursor-pointer" 
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
                        tabindex="0" 
                        variant="text" 
                        @click="toggleExpand(item)"
                        :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
                    </v-icon>
                </template>

                <template v-slot:expanded-row="{ columns, item, index }">
                    <tr>
                        <td :colspan="columns.length">

                            <!-- <v-row>
                                <v-col class="font-weight-bold">
                                    Time
                                </v-col>
                            </v-row> -->
                            <!-- {{ tempPrintResults(item.raw.timelineScreenshotDataList) }} -->
                            <!-- <v-row v-for="screenshot in item.raw.timelineScreenshotDataList" :key="screenshot">
                                <v-col>
                                    {{timeUtils.formatTimestmapToTime(screenshot.timestamp)}}
                                </v-col>
                                <v-col>
                                    {{ screenshot.metaData.screenProctoringMetadataUserAction }}
                                </v-col>
                            </v-row> -->



                            <v-row v-for="screenshot in searchViewService.groupScreenshotsByMetadata(item.raw.timelineScreenshotDataList)">
                                <v-col>
                                    {{ timeUtils.formatTimestmapToTime(screenshot.timelineScreenshotDataList[0].timestamp)}}
                                </v-col>
                                <v-col>
                                    {{ screenshot.groupName }} ({{ screenshot.timelineScreenshotDataList.length }})
                                </v-col>
                            </v-row>

                        </td>
                    </tr>
                </template>
                <!-------------------------------->

            </v-data-table>
        <!-- </v-window-item>

        <v-window-item value="Summary">

            <h1>summary</h1>

        </v-window-item>

    </v-window> -->
</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils";
    import { VDataTable } from "vuetify/labs/VDataTable"
    import router from "@/router";
    import * as searchViewService from "@/services/component-services/searchViewService";


    const props = defineProps<{
        timelineSearchResult: SearchTimeline
    }>();

    const timelineSearchResult = ref<SearchTimeline>();

    console.log(props.timelineSearchResult)

    //table
    const expandedItems = ref<string[]>([]);
    const screenshotTableHeadersRef = ref<any[]>();
    const screenshotTableHeaders = ref([
        {title: "Start-Time", key: "timestamp", value: "timelineScreenshotDataList[0].timestamp"},
        {title: "Application / Website", key: "groupName"},
        {title: "", key: "proctoringViewLink"}
    ]);

    onBeforeMount(() => {
        timelineSearchResult.value = props.timelineSearchResult;


        // console.log(searchViewService.groupScreenshotsByMetadata(timelineSearchResult.value.timelineGroupDataList[0].timelineScreenshotDataList))

        // for(var i = 0; i < timelineSearchResult.value.timelineGroupDataList.length; i++){
        //     console.log(searchViewService.groupScreenshotsByMetadata(timelineSearchResult.value.timelineGroupDataList[i].timelineScreenshotDataList))
        // }



    });

    function tempPrintResults(timelineScreenshotDataList: [ScreenshotGroupList]): string{

        console.log(searchViewService.groupScreenshotsByMetadata(timelineScreenshotDataList))



        return "temp"
    }

    watch(timelineSearchResult, (newList) => {
        if(newList == null){
            return;
        }

        expandedItems.value = newList?.timelineGroupDataList.map(item => item.timelineScreenshotDataList[0].timestamp.toString());
    });



    // const screenshotTableHeaders = ref([
    //     {title: "Time", key: "timestamp"},
    //     {title: "URL", key: "metaData.screenProctoringMetadataURL"},
    //     {title: "Window Title", key: "metaData.screenProctoringMetadataWindowTitle"},
    //     {title: "User-Action", key: "metaData.screenProctoringMetadataUserAction"},
    //     {title: "Video", key: "proctoringViewLink"},
    // ]);

    // const screenshotTableTabsRefs = reactive<{index: string, tabs: any[]}[]>([]);
    // const temp = ref();
    // const screenshotTableTabsItems: string[] = [
    //     "Timeline",
    //     "Summary"
    // ];




    function openProctoringView(sessionId: string, timestamp?: string){
        const url: string = "/recording/" + sessionId + "?searchTimestamp=" + timestamp;
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
        if(screenshotTableHeadersRef.value != null){
            screenshotTableHeadersRef.value[key].click();
        }
    }


</script>