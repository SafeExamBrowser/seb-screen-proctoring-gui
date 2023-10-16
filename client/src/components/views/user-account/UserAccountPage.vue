<template>
    <v-row>

        <v-col>

            <v-data-table>



                
            </v-data-table>



        </v-col>


        <v-col cols="2">

            <!-- <v-card color="#e2ecf7"> -->
            <v-card>
                <v-card-title>Actions</v-card-title>
                <v-list density="compact">

                    <v-list-item
                        v-for="(item, i) in actionItem"
                        :key="i"
                        :value="item"
                        color="primary"
                    >
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>

                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item>
                </v-list>



            </v-card>


        </v-col>






    </v-row>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, computed } from "vue";
    import { useAppBarStore } from "@/store/app";


    //reactive variables


    //remaining
    const appBarStore = useAppBarStore();

    //action list
    const actionItem: {text: string, icon: string}[] = [
        { text: "View User Account", icon: "mdi-account-eye" },
        { text: "Edit User Account", icon: "mdi-account-edit" },
        { text: "Deactivate User Account", icon: "mdi-account-cancel" },
        { text: "Add User Account", icon: "mdi-account-plus" },
    ];




    onBeforeMount(() => {
        appBarStore.title = "Account";
    });




</script>