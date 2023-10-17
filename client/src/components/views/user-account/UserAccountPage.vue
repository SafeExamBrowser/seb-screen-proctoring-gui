<template>
    <div class="account-parent-container">
        <v-sheet elevation="4" class="account-container rounded-lg">
            <v-row>

                <v-col>
                    <template v-if="userAccountStore.userAccount?.roles.includes('ADMIN')">

                        admin
                        <!-- <v-data-table>



                            
                        </v-data-table>  -->



                    </template>

                    <template v-else>
                        <template v-if="!isLoading">
                            <UserInfo :userAccount="userAccountStore.userAccount!" :isEditMode="false"> </UserInfo>
                        </template>
                    </template>
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


    //reactive variables
    const isLoading = ref<boolean>(true);


    //store
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //action lists
    const actionItems = ref<{text: string, icon: string, event: Function}[]>();

    const actionItemsAdmin: {text: string, icon: string, event: Function}[] = [
        { text: "View User Account", icon: "mdi-account-eye", event: tempFunction},
        { text: "Edit User Account", icon: "mdi-account-edit", event: tempFunction},
        { text: "Deactivate User Account", icon: "mdi-account-cancel", event: tempFunction},
        { text: "Add User Account", icon: "mdi-account-plus", event: tempFunction},
    ];

    const actionItemsUser: {text: string, icon: string, event: Function}[] = [
        { text: "Edit User Account", icon: "mdi-account-edit", event: editUserAccount},
        { text: "Change Password", icon: "mdi-lock", event: tempFunction}
    ];


    onBeforeMount(async () => {
        appBarStore.title = "Account";
        await userAccountViewService.setPersonalUserAccount();
        isLoading.value = false;

        assignUserActionList();

        console.log(userAccountStore.userAccount)
    });

    function assignUserActionList(){
        if(userAccountStore.userAccount?.roles.includes('ADMIN')){
            actionItems.value = actionItemsAdmin;
            return;
        }

        actionItems.value = actionItemsUser;
    }

    //action-icons event listeners
    function tempFunction(){
        console.log("test")

    }

    function editUserAccount(){
        userAccountStore.isEditMode = userAccountStore.isEditMode ? false : true;
    }

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