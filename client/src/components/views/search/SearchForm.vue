<template>
    <div style="visibility: hidden">placeholder</div>
    <v-form 
        class="form-container"
        @keyup.enter="searchSessions()"
        @keyup.esc="clearForm()">

            <!------------Exam Name------------->
            <v-row align="center">
                <v-col cols="4">
                    {{ $t('searchForm.examName') }}:
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        single-line
                        hide-details
                        density="compact"
                        variant="outlined"
                        v-model="examNameField"
                    ></v-text-field>
                </v-col>
            </v-row>
            <!----------------------------------->

            <!------------Group Name------------->
            <v-row align="center">
                <v-col cols="4">
                    {{ $t('searchForm.groupName') }}:
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        single-line
                        hide-details
                        density="compact"
                        variant="outlined"
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
                            :title="$t('searchForm.loginMachineTitle')">
                            <v-expansion-panel-text>

                                <!------------Login Name------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ $t('searchForm.loginName') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="loginNameField">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------IP-Address------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        IP-Address:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="ipAddressField">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Machine Name------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                    {{ $t('searchForm.machineName') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
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
                        :title="$t('searchForm.metadataTitle')">
                            <v-expansion-panel-text>

                                <!------------Metatdata: Url------------->
                                <v-row align="center">
                                    <v-col cols="4" class="text-decoration-line-through">
                                        {{ $t('searchForm.url') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="metadataUrlField"
                                            :disabled=true
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Metatdata: Window Title------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ $t('searchForm.applicationWebsite') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="metadataWindowTitleField"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Metatdata: User Action------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ $t('searchForm.activityDetails') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
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
                        {{ $t('searchForm.period') }}:
                    </v-col>
                    <v-col cols="1">
                        <v-radio v-model="timePeriodRadio" @click="radioButtonEvent('period')"></v-radio>
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
                            :disabled="!timePeriodRadio"> 
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
                        {{ $t('searchForm.cancel') }}
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="primary" 
                        variant="flat" 
                        class="ml-2"
                        @click="searchSessions()">
                        {{ $t('searchForm.search') }}
                    </v-btn>

                </v-col>
            </v-row>
            <!----------------------------------->
    </v-form>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import * as timePeriodUtils from "@/utils/timePeriodUtils";

    //emits (parent functions)
    const emit = defineEmits<{
        searchSessions: [
            examName: string,
            groupName: string, 
            loginName: string,
            ipAddress: string,
            machineName: string,
            metadataUrl: string,
            metadataWindowTitle: string,
            metadataUserAction: string,
            fromTime: string,
            toTime: string,
            pageNumber: number
        ]
    }>();

    //form fields
    const groupNameField = ref<string>("");
    const examNameField = ref<string>("");

    const loginNameField = ref<string>("");
    const ipAddressField = ref<string>("");
    const machineNameField = ref<string>("");

    const metadataUrlField = ref<string>("");
    const metadataWindowTitleField = ref<string>("");
    const metadataUserActionField = ref<string>("");

    const timePeriodField = ref<number>(5);
    const timePeriodRadio = ref<boolean>(false);
    const timePeriodSelect = ref<number>(1);

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
            ipAddressField.value,
            machineNameField.value, 
            metadataUrlField.value, 
            metadataWindowTitleField.value, 
            metadataUserActionField.value, 
            fromTime, 
            toTime,
            1
        );
    }

    function clearForm(){
        examNameField.value = "";
        groupNameField.value = ""; 
        loginNameField.value = "";
        ipAddressField.value = "";
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