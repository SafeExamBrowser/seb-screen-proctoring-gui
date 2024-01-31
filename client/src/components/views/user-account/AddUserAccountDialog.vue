<template>
    <v-card class="pa-10">
        <AlertMsg 
            v-if="addError"
            :alertProps="{
                color: 'error',
                type: 'alert',
                textKey: 'register-error'
            }">
        </AlertMsg>

        <AlertMsg 
            v-if="addSuccess"
            :alertProps="{
                color: 'success',
                type: 'alert',
                textKey: 'register-success'
            }">
        </AlertMsg>

        <v-card-title>
            Add account
        </v-card-title>

        <v-card-text>
            <v-form @keyup.enter="addNewAccount()">

                <!--name-->
                <v-text-field
                    required
                    prepend-inner-icon="mdi-account-outline"
                    density="compact"
                    placeholder="Name *"
                    variant="outlined"
                    v-model="name">
                </v-text-field>

                <!--surname-->
                <v-text-field
                    required
                    prepend-inner-icon="mdi-account-outline"
                    density="compact"
                    placeholder="Surname *"
                    variant="outlined"
                    v-model="surname">
                </v-text-field>

                <!--username-->
                <v-text-field
                    required
                    prepend-inner-icon="mdi-account-outline"
                    density="compact"
                    placeholder="Username *"
                    variant="outlined"
                    v-model="username">
                </v-text-field>

                <!--email-->
                <v-text-field
                    prepend-inner-icon="mdi-email-outline"
                    density="compact"
                    placeholder="Email"
                    variant="outlined"
                    v-model="email">
                </v-text-field>

                <!--timezone-->
                <v-text-field
                    prepend-inner-icon="mdi-map-clock-outline"
                    density="compact"
                    placeholder="Time zone"
                    variant="outlined"
                    v-model="timeZone">
                </v-text-field>

                <!--password-->
                <v-text-field
                    required
                    :type="passwordVisible ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    density="compact"
                    placeholder="Password *"
                    variant="outlined"
                    v-model="password">

                    <template v-slot:append-inner>
                        <v-btn
                            density="compact"
                            variant="text"
                            :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                            @click="passwordVisible = !passwordVisible">
                        </v-btn>
                    </template>
                </v-text-field>

                <!--confirm password-->
                <v-text-field
                    required
                    :type="confirmPasswordVisible ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    density="compact"
                    placeholder="Confirm password *"
                    variant="outlined"
                    v-model="confirmPassword">

                    <template v-slot:append-inner>
                        <v-btn
                            density="compact"
                            variant="text"
                            :icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                            @click="confirmPasswordVisible = !confirmPasswordVisible">
                        </v-btn>
                    </template>
                </v-text-field>

                <!-------------buttons--------------->
                <v-row>
                    <v-col align="right">
                        <v-btn 
                            rounded="sm" 
                            color="black" 
                            variant="outlined"
                            @click="closeAddDialog()">
                            Cancel
                        </v-btn>

                        <v-btn 
                            rounded="sm" 
                            color="primary" 
                            variant="flat" 
                            class="ml-2"
                            @click="addNewAccount()">
                            Save
                        </v-btn>
                    </v-col>
                </v-row>
                <!----------------------------------->
            </v-form>



        </v-card-text>
    </v-card>

</template>

<script setup lang="ts">
    import { ref } from "vue";
    import * as userAccountService from "@/services/api-services/userAccountService";
    import {navigateTo} from "@/router/navigation";

    const emit = defineEmits<{
        closeAddDialog: any
    }>();

    //form fields
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timeZone = ref<string>();
    const password = ref<string>("");
    const confirmPassword = ref<string>("");

    //error handling
    const addError = ref(false);
    const addSuccess = ref(false);

    //password icon logic
    const passwordVisible = ref<boolean>(false);
    const confirmPasswordVisible = ref<boolean>(false);


    async function addNewAccount(){
        addError.value = false;
        addSuccess.value = false;

        try{
            const userAccount: UserAccount = await userAccountService.register(name.value, surname.value, username.value, password.value, confirmPassword.value, email.value, timeZone.value);
            addSuccess.value = true;

            closeAddDialog(userAccount)

        }catch(error){
            //todo: add better error handling
            console.error(error)
            addError.value = true;
        }

    }

    function closeAddDialog(newUserAccount?: UserAccount){
        emit("closeAddDialog", newUserAccount);
    }
</script>