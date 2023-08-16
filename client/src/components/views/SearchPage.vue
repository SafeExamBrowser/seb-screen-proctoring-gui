<template>


    <div class="search-parent-container">
        <v-card class="search-container">
            <v-form>
                <v-row>
                    <v-col>
                        <v-responsive class="mx-auto" :max-width="FIELDS_WITH">
                            <v-text-field name="name1" label="label" id="id"></v-text-field>
                        </v-responsive>
                    </v-col>
                    <v-col>
                        <v-responsive class="mx-auto" :max-width="FIELDS_WITH">
                            <v-select
                                label="Select"
                                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']">   
                            </v-select>
                        </v-responsive>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-expansion-panels>
                            <v-expansion-panel title="Time filters">
                                <v-expansion-panel-text>

                                    <v-row>
                                        <v-col>
                                            <v-responsive class="mx-auto" :max-width="FIELDS_WITH">
                                                <v-text-field name="timeAmount" label="Last" id="id"></v-text-field>
                                            </v-responsive>
                                        </v-col>
                                        <v-col>
                                            <v-select
                                                label="Select"
                                                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']">   
                                            </v-select>
                                        </v-col>
                                    </v-row>

                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>



                
            </v-form>




        </v-card>

    </div>

</template>


<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import { useAppBarStore } from "@/store/app";


    const FIELDS_WITH: number = 600;


    const appBarStore = useAppBarStore();


    onBeforeMount(async () => {
        try {
            appBarStore.title = "Search"

        } catch (error) {
            console.error(error);
        }
    });




</script>

<style scoped>

    .search-parent-container{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search-container{
        padding: 10px;
        width: 75%;
    }


</style>