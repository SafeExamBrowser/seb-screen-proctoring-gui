<template>
    <main id="main-content" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">

            <div>
                <img class="mx-auto h-12 w-auto" src="/img/logo.svg" alt="Logo ETH Zürich" />
                <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in
                </h1>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Please fill the form to sign in to your SEB server account.
                </p>
            </div>

            <AlertMsg v-if="loginError" title="Login failed"
                message="Please provide a correct pair of user name and password."></AlertMsg>

            <form class="mt-8 space-y-6" action="#" method="POST" @submit.prevent="handleFormSubmit">
                <div class="space-y-3">
                    <div>
                        <label for="username" class="sr-only">Username</label>
                        <input v-model="username" name="username" type="text" autocomplete="off" required
                            class="login_input" placeholder="Username" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input v-model="password" name="password" type="password" autocomplete="off" required
                            class="login_input" placeholder="Password" />
                    </div>
                </div>
                <ActionButton type="submit" label="Sign In" :full="true"></ActionButton>
            </form>

        </div>
    </main>
</template>
  
<script setup lang="ts">
    import { ref } from "vue";
    import AlertMsg from "../widgets/AlertMsg.vue";
    import ActionButton from "../widgets/ActionButton.vue";
    import * as authenticationService from "../../services/authenticationService";
    import router from "@/router";


    const username = ref("super-admin");
    const password = ref("admin");
    const loginError = ref(false);

    async function handleFormSubmit(){

        try{
            const token: string = await authenticationService.login(username.value, password.value);
            localStorage.setItem("token", token);

            console.log("token: " + token)

            router.push({
                path: "/start"
            })


        }catch(error){
            //todo: add better error handling
            loginError.value = true;
            console.error(error)
        }

    }


</script>
  







<style lang="scss" scoped>
.login_input {
    @apply appearance-none;
    @apply rounded-none;
    @apply relative;
    @apply block;
    @apply w-full;
    @apply px-2;
    @apply py-1.5;
    @apply rounded-sm;
    @apply placeholder-gray-500;
    @apply text-gray-900;
    @apply border-gray-300;
    //@apply focus: border-primary-600;
    //@apply sm: text-sm;
}
</style>
  ../../services/authenticationService