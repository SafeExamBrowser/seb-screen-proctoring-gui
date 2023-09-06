<template>
    <v-tabs v-model="temp" bg-color="primary" grow>
        <v-tab v-for="item in screenshotTableTabsItems" :key="item" :value="item">
            {{ item }}
        </v-tab>
    </v-tabs>

    <v-window v-model="temp">

        <v-window-item value="Timeline">
            <v-data-table
                item-value="sessionUUID"
                class="elevation-1"
                theme="tableTheme"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(screenshotSearchResult?.content)" 
                :items-per-page-options="tableUtils.calcItemsPerPage(screenshotSearchResult?.content)"
                :headers="screenshotTableHeaders"
                :items="screenshotSearchResult?.content">

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
                                @click="() => toggleSort(column)">{{ column.title }}
                            </span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>
                        </td>
                        </template>
                    </tr>
                </template>

                <template v-slot:item.imageTimestamp="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestmapToTime(item.columns.imageTimestamp)}}
                        </div>
                    </td>
                </template>

                <template v-slot:item.proctoringViewLink="{item}">
                    <v-btn @click="openProctoringView(item.raw.sessionUUID, item.raw.imageTimestamp)" variant="text" icon="mdi-video"></v-btn>
                </template>

            </v-data-table>
        </v-window-item>

        <v-window-item value="Summary">

            <h1>summary</h1>

        </v-window-item>

    </v-window>
</template>

<script setup lang="ts">
    import { ref, reactive } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils";
    import { VDataTable } from "vuetify/labs/VDataTable"


    const props = defineProps<{
        screenshotSearchResult: SearchScreenshots
    }>();

    //table
    const screenshotTableHeadersRef = ref<any[]>();
    const screenshotTableHeaders = ref([
        {title: "Time", key: "imageTimestamp"},
        {title: "URL", key: "metaData.screenProctoringMetadataURL"},
        {title: "Window Title", key: "metaData.screenProctoringMetadataWindowTitle"},
        {title: "User-Action", key: "metaData.screenProctoringMetadataUserAction"},
        {title: "Video", key: "proctoringViewLink"},
    ]);

    // const screenshotTableTabsRefs = reactive<{index: string, tabs: any[]}[]>([]);
    const temp = ref();
    const screenshotTableTabsItems: string[] = [
        "Timeline",
        "Summary"
    ];


    function openProctoringView(sessionId: string, timestamp?: string){
        if(!timestamp){
            const url: string = "/recording/" + sessionId;
            //@ts-ignore
            window.open("", "_blank").location.href = router.resolve(url).href;
            return;
        }

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