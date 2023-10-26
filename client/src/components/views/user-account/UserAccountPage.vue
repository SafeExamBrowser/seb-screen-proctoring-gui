<template>
    <div class="account-parent-container">
        <v-sheet elevation="4" class="account-container rounded-lg">
            <v-row>

                <v-col cols="2">
                </v-col>

                <v-col>
                    <!-----------admin---------->
                    <template v-if="userAccountStore.userAccount?.roles.includes('ADMIN')">
                        <UserList></UserList>
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
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, computed } from "vue";
    import { useAppBarStore, useUserAccountStore } from "@/store/app";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import UserList from "./UserList.vue";
    import {navigateTo} from "@/router/navigation";

    //reactive variables
    const isLoading = ref<boolean>(true);

    //store
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //action lists
    const actionItems: {text: string, icon: string, action: string, event: Function}[] = [
        { text: "View User Account", icon: "mdi-account-eye", action: "view", event: viewUserAccount},
        { text: "Deactivate User Account", icon: "mdi-account-cancel", action: "deactivate", event: tempFunction},
        { text: "Add User Account", icon: "mdi-account-plus", action: "add", event: tempFunction},
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
    function tempFunction(){
        console.log("test")
    }

    function viewUserAccount(){
        navigateTo("/account/" + userAccountStore.selectedAccountId);
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