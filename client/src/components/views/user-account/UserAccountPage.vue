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
                        <UserInfo :userAccount="userAccountStore.userAccount!"> </UserInfo>
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


    //store
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //action lists
    const actionItems = ref<{text: string, icon: string}[]>();

    const actionItemsAdmin: {text: string, icon: string}[] = [
        { text: "View User Account", icon: "mdi-account-eye" },
        { text: "Edit User Account", icon: "mdi-account-edit" },
        { text: "Deactivate User Account", icon: "mdi-account-cancel" },
        { text: "Add User Account", icon: "mdi-account-plus" },
    ];

    const actionItemsUser: {text: string, icon: string}[] = [
        { text: "Edit User Account", icon: "mdi-account-edit" },
        { text: "Change Password", icon: "mdi-lock" },
    ];


    onBeforeMount(async () => {
        appBarStore.title = "Account";
        await userAccountViewService.setPersonalUserAccount();

        assignUserActionList();
    });

    function assignUserActionList(){
        if(userAccountStore.userAccount?.roles.includes('ADMIN')){
            actionItems.value = actionItemsAdmin;
            return;
        }

        actionItems.value = actionItemsUser;
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