<template>

    <div class="search-parent-container">
        <v-sheet 
            elevation="4"
            class="search-container"
            title="Search">
            <v-form>
                <div class="form-container">
                    <!------------Group Name------------->
                    <v-row class="fill-height" align="center">
                        <v-col cols="4">
                            Group Name:
                        </v-col>
                        <v-col cols="8">
                            <v-text-field
                                density="compact"
                                variant="solo"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <!----------------------------------->


                    <!------------Login Name------------->
                    <v-row class="fill-height" align="center">
                        <v-col cols="4">
                            Login Name:
                        </v-col>
                        <v-col cols="8">
                            <v-text-field
                                density="compact"
                                variant="solo"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <!----------------------------------->


                    <!------------Time Period------------->
                        <v-row class="fill-height" align="center">
                            <v-col cols="4">
                                Period:
                            </v-col>
                            <v-col cols="1">
                                <v-radio value="1"></v-radio>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field
                                    density="compact"
                                    variant="solo"
                                    single-line
                                    hide-details> 
                                </v-text-field> 
                            </v-col>
                            <v-col cols="5">
                                <v-select
                                    hide-details
                                    label="Select"
                                    variant="outlined"
                                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']">
                                </v-select>
                            </v-col>
                        </v-row>
                        <!----------------------------------->


                        <!------------Time Selection------------->
                        <v-row class="fill-height" align="center">
                            <v-col cols="4">
                                Between:
                            </v-col>
                            <v-col cols="1">
                                <v-radio 
                                    value="2">
                                </v-radio>
                            </v-col>
                            <v-col cols="7">
                                <VueDatePicker v-model="date" range :teleport="true"></VueDatePicker>
                            </v-col>
                        </v-row>
                    <!----------------------------------->


                    <!------------Buttons------------->
                    <v-row>
                        <v-col align="right">
                            <v-btn rounded="sm" color="black" variant="outlined">
                                Cancel
                            </v-btn>

                            <v-btn 
                                rounded="sm" 
                                color="primary" 
                                variant="flat" 
                                class="ml-2"
                                @click="searchSessions()">
                                Search
                            </v-btn>

                        </v-col>
                    </v-row>
                    <!----------------------------------->
                </div>
            </v-form>
        </v-sheet>
    </div>

    <div v-if="searchResultAvailable" class="search-result-parent-container">
        <v-sheet 
            elevation="4"
            class="search-result-container"
            title="Search results">

            <v-data-table
                item-value="sessionUUID"
                show-expand
                class="elevation-1"
                :headers="sessionTableHeaders"
                :items="sessionSearchResults?.content">

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
                                :headers="screenshotTableHeaders"
                                :items="screenshotSearchResults.find(i => i.content[0].sessionUUID == item.raw.sessionUUID)?.content">

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
    import { ref, onBeforeMount, computed } from "vue";
    import { useAppBarStore } from "@/store/app";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import * as searchViewService from "@/services/component-services/searchViewService";
    import router from "@/router";
    import { VDataTable } from "vuetify/labs/VDataTable"
    import * as timeUtils from "@/utils/timeUtils";


    //form fields
    const searchString = ref<string>();
    const date = ref();

    //reactive variables
    const searchResultAvailable = ref<boolean>(false);
    const sessionSearchResults = ref<SearchSessions>();
    const screenshotSearchResults = ref<SearchScreenshots[]>([]);

    //remaining
    const appBarStore = useAppBarStore();

    //table
    const sessionTableHeaders = ref([
        {title: "Start-Time", key: "startTime"},
        {title: "Login Name", key: "clientName"},
        {title: "Group Name", key: "groupName"},
        {title: "Slides", key: "nrOfScreenshots"},
        {title: "Video", key: "proctoringViewLink"},
    ]);

    const screenshotTableHeaders = ref([
        {title: "Time", key: "imageTimestamp"},
        {title: "User-Action", key: "metaData.screenProctoringMetadataUserAction"},
        {title: "URL", key: "metaData.screenProctoringMetadataURL"},
        {title: "Video", key: "proctoringViewLink"},
    ]);


    onBeforeMount(async () => {
        try {
            appBarStore.title = "Search"
            await searchSessions();

        } catch (error) {
            console.error(error);
        }
    });

    async function searchSessions(){
        console.log("search string: " + searchString.value)
        console.log("date: " + date.value)

        const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions({pageSize: 20});
        if(sessionSearchResponse == null){
            //todo: show error to user
            return;
        }

        sessionSearchResults.value = sessionSearchResponse;
        searchResultAvailable.value = true;
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

        const screenshotSearchResponse: SearchScreenshots | null = await searchViewService.searchScreenshots({sessionUUID: item.raw.sessionUUID, pageSize: 500});
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
            router.push({
                path: "/recording/" + sessionId,
            });

            return;
        }

        router.push({
            name: "ProctoringViewPage",
            params: {
                sessionId: sessionId
            },
            query: {
                searchTimestamp: timestamp
            }
        });
    }




</script>

<style>

    .search-parent-container, .search-result-parent-container{
        display: flex;
        justify-content: center;
        align-items: center; 
    }

    .search-result-parent-container{
        margin-top: 20px;
    }

    .search-container, .search-result-container{
        width: 60%;
        padding: 20px;
        /* display: flex;
        justify-content: center;
        align-items: center;  */
    }

    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>