<template>


    <v-expansion-panels v-model="panels">
        <v-expansion-panel value="panel">

            <v-expansion-panel-title class="font-weight-bold">
                Exams
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
                <v-data-table
                    show-select
                    select-strategy="page"
                    class="rounded-lg elevation-4 mt-4 form-container"
                    :sort-by="[{key: 'exam.startTime', order: 'desc'}]"
                    :items-per-page="tableUtils.calcDefaultItemsPerPage(exams)"
                    :items-per-page-options="tableUtils.calcItemsPerPage(exams)"
                    :headers="headers"
                    :items="exams">

                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, selectAll, allSelected, someSelected }">
                        <CustomTableHeader
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="headerRefs"
                            :selectAll="selectAll"
                            :allSelected="allSelected"
                            :someSelected="someSelected">
                        </CustomTableHeader>
                    </template>

                    <template v-slot:item.startTime="{item}">
                        <td>
                            <div>
                                {{timeUtils.formatTimestampToFullDate(item.startTime)}}
                            </div>
                        </td>
                    </template>
                </v-data-table>
            </v-expansion-panel-text>

        </v-expansion-panel>
    </v-expansion-panels>

    

</template>


<script setup lang="ts">
    import { ref } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import CustomTableHeader from "@/utils/table/CustomTableHeader.vue";


    //props
    const props = defineProps<{
        exams: Exam[]
    }>();

    //panel
    const panels = ref<string[]>(["panel"]);

    //table
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Exam", key: "name", width: "50%"},
        {title: "Exam Start-Time", key: "startTime", width: "50%"}
    ]);





</script>


<style scoped>

    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>