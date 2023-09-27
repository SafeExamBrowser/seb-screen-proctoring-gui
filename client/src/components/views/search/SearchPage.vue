<template>

    <div class="search-parent-container">
        <SearchForm @searchSessions="searchSessions"></SearchForm>
    </div>

    <div v-if="searchResultAvailable" class="search-result-parent-container">
        <v-sheet 
            elevation="4"
            class="search-result-container rounded-lg"
            title="Search results">

            <!-- <v-row>

            </v-row> -->


            <v-expansion-panels variant="inset" multiple>
                <v-expansion-panel
                    v-for="session in sessionsGrouped?.content"
                    :key="session.day"
                    :title="session.day">
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
    import { ref, onBeforeMount, watch, computed, reactive } from "vue";
    import { useAppBarStore, useLoadingStore } from "@/store/app";
    import * as searchViewService from "@/services/component-services/searchViewService";
    import router from "@/router";
    import SearchForm from "./SearchForm.vue";
    import SearchSessionTable from "./SearchSessionTable.vue";



    //reactive variables
    const searchResultAvailable = ref<boolean>(false);
    const sessionSearchResults = ref<SearchSessions>();
    const sessionsGrouped = ref<SessionsGrouped>();

    const errorAvailable = ref<boolean>();

    //remaining
    const appBarStore = useAppBarStore();

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
        sessionsGrouped.value = searchViewService.groupSessionsByDay(sessionSearchResults.value);

        searchResultAvailable.value = true;


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