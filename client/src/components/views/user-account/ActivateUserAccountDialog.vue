<template>

    <v-sheet elevation="2" class="activate-account-container rounded-lg">

        <div v-if="!isActive" class="title-container text-h6">
            Activate User: {{ userAccount?.username }}
        </div>

        <div v-else class="title-container text-h6">
            Deactivate User: {{ userAccount?.username }}
        </div>

        <v-row>
            <v-col align="right">
                <v-btn 
                    rounded="sm" 
                    color="black" 
                    variant="outlined"
                    @click="closeActivateDialog(false)">
                    Cancel
                </v-btn>

                <v-btn 
                    rounded="sm" 
                    color="primary" 
                    variant="flat" 
                    class="ml-2"
                    @click="confirmEvent()">
                    Confirm
                </v-btn>
            </v-col>
        </v-row>

    </v-sheet>

    <AlertMsg 
        v-if="isError"
        :alertProps="{
            textKey: 'api-error',
            color: 'error',
            type: 'snackbar',
        }">
    </AlertMsg>

</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";


    const props = defineProps<{
        accountId: number,
    }>();

    const emit = defineEmits<{
        closeActivateDialog: any
    }>();
    
    const isActive = ref<boolean>(true);
    const isError = ref<boolean>(false);
    const userAccount = ref<UserAccount>();


    onBeforeMount(async () => {
        userAccount.value = await userAccountViewService.getUserAccountById(props.accountId.toString());

        //if there is a terminatation time --> user is inactive
        if(userAccount.value?.terminationTime){
            isActive.value = false;
        }
    });


    async function confirmEvent(){
        isError.value = false;

        if(!isActive.value){
            await activateAccount();
            return;
        }

        await deactivateAccount();
    }


    async function activateAccount(){
        const userAccountResponse: UserAccount | null = await userAccountViewService.activateUserAccount(props.accountId.toString());

        if(userAccountResponse == null){
            isError.value = true;
            return;
        }

        closeActivateDialog(true, userAccountResponse.id, null);
    }

    async function deactivateAccount(){
        const userAccountResponse: UserAccount | null = await userAccountViewService.deactivateUserAccount(props.accountId.toString());

        if(userAccountResponse == null){
            isError.value = true;
            return;
        }

        closeActivateDialog(true, userAccountResponse.id, userAccountResponse.terminationTime);
    }

    function closeActivateDialog(isUpdated: boolean, accountId?: number, terminationTime?: number | null){
        emit("closeActivateDialog", isUpdated, accountId, terminationTime);
    }

</script>

<style scoped>

    .title-container{
        margin-bottom: 20px;
    }

    .activate-account-container{
        padding: 20px;
    }

</style>