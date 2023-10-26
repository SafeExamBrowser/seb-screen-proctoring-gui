<template>

    <v-data-table 
        show-select
        v-model="selectedItem"
        item-value="id" 
        class="elevation-1"
        select-strategy="single"
        :hover="true"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(accounts)" 
        :items-per-page-options="tableUtils.calcItemsPerPage(accounts)"
        :headers="headers" 
        :items="accounts">

        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
            <tr>
                <template v-for="(column, index) in columns">
                <td>
                    <span 
                        ref="headerRefs"
                        tabindex="0" 
                        class="mr-2 cursor-pointer font-weight-bold" 
                        role="button" 
                        @keydown="handleTabKeyEvent($event, 'sort', 0, index)" 
                        @click="() => toggleSort(column)"
                    >
                        {{ column.title }}
                    </span>
                    <template v-if="isSorted(column)">
                        <v-icon :icon="getSortIcon(column)"></v-icon>
                    </template>
                </td>
                </template>
            </tr>
        </template>

        <template v-slot:item.terminationTime="{item}">
            <td>
                <div>
                    {{getStatusValue(item.terminationTime)}}
                </div>
            </td>
        </template>

    </v-data-table>

</template>

<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore, useUserAccountStore } from "@/store/app";
    import { VDataTable } from "vuetify/labs/VDataTable";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import * as tableUtils from "@/utils/tableUtils";
    import { Status } from "@/models/statusEnum";


    //store
    const userAccountStore = useUserAccountStore();

    //table
    const accounts = ref<UserAccount[]>();
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Name", key: "name"},
        {title: "Surname", key: "surname"},
        {title: "Username", key: "username"},
        {title: "Email", key: "email"},
        {title: "Role", key: "roles[0]"},
        {title: "Status", key: "terminationTime"}
    ]);

    //selected item
    const selectedItem = ref<any[]>([]);


    onBeforeMount(async () => {
        const userAccountResponse: UserAccountResponse = await userAccountViewService.getUserAccounts({pageSize: 500});
        accounts.value = userAccountResponse?.content;

        console.log(accounts.value)
    });


    watch(selectedItem, () => {
        if(selectedItem.value.length == 0){
            userAccountStore.isAccountSelected = false;
            return;
        }

        userAccountStore.isAccountSelected = true;

        console.log(selectedItem.value)

    });




    function getStatusValue(terminationTime: string | null): Status{
        if(terminationTime){
            return Status.inactive;
        }

        return Status.active;
    }





    function handleTabKeyEvent(event: any, action: string, index: number, key: number){
        if (event.key == 'Enter' || event.key == ' ') {
            if(action == "sort"){
                sortTable(key)
            }
        }
    }

    function sortTable(key: number){
        if(headerRefs.value != null){
            headerRefs.value[key].click();
        }
    }


</script>

<style scoped>

    .test{

    }

</style>