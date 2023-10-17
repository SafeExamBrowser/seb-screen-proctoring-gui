<template>
    <v-main>
        <v-container class="fill-height d-flex align-center justify-center">

            <v-card class="pa-10">
                <div class="d-flex ml-15 mr-15">
                    <img src="/img/logo.svg" alt="Logo ETH Zürich" />
                </div>

                <div class="mt-10">
                    <AlertMsg 
                        v-if="loginError"
                        :alertProps="{
                            color: 'error',
                            type: 'alert',
                            textKey: 'login-error'
                        }">
                    </AlertMsg>
                </div>
                
                <v-card-title class="mt-10">
                    Sign in
                </v-card-title>
                <v-card-subtitle>Please fill the form to sign in to your SEB screen proctoring account.</v-card-subtitle>

                <v-card-text>
                    <v-form @keyup.enter="signIn()">
                        <v-text-field
                            prepend-inner-icon="mdi-account-outline"
                            density="compact"
                            placeholder="Username *"
                            variant="outlined"
                            v-model="username">
                        </v-text-field>

                        <v-text-field
                            :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="passwordVisible ? 'text' : 'password'"
                            @click:append-inner="passwordVisible = !passwordVisible"
                            prepend-inner-icon="mdi-lock-outline"
                            density="compact"
                            placeholder="Password *"
                            variant="outlined"
                            v-model="password">
                        </v-text-field>

                        <v-btn
                            block
                            rounded="sm" 
                            color="primary"
                            @click="signIn()">
                            {{ $t("navigation.sign-in") }}
                        </v-btn>

                    </v-form>

                    <div class="text-center mt-7">
                        <span>
                            No Account? 
                        </span>
                        <span 
                            class="text-decoration-underline text-blue"
                            role="button" 
                            tabindex="0" 
                            @keydown="handleTabKeyEvent($event, 'navigate')">
                            <router-link to="/register">Register</router-link>
                        </span>
                    </div>

                </v-card-text>

            </v-card>

        </v-container>
    </v-main>
</template>
  
<script setup lang="ts">
    import { ref } from "vue";
    import * as authenticationService from "@/services/api-services/authenticationService";
    import router from "@/router";
    import { useLoadingStore, useAuthStore } from "@/store/app";


    const username = ref("super-admin");
    const password = ref("admin");
    // const username = ref("");
    // const password = ref("");
    const loginError = ref(false);

    const passwordVisible = ref<boolean>(false);

    //store
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();

    async function signIn(){
        loginError.value = false;

        try{
            const tokenObject: Token = await authenticationService.login(username.value, password.value);
            authStore.login(tokenObject.access_token, tokenObject.refresh_token);

        }catch(error){
            //todo: add better error handling
            console.error(error)
            loginError.value = true;
        }

    }

    //todo: extract this function into a global file
    function handleTabKeyEvent(event: any, action: string){
        if (event.key == 'Enter' || event.key == ' ') {

            if(action == "navigate"){
                navigateToRegisterView();
            }
        }
    }

    function navigateToRegisterView(){
        router.push({
            path: "/register"
        });
    }


</script>
  

<style scoped>

</style>