<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg"
                title="Applications">

                <div style="visibility: hidden">placeholder</div>

                <v-form 
                    class="form-container"
                    @keyup.enter="searchExams()"
                    @keyup.esc="clearForm()">

                    <!------------Time Period------------->
                    <v-row align="center">
                        <v-col cols="4">
                            {{ $t('searchForm.period') }}:
                        </v-col>
                        <v-col cols="1">
                            <v-radio    
                                :aria-label="$t('searchForm.period')"
                                v-model="timePeriodRadio" 
                                @click="radioButtonEvent('period')">
                            </v-radio>
                        </v-col>
                        <v-col cols="1">
                            {{ $t('searchForm.last') }}
                        </v-col>
                        <v-col cols="2">
                            <v-text-field
                                hide-details    
                                single-line
                                type="number"
                                density="compact"
                                variant="solo"
                                v-model="timePeriodField"
                                :disabled="!timePeriodRadio"
                                :aria-label="$t('searchForm.last')"> 
                            </v-text-field> 
                        </v-col>
                        <v-col cols="4">
                            <v-select
                                hide-details
                                variant="outlined"  
                                v-model="timePeriodSelect"
                                :items="[
                                    {title: $t('timePeriod.day'), value: 1},
                                    {title: $t('timePeriod.week'), value: 2},
                                    {title: $t('timePeriod.month'), value: 3},
                                    {title: $t('timePeriod.year'), value: 4}
                                ]"   
                                :disabled="!timePeriodRadio">
                            </v-select>
                        </v-col>
                    </v-row>
                    <!----------------------------------->


                    <!------------Time Selection------------->
                    <v-row align="center">
                        <v-col cols="4">
                            {{ $t('searchForm.between') }}:
                        </v-col>
                        <v-col cols="1">
                            <v-radio 
                                :aria-label="$t('searchForm.between')"
                                v-model="timeSelectionRadio" 
                                @click="radioButtonEvent('selection')">
                            </v-radio>
                        </v-col>
                        <v-col cols="7">
                            <VueDatePicker 
                                range
                                format="dd.MM.yyyy HH:mm"
                                v-model="timeSelectionPicker"  
                                :teleport="true"
                                :disabled="!timeSelectionRadio">
                            </VueDatePicker>
                        </v-col>
                    </v-row>
                    <!----------------------------------->

                    <!------------Buttons------------->
                    <v-row>
                        <v-col align="right">
                            <v-btn 
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                @click="clearForm()">
                                {{ $t('searchForm.cancel') }}
                            </v-btn>

                            <v-btn 
                                rounded="sm" 
                                color="primary" 
                                variant="flat" 
                                class="ml-2"
                                @click="searchExams()">
                                {{ $t('searchForm.search') }}
                            </v-btn>

                        </v-col>
                    </v-row>
                    <!----------------------------------->

                </v-form>
            </v-sheet>
        </v-col>
    </v-row>

    <v-row v-if="searchResultAvailable">
        <v-col v-if="noResutsFound">
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                title="No results match your search criteria">
                <v-row>
                    <v-col align="left" class="text-h6">
                        No results match your search criteria
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
        
        <v-col v-else>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                title="test1234">

                <v-row>
                    <v-col align="left">
                        <h2 class="title-inherit-styling text-h6">Exams</h2>
                    </v-col>
                </v-row>

                <ApplicationsExamList :exams="exams"></ApplicationsExamList>

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
    <AlertMsg 
        v-if="loadingStore.isTimeout"
        :alertProps="{
            color: 'error',
            type: 'snackbar',
            textKey: 'timeout-error'
        }">
    </AlertMsg>
</template>



<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore, useTableStore, useLoadingStore } from "@/store/store";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import * as applicationViewService from "@/services/component-services/applicationViewService";
    import ApplicationsExamList from "./ApplicationsExamList.vue";

    //store
    const appBarStore = useAppBarStore();
    const tableStore = useTableStore();
    const loadingStore = useLoadingStore();

    //form fields
    const timePeriodField = ref<number>(1);
    const timePeriodRadio = ref<boolean>(true);
    const timePeriodSelect = ref<number>(2);
    const timeSelectionRadio = ref<boolean>(false);
    const timeSelectionPicker = ref(null);

    //error handling
    const searchResultAvailable = ref<boolean>(false);
    const noResutsFound = ref<boolean>(false);
    const errorAvailable = ref<boolean>();

    //main data
    const exams = ref<Exam[]>([]);


    onBeforeMount(async () => {
        appBarStore.title = "Applications";
        searchExams();
    });




    async function searchExams(){
        errorAvailable.value = false;
        noResutsFound.value = false;

        const examList: Exam[] | null = await applicationViewService.searchExams();

        if(examList == null){  
            errorAvailable.value = true;
            return;
        }

        if(examList.length == 0){
            noResutsFound.value = true;
            searchResultAvailable.value = true;
            return;
        }

        searchResultAvailable.value = true;
        exams.value = examList;
    }



    function clearForm(){
        timePeriodField.value = 1;
        timePeriodRadio.value = true;
        timePeriodSelect.value = 2;
        timeSelectionRadio.value = false;
        timeSelectionPicker.value = null;

        searchExams();
    }



    function radioButtonEvent(button: string){
        if(button == "period"){
            timePeriodRadio.value = true;
            timeSelectionRadio.value = false;
        }

        if(button == "selection"){
            timeSelectionRadio.value = true;
            timePeriodRadio.value = false;
        }
    }




    


</script>




<style scoped>


    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>