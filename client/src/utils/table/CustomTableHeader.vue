<template>
    <tr>
        <template v-for="(column, index) in props.columns">
            <td>
                <span 
                    ref="headerRefs"
                    tabindex="0" 
                    class="mr-2 cursor-pointer font-weight-bold" 
                    role="button" 
                    @keydown="tableUtils.handleTabKeyEvent($event, 'sort', index, {headerRefs: headerRefs})" 
                    @click="() => props.toggleSort(column)"
                >
                    {{ column.title }}
                </span>
                <template v-if="props.isSorted(column)">
                    <v-icon :icon="props.getSortIcon(column)"></v-icon>
                </template>
            </td>
        </template>
    </tr>
</template>

<script setup lang="ts">
    import { defineProps, ref, onBeforeMount, onMounted } from "vue";
    import * as tableUtils from "@/utils/table/tableUtils";
    import { useAppBarStore } from "@/store/app";

    //stores
    const appBarStore = useAppBarStore();

    //header reactivity
    const headerRefs = ref<any[]>();

    //props
    const props = defineProps<{
        columns: any[];
        isSorted: (column: any) => boolean;
        getSortIcon: any
        toggleSort: (column: any) => void;
        headerRefsProp: any
    }>();


    onBeforeMount(() => {
        headerRefs.value = props.headerRefsProp;
    });

    onMounted(() => {
        //if page = start page --> sort by start-time desc
        if(appBarStore.title == "Active SEB Groups"){
            tableUtils.sortTable(3, headerRefs);
            tableUtils.sortTable(3, headerRefs);
        }
    });


</script>
