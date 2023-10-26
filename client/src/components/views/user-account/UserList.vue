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
            <CustomTableHeader
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="headerRefs">
            </CustomTableHeader>
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
    import * as tableUtils from "@/utils/table/tableUtils";
    import { Status } from "@/models/statusEnum";
    import CustomTableHeader from "@/utils/table/CustomTableHeader.vue";


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
    });


    watch(selectedItem, () => {
        if(selectedItem.value.length == 0){
            userAccountStore.isAccountSelected = false;
            return;
        }

        userAccountStore.isAccountSelected = true;
        userAccountStore.selectedAccountId = selectedItem.value[0];
    });




    function getStatusValue(terminationTime: string | null): Status{
        if(terminationTime){
            return Status.inactive;
        }

        return Status.active;
    }




</script>

<style scoped>


</style>