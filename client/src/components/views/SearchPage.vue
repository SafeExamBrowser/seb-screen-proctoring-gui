<template>

    <div class="search-parent-container">
        <v-card 
            class="search-container"
            title="Search">
            <v-form>
                <v-card-text>

                    <div class="date-time-selection-container">
                        <v-radio-group>
                            <v-row class="fill-height" align="center">
                                <v-col>
                                    <v-radio label="Period:" value="1"></v-radio>
                                </v-col>
                                <v-col>
                                    <VueDatePicker v-model="date" range :teleport="true"></VueDatePicker>
                                </v-col>
                            </v-row>
                            <v-row class="fill-height" align="center">
                                <v-col>
                                    <v-radio label="Between:" value="2"></v-radio>
                                </v-col>
                                <v-col>
                                    <VueDatePicker v-model="date" range :teleport="true"></VueDatePicker>
                                </v-col>
                            </v-row>
                        </v-radio-group>
                    </div>







                    <v-row class="fill-height" align="center">
                        <v-col cols="2">
                            Search for:
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                                density="compact"
                                variant="solo"
                                label="Search templates"
                                single-line
                                hide-details
                            ></v-text-field>

                            <!-- <v-text-field label="Label"></v-text-field> -->

                                <!-- <input v-model="searchString" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"> -->
                        </v-col>

                        <v-col cols="2">
                            <div>
                                Filters:
                            </div>
                        </v-col>
                        <v-col cols="4">
                            <select id="countries" class="border text-sm rounded-lg block w-full p-2.5">
                                <option value="US">Windows Title</option>
                                <option value="DE">Application Name</option>
                                <option value="DE">URL</option>
                            </select>
                        </v-col>
                    </v-row>

                    <!-- <v-row>
                        <v-col>
                            <v-expansion-panels>
                                <v-expansion-panel title="Time filters">
                                    <v-expansion-panel-text>

                                        <v-row class="fill-height" align="center">
                                            <v-col cols="4">
                                                Last:
                                            </v-col>
                                            <v-col cols="4">
                                                <input class="shadow appearance-none border  rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" value="5">
                                            </v-col>

                                            <v-col cols="4">
                                                <select id="countries" class="border text-sm rounded-lg block w-full p-2.5">
                                                    <option value="US">Days</option>
                                                    <option value="DE">Moths</option>
                                                    <option value="DE">Years</option>
                                                </select>
                                            </v-col>
                                        </v-row>

                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>
                    </v-row> -->

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
                                @click="search()">
                                Search
                            </v-btn>

                        </v-col>
                    </v-row>
                </v-card-text>
                
            </v-form>
        </v-card>
    </div>

    <div v-if="searchResultAvailable" class="search-result-parent-container">
        <v-card 
            class="search-result-container"
            title="Search results">

            <v-card-text>
                <v-expansion-panels>

                    <v-expansion-panel v-for="sessionResult in searchResults" :key="sessionResult.sessionId">

                        <template v-slot:title>
                            {{ sessionResult.date }} 
                            |
                            {{ sessionResult.name }} 
                            |
                            {{ sessionResult.group }}
                            |
                            <v-btn @click.stop="openProctoringView(sessionResult.sessionId)" variant="text" icon="mdi-video"></v-btn>
                        </template>


                        <v-expansion-panel-text>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Application</th>
                                        <th>URL</th>
                                        <th>Recording</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="searchResult in sessionResult.results" :key="searchResult.timestamp">
                                        <td>
                                            {{ searchResult.timestamp }}   
                                        </td>
                                        <td>
                                            {{ searchResult.application }}   
                                        </td>
                                        <td>
                                            {{ searchResult.url }}   
                                        </td>
                                        <td>
                                            <v-btn @click="openProctoringView(sessionResult.sessionId, searchResult.timestamp)" variant="text" icon="mdi-video"></v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>

                        </v-expansion-panel-text>

                    </v-expansion-panel>

                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </div>

</template>


<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import { useAppBarStore } from "@/store/app";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import * as searchService from "@/services/api-services/searchService";
    import router from "@/router";

    //form fields
    const searchString = ref<string>();
    const date = ref();




    const searchResultAvailable = ref<boolean>(false);
    const searchResults = ref<SearchResult[]>([]);


    const appBarStore = useAppBarStore();


    onBeforeMount(async () => {
        try {
            appBarStore.title = "Search"

        } catch (error) {
            console.error(error);
        }
    });

    async function search(){
        console.log("search string: " + searchString.value)
        console.log("date: " + date.value)

        const searchResult: string = await searchService.search();
        searchResultAvailable.value = true;

        searchResults.value = [
            {   
                name: "seb0",
                sessionId: "89c68efd-cdd5-4a84-8481-38ba99b9e5f4",
                date: "21.08.2023",
                group: "demo1",
                results: [
                    {
                        application: "Web-Browser",
                        url: "moodle.com/examXyz",
                        timestamp: "1691136444234" 
                    },
                    {
                        application: "Web-Browser",
                        url: "moodle.com/examXyz/question100",
                        timestamp: "1691136444234" 
                    },
                    {
                        application: "Windows Calculator",
                        url: "",
                        timestamp: "1691136444234" 
                    }
                ]
            },
            {
                name: "seb4",
                sessionId: "7f812da0-39dc-42f5-8233-72836e72cae2",
                date: "12.08.2023",
                group: "newTimeTest",
                results: [
                    {
                        application: "Web-Browser",
                        url: "moodle.com/examXyz",
                        timestamp: "1691069879564" 
                    },
                    {
                        application: "Web-Browser",
                        url: "moodle.com/examXyz/question100",
                        timestamp: "1691069879564" 
                    },
                    {
                        application: "Windows Calculator",
                        url: "",
                        timestamp: "1691069879564" 
                    }
                ]
            },
            {
                name: "Peter Muster",
                sessionId: "3387f32a-b651-49a3-a66a-9cb32347f765",
                date: "12.12.2021",
                group: "group12",
                results: [
                    {
                        application: "Web-Browser",
                        url: "moodle.com/examXyz",
                        timestamp: "1691069879564" 
                    },
                    {
                        application: "Web-Browser",
                        url: "moodle.com/examXyz/question100",
                        timestamp: "1691069879564" 
                    },
                    {
                        application: "Windows Calculator",
                        url: "",
                        timestamp: "1691069879564" 
                    }
                ]
            }
        ];

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
        width: 60%;
    }

    .date-time-selection-container{
        width: 50%;
    }


</style>