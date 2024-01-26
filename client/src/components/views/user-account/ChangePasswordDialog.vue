<template>
    <v-sheet elevation="2" class="password-form-container rounded-lg">
      <AlertMsg
            v-if="addError"
            :alertProps="{
                color: 'error',
                type: 'alert',
                textKey: 'changePassword-error'
            }">
        </AlertMsg>

        <div class="title-container text-h6">
            {{ $t("changePasswordDialog.title") }}
        </div>
        <v-form @keyup.enter="updateAccount()">

            <!-------------current password--------------->
            <v-text-field
                required
                :type="currentPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                :placeholder="$t('changePasswordDialog.currentPassword')"
                variant="outlined"
                v-model="currentPassword"
                class="pb-2">

                <template v-slot:append-inner>
                    <v-btn
                        density="compact"
                        variant="text"
                        :icon="currentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="currentPasswordVisible = !currentPasswordVisible">
                    </v-btn>
                </template>
            </v-text-field>
            <!----------------------------------->

            <!-------------new password--------------->
            <!--@vue-ignore-->
            <v-text-field
                required
                :type="newPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                :placeholder="$t('changePasswordDialog.newPassword')"
                variant="outlined"
                v-model="newPassword"
                :rules="[matchPasswordRule]"
                class="pb-2"
                >

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
            <!--@vue-ignore-->
            <v-text-field
                required
                :type="confirmNewPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                :placeholder="$t('changePasswordDialog.confirmPassword')"
                variant="outlined"
                v-model="confirmNewPassword"
                :rules="[matchPasswordRule]"
            >

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
</template>

<script setup lang="ts">
    import { ref, computed } from "vue";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";

    const emit = defineEmits<{
        closeAddDialog: any
    }>();

    const props = defineProps<{
      uuid: string
    }>();

    //error handling
    const addError = ref(false);

    //form fields
    const currentPassword = ref<string>("");
    const newPassword = ref<string>("");
    const confirmNewPassword = ref<string>("");

    //password icon logic
    const currentPasswordVisible = ref<boolean>(false);
    const newPasswordVisible = ref<boolean>(false);
    const confirmNewPasswordVisible = ref<boolean>(false);

    //change password logic
    function clearForm() {
        currentPassword.value = "";
        newPassword.value = "";
        confirmNewPassword.value = "";
        closeAddDialog(null);
    }

    async function updateAccount() {
      addError.value = false;
      try{
          const userAccount: UserAccount | null = await userAccountViewService.changePassword(props.uuid, currentPassword.value, newPassword.value, confirmNewPassword.value);
          
          if(userAccount == null) {
            addError.value = true;
            return;
          }

          currentPassword.value = "";
          newPassword.value = "";
          confirmNewPassword.value = "";
          closeAddDialog(userAccount)

      }catch(error){
          addError.value = true;
      }
    }

    function closeAddDialog(newUserAccount?: UserAccount | null){
        console.log("closeAddDialog emitting:", newUserAccount)
        emit("closeAddDialog", newUserAccount);
    }

    function matchPasswordRule(): string | boolean | undefined {
        if (newPassword.value != "" && confirmNewPassword.value != "") {
            return newPassword.value === confirmNewPassword.value || 'Passwords must match' || undefined
        }
    }
</script>

<style scoped>

    .title-container{
        margin-bottom: 20px;
    }

    .password-form-container{
        padding: 30px;
    }

</style>
