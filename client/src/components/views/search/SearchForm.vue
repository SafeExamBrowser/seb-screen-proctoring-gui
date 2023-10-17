<template>
    <v-sheet 
        elevation="4"
        class="search-container rounded-lg"
        title="Search">
        <v-form 
            @keyup.enter="searchSessions()"
            @keyup.esc="clearForm()">

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

                <!------------Login- / Machinename"------------->
                <v-row>
                    <v-col>
                        <v-expansion-panels>
                            <v-expansion-panel
                                title="Login- / Machinename">
                                <v-expansion-panel-text>

                                    <!------------Login Name------------->
                                    <v-row align="center">
                                        <v-col cols="4">
                                            Login Name:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                single-line
                                                hide-details
                                                density="compact"
                                                variant="solo"
                                                v-model="loginNameField">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!----------------------------------->

                                    <!------------Machine Name------------->
                                    <v-row align="center">
                                        <v-col cols="4">
                                            Machine Name:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                single-line
                                                hide-details
                                                density="compact"
                                                variant="solo"
                                                v-model="machineNameField">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!----------------------------------->

                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
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
                                        <v-col cols="4" class="text-decoration-line-through">
                                            Url:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field
                                                single-line
                                                hide-details
                                                density="compact"
                                                variant="solo"
                                                v-model="metadataUrlField"
                                                :disabled=true
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!----------------------------------->

                                    <!------------Metatdata: Window Title------------->
                                    <v-row align="center">
                                        <v-col cols="4">
                                            Application / Website:
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
                                            Activity Details:
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

                <!------------Buttons------------->
                <v-row>
                    <v-col align="right">
                        <v-btn 
                            rounded="sm" 
                            color="black" 
                            variant="outlined"
                            @click="clearForm()">
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
    import * as timePeriodUtils from "@/utils/timePeriodUtils";

    //emits (parent functions)
    const emit = defineEmits<{
        searchSessions: [
            examName: string,
            groupName: string, 
            loginName: string,
            machineName: string,
            metadataUrl: string,
            metadataWindowTitle: string,
            metadataUserAction: string,
            fromTime: string,
            toTime: string
        ]
    }>();

    //form fields
    // const groupNameField = ref<string>("new-test-group");
    const groupNameField = ref<string>("");
    const examNameField = ref<string>("");

    const loginNameField = ref<string>("");
    const machineNameField = ref<string>("");

    const metadataUrlField = ref<string>("");
    const metadataWindowTitleField = ref<string>("");
    const metadataUserActionField = ref<string>("");

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
    const timeSelectionPicker = ref(null);


    onBeforeMount(async () => {
        searchSessions();
    });


    async function searchSessions(){
        let fromTime: string = "";
        let toTime: string = "";
        if(timePeriodRadio.value) [fromTime, toTime] = calcTimePeriod();
        if(timeSelectionRadio.value) [fromTime, toTime] = calcTimeSelection();

        emit(
        "searchSessions", 
            examNameField.value,
            groupNameField.value, 
            loginNameField.value, 
            machineNameField.value, 
            metadataUrlField.value, 
            metadataWindowTitleField.value, 
            metadataUserActionField.value, 
            fromTime, 
            toTime
        );
    }

    function clearForm(){
        examNameField.value = "";
        groupNameField.value = ""; 
        loginNameField.value = "";
        machineNameField.value = ""; 
        metadataUrlField.value = ""; 
        metadataWindowTitleField.value = "";
        metadataUserActionField.value = "";
        timePeriodField.value = 5;
        timePeriodRadio.value = false;
        timePeriodSelect.value = 1;
        timeSelectionRadio.value = true;
        timeSelectionPicker.value = null;
    }

    const testFunction = () => {

    }

    function calcTimePeriod(): [string, string]{
        return [timePeriodUtils.getTimestampFromPeriodSelection(timePeriodSelect.value, timePeriodField.value), Date.now().toString()];
    }

    function calcTimeSelection(): [string, string]{
        if(timeSelectionPicker.value == null){
            return ["", ""];
        }
        
        //@ts-ignore
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

</style>