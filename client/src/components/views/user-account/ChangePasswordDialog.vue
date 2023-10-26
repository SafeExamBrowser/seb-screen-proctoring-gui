<template>
    <v-sheet elevation="2" class="password-form-container rounded-lg">
        <v-form>

            <!-------------password--------------->
            <v-text-field
                required
                :type="oldPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                placeholder="Password *"
                variant="outlined"
                v-model="oldPassword">

                <template v-slot:append-inner>
                    <v-btn
                        density="compact"
                        variant="text"
                        :icon="oldPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="oldPasswordVisible = !oldPasswordVisible">
                    </v-btn>
                </template>
            </v-text-field>
            <!----------------------------------->

            <!-------------new password--------------->
            <v-text-field
                required
                :type="newPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                placeholder="Confirm password *"
                variant="outlined"
                v-model="newPassword">

                <template v-slot:append-inner>
                    <v-btn
                        density="compact"
                        variant="text"
                        :icon="newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="newPasswordVisible = !newPasswordVisible">
                    </v-btn>
                </template>
            </v-text-field>

            <!-------------confirm new password--------------->
            <v-text-field
                required
                :type="confirmNewPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                placeholder="Confirm password *"
                variant="outlined"
                v-model="confirmNewPassword">

                <template v-slot:append-inner>
                    <v-btn
                        density="compact"
                        variant="text"
                        :icon="confirmNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="confirmNewPasswordVisible = !confirmNewPasswordVisible">
                    </v-btn>
                </template>
            </v-text-field>
            <!----------------------------------->

            <!-------------buttons--------------->
            <v-row>
                <v-col align="right">
                    <v-btn 
                        rounded="sm" 
                        color="black" 
                        variant="outlined">
                        <!-- @click="clearForm()"> -->
                        Cancel
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="primary" 
                        variant="flat" 
                        class="ml-2">
                        <!-- @click="updateAccount()"> -->
                        Save
                    </v-btn>
                </v-col>
            </v-row>
            <!----------------------------------->
        </v-form>
    </v-sheet>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";


    //form fields
    const oldPassword = ref<string>("");
    const newPassword = ref<string>("");
    const confirmNewPassword = ref<string>("");

    //password icon logic
    const oldPasswordVisible = ref<boolean>(false);
    const newPasswordVisible = ref<boolean>(false);
    const confirmNewPasswordVisible = ref<boolean>(false);


</script>

<style scoped>

    .password-form-container{
        padding: 20px;
    }

</style>