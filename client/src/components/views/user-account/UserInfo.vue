<template>
    <template v-if="userAccount != null">
        <div class="user-info-page-container">

            <v-sheet elevation="4" class="user-info-container rounded-lg">
                <v-form :disabled="!userAccountStore.isEditMode">

                    <!-------------name--------------->
                    <v-row align="center">
                        <v-col cols="4">
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
        </div>
    </template>
</template>


<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import { useAppBarStore, useUserAccountStore } from "@/store/app";

    //props
    const props = defineProps<{
        userAccount: UserAccount | null,
        isEditMode: boolean
    }>();

    //stores
    const userAccountStore = useUserAccountStore();


    //page mode / navigation

    //form fields
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timeZone = ref<string>();
    const password = ref<string>("");
    const confirmPassword = ref<string>("");


    onBeforeMount(() => {
        userAccountStore.isEditMode = props.isEditMode;

        console.log(props.userAccount)

        if(props.userAccount != null){
            name.value = props.userAccount.name;
            surname.value = props.userAccount.surname;
            username.value = props.userAccount.username;
            email.value = props.userAccount.email;
            timeZone.value = props.userAccount.name;
        }else{
            
        }
    });


    //events
    function clearForm(){

    }

    function updateAccount(){

    }




</script>

<style scoped>

    .user-info-page-container{
        display: flex;
        justify-content: center;
    }

    .user-info-back-button-container{
        display: flex;
        justify-content: start;
    }

    .user-info-container{
        width: 60%;
        padding: 20px;
    }

</style>