<template>
    <tr>
        <template v-for="(column, index) in props.columns">
            
            <th :aria-label="getHeaderDescription(column, isSorted)"> 
                <span 
                    ref="headerRefs"
                    tabindex="0" 
                    class="mr-2 cursor-pointer font-weight-bold" 
                    role="button" 
                    @keydown="tableUtils.handleTabKeyEvent($event, 'sort', index, {headerRefs: headerRefs})" 
                    @click="() => props.toggleSort(column)">
                    {{ column.title }}
                </span>

                <template v-if="props.isSorted(column)">
                    <v-icon :icon="props.getSortIcon(column)"></v-icon>
                </template>

                <!--todo: checking should not be done via title-->
                <template v-if="column.title == 'Exam'">
                    <v-btn 
                        :aria-label="tableStore.isExamExpand ? 'hide exam details' : 'show exam details'"
                        :icon="tableStore.isExamExpand ? 'mdi-arrow-expand-left' : 'mdi-arrow-expand-right'" 
                        rounded="sm" 
                        variant="flat" 
                        size="small"
                        @click="tableStore.isExamExpand ? emit('removeAddtionalExamHeaders') : emit('addAddtionalExamHeaders')">
                    </v-btn>
                </template>

                <template v-if="column.title == $t('searchSessionTable.loginName')">
                    <v-btn 
                        :aria-label="tableStore.isIpDisplayList[tableUtils.getSessionListIndex(props.day!)].isIp ? 'show login name' : 'show IP'"
                        :icon="tableStore.isIpDisplayList[tableUtils.getSessionListIndex(props.day!)].isIp ? 'mdi-toggle-switch-outline' : 'mdi-toggle-switch-off-outline'" 
                        rounded="sm" 
                        variant="flat" 
                        @click="toggleNameIpSwitch()">
                    </v-btn>
                </template>
            </th>
        </template>
    </tr>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as tableUtils from "@/utils/table/tableUtils";
    import { useAppBarStore, useTableStore } from "@/store/app";

    //stores
    const appBarStore = useAppBarStore();
    const tableStore = useTableStore();

    //header reactivity
    const headerRefs = ref<any[]>();

    //props
    const props = defineProps<{
        columns: any[];
        isSorted: (column: any) => boolean;
        getSortIcon: any
        toggleSort: (column: any) => void;
        headerRefsProp: any;
        day?: string;
    }>();

    //custom: start page
    const emit = defineEmits<{
        addAddtionalExamHeaders: any;
        removeAddtionalExamHeaders: any;
    }>();


    onBeforeMount(() => {
        headerRefs.value = props.headerRefsProp;
    });

    function toggleNameIpSwitch(){
        const index: number = tableUtils.getSessionListIndex(props.day!);

        if(tableStore.isIpDisplayList[index].isIp){
            tableStore.isIpDisplayList[index].isIp = false;
            return;
        }

        tableStore.isIpDisplayList[index].isIp = true;
    }

    function getHeaderDescription(column: any, isSorted: any): any{
        // if(column.sortable){
        //     return "";
        // }

        console.log(column)

        let headerDesc: string = `Header: ${column.title}, sort order: `

        if(!isSorted(column)){
            return `${headerDesc} none`;
    }

        if(props.getSortIcon(column) == "$sortAsc"){
            return `${headerDesc} ascending`;
        }

        if(props.getSortIcon(column) == "$sortDesc"){
            return `${headerDesc} descending`;
        }

        return `${headerDesc} none`;
    }

</script>