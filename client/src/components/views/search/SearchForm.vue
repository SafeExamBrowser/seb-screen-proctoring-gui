<template>
    <v-sheet 
        elevation="4"
        class="search-container rounded-lg"
        title="Search">
        <v-form>
            <div class="form-container">
                <!------------Exam Name------------->
                <v-row align="center">
                    <v-col cols="4">
                        Exam Name:
                    </v-col>
                    <v-col cols="8">
                        <v-text-field
                            single-line
                            hide-details
                            density="compact"
                            variant="solo"
                            v-model="examNameField"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <!----------------------------------->

                <!------------Group Name------------->
                <v-row align="center">
                    <v-col cols="4">
                        Group Name:
                    </v-col>
                    <v-col cols="8">
                        <v-text-field
                            single-line
                            hide-details
                            density="compact"
                            variant="solo"
                            v-model="groupNameField"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <!----------------------------------->


                <!------------Login / Machine Name------------->
                <v-row align="center">
                    <v-col cols="4">
                        <div class="login-option-select-container">
                            <v-select
                                hide-details
                                variant="outlined"
                                v-model="loginOptionSelect"
                                :items="loginOptionsSelectValues">
                            </v-select>
                        </div>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field
                            single-line
                            hide-details
                            density="compact"
                            variant="solo"
                            v-model="loginOptionField">
                        </v-text-field>
                    </v-col>
                </v-row>
                <!----------------------------------->


                <!------------Time Period------------->
                    <v-row align="center">
                        <v-col cols="4">
                            Period:
                        </v-col>
                        <v-col cols="1">
                            <v-radio v-model="timePeriodRadio" @click="radioButtonEvent('period')"></v-radio>
                        </v-col>
                        <v-col cols="1">
                            Last
                        </v-col>
                        <v-col cols="2">
                            <v-text-field
                                hide-details    
                                single-line
                                type="number"
                                density="compact"
                                variant="solo"
                                v-model="timePeriodField"
                                :disabled="!timePeriodRadio"> 
                            </v-text-field> 
                        </v-col>
                        <v-col cols="4">
                            <v-select
                                hide-details
                                variant="outlined"
                                v-model="timePeriodSelect"
                                :items="timePeriodSelectValues"
                                :disabled="!timePeriodRadio">
                            </v-select>
                        </v-col>
                    </v-row>
                    <!----------------------------------->


                    <!------------Time Selection------------->
                    <v-row align="center">
                        <v-col cols="4">
                            Between:
                        </v-col>
                        <v-col cols="1">
                            <v-radio v-model="timeSelectionRadio" @click="radioButtonEvent('selection')">
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

                <!------------Metadata------------->
                <v-row>
                    <v-col>
                        <v-expansion-panels>
                            <v-expansion-panel
                                title="Metadata">
                                <v-expansion-panel-text>

                                    <!------------Metatdata: Url------------->
                                    <v-row align="center">
                                        <v-col cols="4">
                                            Url:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                single-line
                                                hide-details
                                                density="compact"
                                                variant="solo"
                                                v-model="metadataUrlField"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!----------------------------------->

                                    <!------------Metatdata: Window Title------------->
                                    <v-row align="center">
                                        <v-col cols="4">
                                            Window Title:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                single-line
                                                hide-details
                                                density="compact"
                                                variant="solo"
                                                v-model="metadataWindowTitleField"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!----------------------------------->

                                    <!------------Metatdata: User Action------------->
                                    <v-row align="center">
                                        <v-col cols="4">
                                            User Action:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                single-line
                                                hide-details
                                                density="compact"
                                                variant="solo"
                                                v-model="metadataUserActionField"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!----------------------------------->

                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
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
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import { TimePeriod } from "@/models/timePeriodEnum";
    import { LoginOptionSelect } from "@/models/loginOptionSelectEnum";
    import * as timePeriodUtils from "@/utils/timePeriodUtils";

    //emits (parent functions)
    const emit = defineEmits<{
        searchSessions: [
            groupName: string, 
            loginName: string,
            loginOptionSelected: LoginOptionSelect,
            fromTime: string,
            toTime: string
        ]
    }>();

    //---------form fields-------------
    // const groupNameField = ref<string>("new-data-2");
    // const loginNameField = ref<string>("seb_6a74317a-ed41-4c78-b820-5842f295a9bd_296");
    const examNameField = ref<string>("");
    const groupNameField = ref<string>("");

    const loginOptionField = ref<string>("");
    const loginOptionSelect = ref<number>(1);
    const loginOptionsSelectValues: {title: string, value: number}[] = [
        {title: LoginOptionSelect.login, value: 1},
        {title: LoginOptionSelect.machine, value: 2}
    ];

    const timePeriodField = ref<number>(5);
    const timePeriodRadio = ref<boolean>(false);
    const timePeriodSelect = ref<number>(1);
    const timePeriodSelectValues: {title: string, value: number}[] = [
        {title: TimePeriod.day, value: 1},
        {title: TimePeriod.week, value: 2},
        {title: TimePeriod.month, value: 3},
        {title: TimePeriod.year, value: 4},
    ];

    const timeSelectionRadio = ref<boolean>(true);
    const timeSelectionPicker = ref();

    const metadataUrlField = ref<string>("");
    const metadataWindowTitleField = ref<string>("");
    const metadataUserActionField = ref<string>("");
    //--------------------------------


    onBeforeMount(async () => {
        searchSessions();
    });


    async function searchSessions(){
        let fromTime: string = "";
        let toTime: string = "";
        if(timePeriodRadio.value) [fromTime, toTime] = calcTimePeriod();
        if(timeSelectionRadio.value) [fromTime, toTime] = calcTimeSelection();

        let loginOptionSelected: LoginOptionSelect = LoginOptionSelect.login;
        if(loginOptionSelect.value == 1) loginOptionSelected = LoginOptionSelect.login;
        if(loginOptionSelect.value == 2) loginOptionSelected = LoginOptionSelect.machine;
    

        emit("searchSessions", groupNameField.value, loginOptionField.value, loginOptionSelected, fromTime, toTime);
    }

    function calcTimePeriod(): [string, string]{
        return [timePeriodUtils.getTimestampFromPeriodSelection(timePeriodSelect.value, timePeriodField.value), Date.now().toString()];
    }

    function calcTimeSelection(): [string, string]{
        if(timeSelectionPicker.value == null){
            return ["", ""];
        }
        
        return [timeSelectionPicker.value[0].getTime(), timeSelectionPicker.value[1].getTime()];
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

    .login-option-select-container{
        /* max-width: 75%; */
    }

</style>