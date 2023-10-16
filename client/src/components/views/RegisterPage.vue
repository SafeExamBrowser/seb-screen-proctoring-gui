<template>
    <main id="main-content" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">

            <div>
                <img class="mx-auto h-12 w-auto" src="/img/logo.svg" alt="Logo ETH Zürich" />
                <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register
                </h1>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Please fill the form to register for a SEB screen proctoring account.
                </p>
            </div>

            <AlertMsgOld v-if="loginError" title="Login failed"
                message="Please provide a correct pair of user name and password."></AlertMsgOld>

            <form class="mt-8 space-y-6" action="#" method="POST" @submit.prevent="register">
                <div class="space-y-3">

                    <!--name-->
                    <div>
                        <label for="username" class="sr-only">Name</label>
                        <input v-model="name" name="name" type="text" autocomplete="off" required
                            class="login_input" placeholder="Name *" />
                    </div>

                    <!--surname-->
                    <div>
                        <label for="username" class="sr-only">Surname</label>
                        <input v-model="surname" name="surname" type="text" autocomplete="off" required
                            class="login_input" placeholder="Surname *" />
                    </div>

                    <!--username-->
                    <div>
                        <label for="username" class="sr-only">Username</label>
                        <input v-model="username" name="username" type="text" autocomplete="off"
                            class="login_input" placeholder="Username *" />
                    </div>

                    <!--email-->
                    <div>
                        <label for="username" class="sr-only">Email</label>
                        <input v-model="email" name="email" type="text" autocomplete="off"
                            class="login_input" placeholder="Email" />
                    </div>

                    <!--language-->
                    <!-- <div>
                        <label for="username" class="sr-only">Username</label>
                        <input v-model="username" name="username" type="text" autocomplete="off" required
                            class="login_input" placeholder="Username" />
                    </div> -->

                    <!--time zone-->
                    <div>
                        <label for="username" class="sr-only">Time zone</label>
                        <input v-model="timeZone" name="timeZone" type="text" autocomplete="off"
                            class="login_input" placeholder="Time zone" />
                    </div>

                    <!--password-->
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input v-model="password" name="password" type="password" autocomplete="off" required
                            class="login_input" placeholder="Password *" />
                    </div>

                    <!--confirm password-->
                    <div>
                        <label for="password" class="sr-only">Confirm password</label>
                        <input v-model="confirmPassword" name="confirmPassword" type="password" autocomplete="off" required
                            class="login_input" placeholder="Confirm password *" />
                    </div>

                </div>
                <ActionButton type="submit" label="Register" :full="true"></ActionButton>
            </form>

            <div class="text-center">
                <span>
                    Already have an account?
                </span>
                <span 
                    class="text-decoration-underline text-blue"
                    role="button" 
                    tabindex="0" 
                    @keydown="handleTabKeyEvent($event, 'navigate')">
                    <router-link to="/">Login</router-link>
                </span>
            </div>

        </div>
    </main>
</template>
  
<script setup lang="ts">
    import { ref } from "vue";
    import AlertMsgOld from "@/components/widgets/AlertMsgOld.vue";
    import ActionButton from "@/components/widgets/ActionButton.vue";
    import * as userAccountService from "@/services/api-services/userAccountService";
    import router from "@/router";

    //form fields
    const name = ref("");
    const surname = ref("");
    const username = ref("");
    const email = ref();
    const timeZone = ref();
    const password = ref("");
    const confirmPassword = ref("");

    //error ref
    const loginError = ref(false);


    async function register(){

        try{
            const userAccount: object = await userAccountService.register(name.value, surname.value, username.value, password.value, confirmPassword.value, email.value, timeZone.value);
            console.log(userAccount)


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
                navigateToLoginView();
            }
        }
    }

    function navigateToLoginView(){
        router.push({
            path: "/"
        });
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