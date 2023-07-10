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
                        <label for="user-name" class="sr-only">UserName</label>
                        <input id="user-name" v-model="userName" name="user-name" type="text" autocomplete="off" required
                            class="login__input" placeholder="User Name" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" v-model="password" name="password" type="password" autocomplete="off" required
                            class="login__input" placeholder="Password" />
                    </div>
                </div>
                <ActionButton type="submit" label="Sign In" :full="true"></ActionButton>
            </form>

        </div>
    </main>
</template>
  
<script>
import AlertMsg from "@/components/general/AlertMsg";
import ActionButton from "@/components/general/ActionButton";

export default {
    name: "LoginPage",
    components: { ActionButton, AlertMsg },
    setup() {
        // const { isAuthenticated, authenticateUser } = useAuth();

        // return {
        //     isAuthenticated,
        //     authenticateUser,
        // };
    },

    data() {
        // return {
        //     userName: undefined,
        //     password: undefined,
        //     loginError: false,
        // };
    },

    methods: {
        // async handleFormSubmit() {
        //     try {
        //         await this.authenticateUser(this.userName, this.password);
        //         this.$router.push({ name: "home" });
        //     } catch (error) {
        //         this.loginError = true;
        //     }
        // },
    },
};
</script>
  
<style lang="scss" scoped>
.login__input {
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
  