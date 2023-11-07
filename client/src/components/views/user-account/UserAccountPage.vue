<template>
    <div class="account-parent-container">
        <v-sheet elevation="4" class="account-container rounded-lg">
            <v-row>

                <v-col cols="10">
                    <!-----------admin---------->
                    <template v-if="userAccountStore.userAccount?.roles.includes('ADMIN')">
                        <UserList ref="userListRef"></UserList>
                    </template>
                    <!-------------------------->
                </v-col>

                <v-col cols="2">
                    <!-- <v-card color="#e2ecf7"> -->
                    <v-card>
                        <v-card-title>Actions</v-card-title>
                        <v-list density="compact">

                            <v-list-item
                                v-for="(item, i) in actionItems"
                                :key="i"
                                :value="item"
                                :disabled="userAccountViewService.disableEnableActionItem(item.action)"
                                @click="item.event"
                                color="primary">

                                <template v-slot:prepend>
                                    <v-icon :icon="item.icon"></v-icon>
                                </template>

                                <v-list-item-title v-text="item.text"></v-list-item-title>
                            </v-list-item>
                        </v-list>

                    </v-card>
                </v-col>

            </v-row>
        </v-sheet>
    </div>

    <v-dialog v-model="activateUserAccountDialog" max-width="500">
        <ActivateUserAccountDialog 
            @closeActivateDialog="closeActivateDialog"
            :accountId="userAccountStore.selectedAccountId!">
        </ActivateUserAccountDialog>
    </v-dialog>

    <v-dialog v-model="addUserAccountDialog" max-width="1000">
        <AddUserAccountDialog @closeAddDialog="closeAddDialog"></AddUserAccountDialog>
    </v-dialog>

</template>

<script setup lang="ts">
    import { ref, onBeforeMount, computed } from "vue";
    import { useAppBarStore, useUserAccountStore } from "@/store/app";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import UserList from "./UserList.vue";
    import {navigateTo} from "@/router/navigation";
    import ActivateUserAccountDialog from "./ActivateUserAccountDialog.vue";
    import AddUserAccountDialog from "./AddUserAccountDialog.vue";

    //reactive variables
    const isLoading = ref<boolean>(true);
    const activateUserAccountDialog = ref(false);
    const addUserAccountDialog = ref(false);
    const userListRef = ref<any>(null);

    //store
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //action lists
    const actionItems: {text: string, icon: string, action: string, event: Function}[] = [
        { text: "View", icon: "mdi-account-eye", action: "view", event: viewUserAccount},
        { text: "De/ -Activate", icon: "mdi-account-sync", action: "activate", event: openActivateDialog},
        { text: "Add", icon: "mdi-account-plus", action: "add", event: openAddDialog},
    ];


    onBeforeMount(async () => {
        appBarStore.title = "Account";
        await userAccountViewService.setPersonalUserAccount();

        if(!userAccountStore.userAccount?.roles.includes('ADMIN')){
            navigateTo("/account/" + userAccountStore.userAccount?.id);
        }

        isLoading.value = false;
    });


    //=====action-icons event listeners======
    function viewUserAccount(){
        navigateTo("/account/" + userAccountStore.selectedAccountId);
    }

    function openActivateDialog(){
        activateUserAccountDialog.value = true;
    }

    function closeActivateDialog(isUpdated: boolean, accountId?: number, terminationTime?: number | null){
        if(!isUpdated){
            activateUserAccountDialog.value = false;
            return;
        }

        if(userListRef.value != null){
            userListRef.value.updateTerminationTimeInList(accountId, terminationTime);
            activateUserAccountDialog.value = false;
        }
    }

    function openAddDialog(){
        addUserAccountDialog.value = true;
    }

    function closeAddDialog(newUserAccount?: UserAccount){
        if(!newUserAccount){
            addUserAccountDialog.value = false;
            return;
        }

        if(userListRef.value != null){
            userListRef.value.updateUserAccountInList(newUserAccount);
            addUserAccountDialog.value = false;
        }
    }
    //==============================


</script>

<style scoped>

    .account-parent-container{
        display: flex;
        justify-content: center;
        align-items: center; 
    }

    .account-container{
        width: 80%;
        padding: 20px;
    }

</style>