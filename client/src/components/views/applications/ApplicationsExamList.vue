<template>

    exam works

    <v-data-table
        show-select
        item-value="item.id"
        class="rounded-lg elevation-4"
        :sort-by="[{key: 'exam.startTime', order: 'desc'}]"
        select-strategy="page"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(exams)"
        :items-per-page-options="tableUtils.calcItemsPerPage(exams)"
        :headers="headers"
        :items="exams">

        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, selectAll }">
            <CustomTableHeader
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="headerRefs"
                :selectAll="selectAll">
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

    //table
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Exam", key: "name", width: "50%"},
        {title: "Exam Start-Time", key: "startTime", width: "50%"}
    ]);





</script>


<style scoped>

</style>