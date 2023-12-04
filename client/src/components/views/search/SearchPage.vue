<template>

    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg"
                title="Search">

                <SearchForm @searchSessions="searchSessions"></SearchForm>
                
            </v-sheet>
        </v-col>
    </v-row>

    <v-row v-if="searchResultAvailable">
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                title="Search results">

                    <!------------title and buttons------------->
                    <v-row>
                        <v-col align="left" class="text-h6">
                            Search Results
                        </v-col>

                        <v-col align="right" class="mb-2">
                            <v-btn 
                                rounded="sm" 
                                color="black" 
                                variant="outlined" 
                                icon="mdi-arrow-collapse-vertical"
                                :disabled=closeAllPanelsDisabled
                                @click="closeAllPanels()">
                            </v-btn>
                            <v-btn 
                                rounded="sm" 
                                color="primary" 
                                variant="flat" 
                                icon="mdi-arrow-expand-vertical"
                                class="ml-2"
                                :disabled=openeAllPanelsDisabled
                                @click="openAllPanels()">
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!----------------------------------->

                    <!-- <v-expansion-panels v-model="sessionPanels" variant="popout" multiple> -->
                    <v-expansion-panels v-model="sessionPanels" multiple>
                        <v-expansion-panel
                            v-for="session in sessionsGrouped?.content"
                            :key="session.day"
                            :value="'sessionPanel' + session.day">

                            <v-expansion-panel-title class="font-weight-bold">
                                {{ session.day }}
                            </v-expansion-panel-title>
                            
                            <v-expansion-panel-text>
                                <SearchSessionTable 
                                    :sessions="session.sessions" 
                                    :metaData="{
                                        screenProctoringMetadataWindowTitle: metadataSearchWindowTitle!, 
                                        screenProctoringMetadataUserAction: metadataSearchAction!
                                    }">
                                </SearchSessionTable>
                            </v-expansion-panel-text>

                        </v-expansion-panel>
                    </v-expansion-panels>

            </v-sheet>
        </v-col>
    </v-row>
            
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
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import SearchForm from "./SearchForm.vue";
    import SearchSessionTable from "./SearchSessionTable.vue";
    import * as groupingUtils from "@/utils/groupingUtils";

    //reactive variables
    const searchResultAvailable = ref<boolean>(false);
    const sessionSearchResults = ref<SearchSessions>();
    const sessionsGrouped = ref<SessionsGrouped>();

    const searchParameters = ref<OptionalParSearchSessions>();

    const sessionPanels = ref<string[]>([]);
    const closeAllPanelsDisabled = ref<boolean>(true);
    const openeAllPanelsDisabled = ref<boolean>(false);

    const errorAvailable = ref<boolean>();

    //remaining
    const appBarStore = useAppBarStore();

    let examNameSearch: string | null;
    let groupNameSearch: string | null;
    let metadataSearchUrl: string | null;
    let metadataSearchWindowTitle: string | null;
    let metadataSearchAction: string | null;
    let loginNameSearch: string | null;
    let machineNameSearch: string | null;

    //store
    const loadingStore = useLoadingStore();


    onBeforeMount(async () => {
        appBarStore.title = "Search"
    });

    watch(sessionPanels, () => {
        if(sessionPanels.value.length == 0){
            closeAllPanelsDisabled.value = true;
            openeAllPanelsDisabled.value = false;
            return;
        }

        if(sessionPanels.value.length == sessionsGrouped.value?.content.length){
            closeAllPanelsDisabled.value = false;
            openeAllPanelsDisabled.value = true;
            return;
        }

        closeAllPanelsDisabled.value = false;
        openeAllPanelsDisabled.value = false;
    });

    async function searchSessions(
        examName: string,
        groupName: string, 
        loginName: string, 
        machineName: string, 
        metadataUrl: string, 
        metadataWindowTitle: string, 
        metadataUserAction: string, 
        fromTime: string, 
        toTime: string,
        pageNumber: number
    ){

        //todo: fold all rows on new search
        errorAvailable.value = false;

        examNameSearch = examName == "" ? null : examName;
        groupNameSearch = groupName == "" ? null : groupName;
        metadataSearchUrl = metadataUrl == "" ? null : metadataUrl;
        metadataSearchUrl = metadataUrl == "" ? null : metadataUrl;
        metadataSearchWindowTitle = metadataWindowTitle == "" ? null : metadataWindowTitle;
        metadataSearchAction = metadataUserAction == "" ? null : metadataUserAction;
        loginNameSearch = loginName == "" ? null : loginName;
        machineNameSearch = machineName == "" ? null : machineName;

        searchParameters.value = {   
            examName: examNameSearch,
            groupName: groupNameSearch,
            clientName: loginNameSearch,
            clientMachineName: machineNameSearch,
            screenProctoringMetadataURL: metadataSearchUrl,
            screenProctoringMetadataWindowTitle: metadataSearchWindowTitle,
            screenProctoringMetadataUserAction: metadataSearchAction,
            fromTime: fromTime, 
            toTime: toTime,
            pageSize: 500,
            pageNumber: pageNumber
        }

        const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions(searchParameters.value);
        
        if(sessionSearchResponse == null){
            errorAvailable.value = true;
            return;
        }

        sessionSearchResults.value = sessionSearchResponse;

        await assignSessions();
    }

    async function assignSessions(){
        if(sessionSearchResults.value == null){ 
            return;
        }

        if(sessionSearchResults.value.numberOfPages > 1 && sessionSearchResults.value.pageNumber != sessionSearchResults.value.numberOfPages){
            if(searchParameters.value != null && searchParameters.value.pageNumber != null){
                searchParameters.value.pageNumber += 1;
            }

            const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions(searchParameters.value);

            if(sessionSearchResponse == null){
                errorAvailable.value = true;
                return;
            }

            sessionSearchResults.value.content.push(...sessionSearchResponse.content);
            sessionSearchResults.value.pageNumber += 1;

            await assignSessions();
        }

        sessionsGrouped.value = groupingUtils.groupSessionsByDay(sessionSearchResults.value);
        searchResultAvailable.value = true;
    }

    function closeAllPanels(){
        sessionPanels.value = [];
    }

    function openAllPanels(){
        sessionPanels.value = sessionsGrouped.value?.content.map((item) => "sessionPanel" + item.day)!;
    }

</script>