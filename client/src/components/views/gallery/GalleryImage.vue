<template>
    <v-hover v-slot="{isHovering, props}">
        <!--todo: add max height  -->
        <v-img
            v-if="screenshot"
            v-bind="props"
            class="img-styling"
            :aspect-ratio="16/9"
            :class="{'on-hover': isHovering}"
            :src="galleryViewService.createImageLinkWithToken(screenshot, timestamp)">

            <div v-if="isHovering" class="hover-overlay d-flex">
                <v-row>
                    <v-col >
                        <div v-if="appBarStore.galleryIsMetadataEnabled">
                            <v-expansion-panels color="#404040">
                                <v-expansion-panel
                                    title="Metadata">
                                    <v-expansion-panel-text>
                                        <v-row v-for="(value, key) in galleryViewService.getScreenshotMetadata(screenshot.metaData)" :key="key" no-gutters>
                                            <v-col>
                                                {{key}}
                                            </v-col>
                                            <v-col>
                                                {{value}}
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                    </v-col>
                </v-row>

                <v-row align="end">
                    <v-col>
                        <v-sheet class="d-flex pa-2 button-row">
                            <div v-if="appBarStore.galleryIsNameEnabled" class="text-body-1 title-box">
                                {{screenshot.clientName.substring(0, 8)}}
                            </div>
                            <v-spacer></v-spacer>
                            <span>
                                <v-btn 
                                    rounded="sm" 
                                    color="white" 
                                    variant="outlined" 
                                    icon="mdi-arrow-expand"
                                    size="small"
                                    @click="openDialog()">
                                </v-btn>

                                <v-btn
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    icon="mdi-video"
                                    size="small"
                                    @click="galleryViewService.navigateToProctoringView(screenshot, groupUuid)">
                                </v-btn>
                            </span>
                        </v-sheet>
                    </v-col>
                </v-row>
            </div>
        </v-img>

        <v-img 
            v-else 
            class="content-filler"
            :aspect-ratio="16/9"
            :src="galleryViewService.createImageLinkWithToken(screenshot, timestamp)">
        </v-img>

    </v-hover>

    <v-dialog v-model="dialog" max-width="1500">
        <v-card>
            <v-img 
                class="img-styling"
                :aspect-ratio="16/9"
                :src="expandedScreenshotLink">
            </v-img>
        </v-card>
    </v-dialog>

</template>


<script setup lang="ts">
    import { ref, computed } from "vue";
    import * as galleryViewService from "@/services/component-services/galleryViewService";
    import { useAppBarStore } from "@/store/app";


    //props
    const props = defineProps<{
        screenshot: Screenshot | undefined,
        timestamp: number,
        groupUuid: string
    }>();

    //store
    const appBarStore = useAppBarStore();

    //ref
    const dialog = ref(false);


    function openDialog() {
        dialog.value = true;
    }

    const expandedScreenshotLink = computed<string>(() => {
        return galleryViewService.createImageLinkWithToken(props.screenshot, props.timestamp);
    });

</script>

<style scoped>

    .img-styling{
        background-color: black;
    }

    .img-styling .hover-overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        background-color: rgba(255, 255, 255, 0.3);
        flex-direction: column;
        justify-content: space-between;
    }

    .button-row {
        background-color: #404040;
        align-items: center;
        justify-content: center;
    }

    .title-box{
        color: white;
    }

    .content-filler{
        visibility: hidden;
    }

</style>