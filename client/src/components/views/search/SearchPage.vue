<template>

    <div class="search-parent-container">
        <SearchForm @searchSessions="searchSessions"></SearchForm>
    </div>

    <div v-if="searchResultAvailable" class="search-result-parent-container">
        <v-sheet 
            elevation="4"
            class="search-result-container rounded-lg"
            title="Search results">

            <!------------session table------------->
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
                        @click="searchScreenshots(item, isExpanded, toggleExpand)"
                        :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
                    </v-icon>
                </template>

                <template v-slot:expanded-row="{ columns, item }">
                    <tr>
                        <td :colspan="columns.length">
                              <!-- @vue-ignore -->
                            <SearchScreenshotsTable :screenshotSearchResult="screenshotSearchResults.find(i => i.content[0].sessionUUID == item.raw.sessionUUID)"></SearchScreenshotsTable>
                        </td>
                    </tr>
                </template>

            </v-data-table>
            <!----------------------------------->
        </v-sheet>
    </div>

    <AlertMsg 
        v-if="errorAvailable"
        :alertProps="{
            color: 'error',
            type: 'snackbar',
            textKey: 'api-error'
        }">
    </AlertMsg>

</template>


<script setup lang="ts">
    import { ref, onBeforeMount, watch, computed, reactive } from "vue";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import router from "@/router";
    import { VDataTable } from "vuetify/labs/VDataTable"
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/tableUtils";
    import SearchForm from "./SearchForm.vue";
    import SearchScreenshotsTable from "./SearchScreenshotsTable.vue"


    //reactive variables
    const searchResultAvailable = ref<boolean>(false);
    const sessionSearchResults = ref<SearchSessions>();
    const screenshotSearchResults = ref<SearchScreenshots[]>([]);
    const screenshotSearchResult = ref<SearchScreenshots>();
    const errorAvailable = ref<boolean>();

    //remaining
    const appBarStore = useAppBarStore();

    let metadataSearchUrl: string | null;
    let metadataSearchWindowTitle: string | null;
    let metadataSearchAction: string | null;
    let loginNameSearch: string | null;
    let machineNameSearch: string | null;

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

    //store
    const loadingStore = useLoadingStore();


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
        errorAvailable.value = false;

        metadataSearchUrl = metadataUrl == "" ? null : metadataUrl;
        metadataSearchWindowTitle = metadataWindowTitle == "" ? null : metadataWindowTitle;
        metadataSearchAction = metadataUserAction == "" ? null : metadataUserAction;
        loginNameSearch = loginName == "" ? null : loginName;
        machineNameSearch = machineName == "" ? null : machineName;

        console.log("in search page loginNameSearch: " + loginNameSearch)
        console.log("in search page machineNameSearch: " + machineNameSearch)

        const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions(
            {   
                //todo: add exam name
                groupName: groupName,
                clientName: loginNameSearch,
                clientMachineName: machineNameSearch,
                screenProctoringMetadataURL: metadataSearchUrl,
                screenProctoringMetadataWindowTitle: metadataSearchWindowTitle,
                screenProctoringMetadataUserAction: metadataSearchAction,
                fromTime: fromTime, 
                toTime: toTime,
                pageSize: 500
            }
        );
        
        if(sessionSearchResponse == null){
            errorAvailable.value = true;
            return;
        }

        sessionSearchResults.value = sessionSearchResponse;
        searchResultAvailable.value = true;

        // console.log(sessionSearchResults.value)
    }


    async function searchScreenshots(item: any, isExpanded: Function, toggleExpand: Function){

        if(removeTableItemFromRefs(item, isExpanded, toggleExpand)){
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
            return;
        }


        screenshotSearchResult.value = screenshotSearchResponse;
        console.log(screenshotSearchResponse)

        addTableItemToRefs(screenshotSearchResponse, toggleExpand, item);
    }

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
        if(sessionTableHeadersRef.value != null){
            sessionTableHeadersRef.value[key].click();
        }
    }


    function addTableItemToRefs(screenshotSearchResponse: SearchScreenshots, toggleExpand: Function, item: any){
        screenshotSearchResults.value.push(screenshotSearchResponse);
        toggleExpand(item);
    }


    function removeTableItemFromRefs(item: any, isExpanded: Function, toggleExpand: Function): boolean{
        
        if(isExpanded(item)){
            toggleExpand(item);
            const index: number = screenshotSearchResults.value.findIndex(i => i.content[0].sessionUUID == item.raw.sessionUUID);

            if (index !== -1) {
                screenshotSearchResults.value.splice(index, 1);
            }
            return true;
        }

        return false;

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
        width: 80%;
        padding: 20px;
    }

    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>