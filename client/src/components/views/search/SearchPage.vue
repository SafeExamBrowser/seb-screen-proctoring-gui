<template>

    <div class="search-parent-container">
        <SearchForm @searchSessions="searchSessions"></SearchForm>
    </div>

    <div v-if="searchResultAvailable" class="search-result-parent-container">
        <v-sheet 
            elevation="4"
            class="search-result-container rounded-lg"
            title="Search results">

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

            <v-expansion-panels v-model="sessionPanels" multiple>
                <v-expansion-panel
                    v-for="session in sessionsGrouped?.content"
                    :key="session.day"
                    :value="'sessionPanel' + session.day">

                    <v-expansion-panel-title class="font-weight-bold">
                        {{ session.day }}
                    </v-expansion-panel-title>
                    
                    <v-expansion-panel-text>
                        <SearchSessionTable :sessions="session.sessions"></SearchSessionTable>
                    </v-expansion-panel-text>

                </v-expansion-panel>
            </v-expansion-panels>


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
    import { ref, onBeforeMount, watch, computed, reactive, onMounted } from "vue";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import SearchForm from "./SearchForm.vue";
    import SearchSessionTable from "./SearchSessionTable.vue";
import { stringLiteral } from "@babel/types";


    //reactive variables
    const searchResultAvailable = ref<boolean>(false);
    const sessionSearchResults = ref<SearchSessions>();
    const sessionsGrouped = ref<SessionsGrouped>();

    const sessionPanels = ref<string[]>([]);
    const closeAllPanelsDisabled = ref<boolean>(false);
    const openeAllPanelsDisabled = ref<boolean>(true);

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
        try {
            appBarStore.title = "Search"
        } catch (error) {
            console.error(error);
        }
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
        toTime: string
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

        const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions(
            {   
                examName: examNameSearch,
                groupName: groupNameSearch,
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

        console.log(sessionSearchResults.value)

        sessionsGrouped.value = searchViewService.groupSessionsByDay(sessionSearchResults.value);
        openAllPanels()

        searchResultAvailable.value = true;
    }

    function closeAllPanels(){
        sessionPanels.value = [];
    }

    function openAllPanels(){
        sessionPanels.value = sessionsGrouped.value?.content.map((item) => "sessionPanel" + item.day)!;
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