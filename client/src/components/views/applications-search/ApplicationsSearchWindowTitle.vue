<template>

    <div class="mb-6">
        Total Amount of Screenshots: {{ metadataWindows?.totalAmount }}
    </div>

    <v-expansion-panels 
        v-model="panels" 
        multiple>
        
        <v-expansion-panel 
            v-for="metadataWindow in metadataWindows?.distinctWindowTitles" 
            class="rounded-lg" 
            :key="metadataWindow"
            :value="metadataWindow">

            <v-expansion-panel-title class="font-weight-bold panel-styling">
                {{ metadataWindow }}
            </v-expansion-panel-title>
            
            <v-expansion-panel-text class="panel-styling">
                <ApplicationsSearchUserList
                    :metadataApp="metadataApp"
                    :metadataWindow="metadataWindow"
                    :groupIds="groupIds">
                </ApplicationsSearchUserList>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>


<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as applicationsSearchViewService from "@/services/component-services/applicationsSearchViewService";
    import * as generalUtils from "@/utils/generalUtils";
    import ApplicationsSearchUserList from "./ApplicationsSearchUserList.vue";

    //props
    const props = defineProps<{
        metadataApp: string,
        groupIds: number[]
    }>();

    //ui control
    const panels = ref<string[]>([]);

    //main data
    const metadataWindows = ref<DistinctMetadataWindowForExamRecord>();

    onBeforeMount(async () => {
        const metadataWindowsLocal: DistinctMetadataWindowForExamRecord | null = 
            await applicationsSearchViewService.getDistinctMetadataWindowForExam(
                generalUtils.createStringIdList(props.groupIds), 
                props.metadataApp
            );

        if(metadataWindowsLocal == null){
            //todo: add error handling
            return;
        }

        metadataWindows.value = metadataWindowsLocal;
    });



</script>


<style scoped>



</style>