<template>

    <div class="search-parent-container">
        <SearchForm @searchSessions="searchSessions"></SearchForm>
    </div>

    <div v-if="searchResultAvailable" class="search-result-parent-container">
        <v-sheet 
            elevation="4"
            class="search-result-container rounded-lg"
            title="Search results">

            <v-data-table
                item-value="sessionUUID"
                show-expand
                class="elevation-1"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(sessionSearchResults?.content)" 
                :items-per-page-options="tableUtils.calcItemsPerPage(sessionSearchResults?.content)"
                :headers="sessionTableHeaders"
                :items="sessionSearchResults?.content">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <tr>
                        <template v-for="(column, index) in columns">
                        <td>
                            <span 
                                ref="headerRefsSessions"
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
                        @click="searchScreenshots(item, isExpanded, toggleExpand)"
                        :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
                    </v-icon>
                </template>

                <template v-slot:expanded-row="{ columns, item }">
                    <tr>
                        <td :colspan="columns.length">
                            <v-data-table
                                item-value="sessionUUID"
                                class="elevation-1"
                                theme="tableTheme"
                                :items-per-page="tableUtils.calcDefaultItemsPerPage(screenshotSearchResults.find(i => i.content[0].sessionUUID == item.raw.sessionUUID)?.content)" 
                                :items-per-page-options="tableUtils.calcItemsPerPage(screenshotSearchResults.find(i => i.content[0].sessionUUID == item.raw.sessionUUID)?.content)"
                                :headers="screenshotTableHeaders"
                                :items="screenshotSearchResults.find(i => i.content[0].sessionUUID == item.raw.sessionUUID)?.content">

                                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                                    <tr>
                                        <template v-for="(column, index) in columns">
                                        <td>
                                            <span 
                                                ref="headerRefsScreenshots"
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
                        </td>
                    </tr>
                </template>

            </v-data-table>
        </v-sheet>
    </div>

</template>


<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore } from "@/store/app";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import router from "@/router";
    import { VDataTable } from "vuetify/labs/VDataTable"
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils";
    import SearchForm from "./SearchForm.vue";


    //reactive variables
    const searchResultAvailable = ref<boolean>(false);
    const sessionSearchResults = ref<SearchSessions>();
    const screenshotSearchResults = ref<SearchScreenshots[]>([]);

    //remaining
    const appBarStore = useAppBarStore();

    let metadataSearchUrl: string | null;
    let metadataSearchWindowTitle: string | null;
    let metadataSearchAction: string | null;

    //table
    const headerRefsSessions = ref<any[]>();
    const sessionTableHeaders = ref([
        {title: "Start-Time", key: "startTime"},
        {title: "Login Name", key: "clientName"},
        {title: "Group Name", key: "groupName"},
        {title: "Slides", key: "nrOfScreenshots"},
        {title: "Video", key: "proctoringViewLink"},
    ]);

    const headerRefsScreenshots = ref<any[]>();
    const screenshotTableHeaders = ref([
        {title: "Time", key: "imageTimestamp"},
        {title: "URL", key: "metaData.screenProctoringMetadataURL"},
        {title: "Window Title", key: "metaData.screenProctoringMetadataWindowTitle"},
        {title: "User-Action", key: "metaData.screenProctoringMetadataUserAction"},
        {title: "Video", key: "proctoringViewLink"},
    ]);


    onBeforeMount(async () => {
        try {
            appBarStore.title = "Search"
        } catch (error) {
            console.error(error);
        }
    });

    async function searchSessions(
        groupName: string, 
        loginName: string, 
        machineName: string, 
        metadataUrl: string, 
        metadataWindowTitle: string, 
        metadataUserAction: string, 
        fromTime: string, 
        toTime: string
    ){

        //todo: fold all rows on new search

        metadataSearchUrl = metadataUrl == "" ? null : metadataUrl;
        metadataSearchWindowTitle = metadataWindowTitle == "" ? null : metadataWindowTitle;
        metadataSearchAction = metadataUserAction == "" ? null : metadataUserAction;

        const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions(
            {   
                //todo: add exam name
                groupName: groupName,
                clientName: loginName,
                clientMachineName: machineName,
                screenProctoringMetadataURL: metadataSearchUrl,
                screenProctoringMetadataWindowTitle: metadataSearchWindowTitle,
                screenProctoringMetadataUserAction: metadataSearchAction,
                fromTime: fromTime,
                toTime: toTime,
                pageSize: 500
            }
        );
        
        if(sessionSearchResponse == null){
            //todo: show error to user
            return;
        }

        sessionSearchResults.value = sessionSearchResponse;
        searchResultAvailable.value = true;

        console.log(sessionSearchResults.value)
    }

    async function searchScreenshots(item: any, isExpanded: any, toggleExpand: any){

        if(isExpanded(item)){
            toggleExpand(item);
            const index: number = screenshotSearchResults.value.findIndex(i => i.content[0].sessionUUID == item.raw.sessionUUID);

            if (index !== -1) {
                screenshotSearchResults.value.splice(index, 1);
            }
            return;
        }

        const screenshotSearchResponse: SearchScreenshots | null = await searchViewService.searchScreenshots(
            {
                sessionUUID: item.raw.sessionUUID, 
                screenProctoringMetadataURL: metadataSearchUrl,
                screenProctoringMetadataWindowTitle: metadataSearchWindowTitle,
                screenProctoringMetadataUserAction: metadataSearchAction,
                pageSize: 500
            }
        );

        if(screenshotSearchResponse == null){
            //todo: show error to user
            return null;
        }

        console.log(screenshotSearchResponse)

        screenshotSearchResults.value.push(screenshotSearchResponse);
        toggleExpand(item);
    }

    function openProctoringView(sessionId: string, timestamp?: string){
        if(!timestamp){

            // router.push({
            //     path: "/recording/" + sessionId,
            // });
            
            const url: string = "/recording/" + sessionId;
            //@ts-ignore
            window.open("", "_blank").location.href = router.resolve(url).href;

            return;
        }

        //recording/b11bf31d-12f1-49a0-a160-6f229115d7fd?searchTimestamp=1692861314291

        const url: string = "/recording/" + sessionId + "?searchTimestamp=" + timestamp;
        //@ts-ignore
        window.open("", "_blank").location.href = router.resolve(url).href;

        // router.push({
        //     name: "ProctoringViewPage",
        //     params: {
        //         sessionId: sessionId
        //     },
        //     query: {
        //         searchTimestamp: timestamp
        //     }
        // });
    }

    function handleTabKeyEvent(event: any, action: string, index: number, key: number){
        if (event.key == 'Enter' || event.key == ' ') {
            if(action == "sort"){
                sortTable(key)
            }
        }
    }

    function sortTable(key: number){
        if(headerRefsSessions.value != null){
            headerRefsSessions.value[key].click();
        }

        if(headerRefsScreenshots.value != null){
            headerRefsScreenshots.value[key].click();
        }
    }

</script>

<style scoped>

    .search-parent-container, .search-result-parent-container{
        display: flex;
        justify-content: center;
        align-items: center; 
    }

    .search-result-parent-container{
        margin-top: 20px;
    }

    .search-container, .search-result-container{
        width: 70%;
        padding: 20px;
    }

    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>