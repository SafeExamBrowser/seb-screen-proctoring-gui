<template>
    <div class="account-parent-container">
        <v-sheet elevation="4" class="account-container rounded-lg">
            <v-row>

                <v-col cols="1">
                    <v-btn
                        v-if="userAccountStore.isAdminViewMode" 
                        size="x-large"
                        variant="text" 
                        icon="mdi-arrow-left"
                        @click="backToTable">
                    </v-btn>
                </v-col>

                <v-col>
                    <!-----------admin---------->
                    <template v-if="userAccountStore.userAccount?.roles.includes('ADMIN') && !userAccountStore.isAdminViewMode">
                        <UserList></UserList>
                    </template>
                    <!-------------------------->

                    <!--user or admin edit mode-->
                    <template v-if="!userAccountStore.userAccount?.roles.includes('ADMIN') || userAccountStore.isAdminViewMode">
                        <template v-if="!isLoading">
                            <UserInfo :userAccount="userAccountStore.userAccount!" :isEditMode="false"> </UserInfo>
                        </template>
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
                                :disabled="disableEnableActionItem(item.action)"
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
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, computed } from "vue";
    import { useAppBarStore, useUserAccountStore } from "@/store/app";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import UserInfo from "./UserInfo.vue";
    import UserList from "./UserList.vue";
    import router from "@/router";

    //reactive variables
    const isLoading = ref<boolean>(true);

    //store
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //action lists
    const actionItems = ref<{text: string, icon: string, action: string, event: Function}[]>();

    const actionItemsAdmin: {text: string, icon: string, action: string, event: Function}[] = [
        { text: "View User Account", icon: "mdi-account-eye", action: "view", event: viewUserAccount},
        { text: "Deactivate User Account", icon: "mdi-account-cancel", action: "deactivate", event: tempFunction},
        { text: "Add User Account", icon: "mdi-account-plus", action: "add", event: tempFunction},
    ];

    const actionItemsUser: {text: string, icon: string, action: string, event: Function,}[] = [
        { text: "Edit User Account", icon: "mdi-account-edit", action: "edit", event: editUserAccount},
        { text: "Change Password", icon: "mdi-lock", action: "change", event: tempFunction}
    ];


    onBeforeMount(async () => {
        appBarStore.title = "Account";
        await userAccountViewService.setPersonalUserAccount();

        


        isLoading.value = false;

        assignUserActionList();

        console.log(userAccountStore.userAccount)
    });


    function assignUserActionList(){
        if(userAccountStore.userAccount?.roles.includes('ADMIN') && !userAccountStore.isAdminViewMode){
            actionItems.value = actionItemsAdmin;
            return;
        }

        if(!userAccountStore.userAccount?.roles.includes('ADMIN') || userAccountStore.isAdminViewMode){
            actionItems.value = actionItemsUser;
            return;
        }
    }

    function backToTable(){
        userAccountStore.isAdminViewMode = false;
        assignUserActionList();
    }



    //=====action-icons event listeners======
    function tempFunction(){
        console.log("test")
    }

    function viewUserAccount(){
        userAccountStore.isAdminViewMode = userAccountStore.isAdminViewMode ? false : true; 
        assignUserActionList();
    }

    function editUserAccount(){
        userAccountStore.isEditMode = userAccountStore.isEditMode ? false : true;
    }

    function disableEnableActionItem(action: string): boolean{
        if(!userAccountStore.userAccount?.roles.includes('ADMIN')){
            return false;
        }

        if(action == "add"){
            return false;
        }

        return !userAccountStore.isAccountSelected;
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