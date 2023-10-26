<template>
    <div v-if="userAccount != null" class="user-info-parent-container">
        <v-sheet elevation="4" class="user-info-container rounded-lg">
            <v-row>

                <v-col cols="2">
                    <v-btn
                        v-if="userAccountStore.userAccount?.roles.includes('ADMIN')"
                        size="x-large"
                        variant="text" 
                        icon="mdi-arrow-left"
                        @click="navigateTo('/account')">
                    </v-btn>
                </v-col>

                <v-col>
                    <v-sheet elevation="2" class="user-form-container rounded-lg">
                        <v-form :disabled="!userAccountStore.isEditMode">
                            <!-------------name--------------->
                            <v-row align="center">
                                <v-col cols="4" align="end">
                                    Name:
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        density="compact"
                                        variant="outlined"
                                        v-model="name">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!-------------surname--------------->
                            <v-row align="center">
                                <v-col cols="4">
                                    Surname:
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        density="compact"
                                        variant="outlined"
                                        v-model="surname">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!-------------username--------------->
                            <v-row align="center">
                                <v-col cols="4">
                                    Username:
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        density="compact"
                                        variant="outlined"
                                        v-model="username">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!-------------email--------------->
                            <v-row align="center">
                                <v-col cols="4">
                                    Email:
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        density="compact"
                                        variant="outlined"
                                        v-model="email">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!-------------timezone--------------->
                            <v-row align="center">
                                <v-col cols="4">
                                    Time zone:
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        density="compact"
                                        variant="outlined"
                                        v-model="timeZone">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!-------------buttons--------------->
                            <v-row v-if="userAccountStore.isEditMode">
                                <v-col align="right">
                                    <v-btn 
                                        rounded="sm" 
                                        color="black" 
                                        variant="outlined"
                                        @click="clearForm()">
                                        Cancel
                                    </v-btn>

                                    <v-btn 
                                        rounded="sm" 
                                        color="primary" 
                                        variant="flat" 
                                        class="ml-2"
                                        @click="updateAccount()">
                                        Save
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <!----------------------------------->
                        </v-form>
                    </v-sheet>
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

        <v-dialog v-model="changePasswordDialog" max-width="1000">
            <ChangePasswordDialog></ChangePasswordDialog>
        </v-dialog>
    </div>

    <AlertMsg 
        v-else 
        :alertProps="{
            textKey: 'no-data',
            color: 'warning',
            type: 'alert',
        }">
    </AlertMsg>
    
</template>


<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import { useAppBarStore, useUserAccountStore } from "@/store/app";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useRoute } from "vue-router";
    import {navigateTo} from "@/router/navigation";
    import ChangePasswordDialog from "./ChangePasswordDialog.vue";


    //stores
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //form fields
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timeZone = ref<string>();
    const password = ref<string>("");
    const confirmPassword = ref<string>("");

    //action list
    const actionItems: {text: string, icon: string, action: string, event: Function,}[] = [
        { text: "Edit User Account", icon: "mdi-account-edit", action: "edit", event: editUserAccount},
        { text: "Change Password", icon: "mdi-lock", action: "change", event: changePassword}
    ];

    //remaining
    const userAccount = ref<UserAccount>();
    const accountId: string = useRoute().params.accountId.toString();
    const changePasswordDialog = ref(false);


    onBeforeMount(async () => {
        await assignUserAccount();
        appBarStore.title = "Account of " + userAccount.value?.name + " " + userAccount.value?.surname;
    });



    async function assignUserAccount(){
        await userAccountViewService.setPersonalUserAccount();

        if(!userAccountStore.userAccount?.roles.includes('ADMIN')){
            userAccount.value = userAccountStore.userAccount!;

        }else{
            userAccount.value = await userAccountViewService.getUserAccountById(accountId);
        }

        if(userAccount.value != null){
            name.value = userAccount.value.name;
            surname.value = userAccount.value.surname;
            username.value = userAccount.value.username;
            email.value = userAccount.value.email;
            timeZone.value = userAccount.value.name;
        }
    }


    //events
    function clearForm(){

    }

    function updateAccount(){

    }


    //=====action-icons event listeners======
    function editUserAccount(){
        userAccountStore.isEditMode = userAccountStore.isEditMode ? false : true;
    }

    function changePassword(){
        changePasswordDialog.value = true;
    }
    
    //==============================




</script>

<style scoped>

    .user-info-parent-container{
        display: flex;
        justify-content: center;
        align-items: center; 
    }

    /* .user-info-back-button-container{
        display: flex;
        justify-content: start;
    } */

    .user-info-container{
        width: 80%;
        padding: 20px;
    }

    .user-form-container{
        width: 80%;
        padding: 20px; 
    }

</style>