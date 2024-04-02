<template>
    <v-hover v-slot="{isHovering, props}" >
        <!--todo: add max height  -->
        <v-img
            eager
            v-if="screenshot"
            v-bind="props"
            class="img-styling"
            :aspect-ratio="16/9"
            :class="{'on-hover': isHovering}"

            :src="liveService.getLatestImageLink(screenshot, timestamp.toString())">

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
                            <div class="text-body-1 title-box">
                                <template v-if="appBarStore.galleryIsNameEnabled">{{screenshot.clientName}}</template>
                                <template v-if="appBarStore.galleryIsNameEnabled && appBarStore.galleryIsIpEnabled"> / </template>
                                <template v-if="appBarStore.galleryIsIpEnabled">{{screenshot.clientIp}}</template>
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
            eager
            class="content-filler"
            :aspect-ratio="16/9"
            :src="liveService.getLatestImageLink(screenshot, timestamp.toString())">
        </v-img>

    </v-hover>

    <v-dialog v-model="dialog" max-width="1500">
        <v-card>
            <v-img 
                eager
                class="img-styling"
                :aspect-ratio="16/9"
                :src="expandedScreenshotLink">
            </v-img>
        </v-card>
    </v-dialog>

</template>


<script setup lang="ts">
    import { ref, computed, watch } from "vue";
    import * as galleryViewService from "@/services/component-services/galleryViewService";
    import * as liveService from "@/services/component-services/liveService";
    import { useAppBarStore } from "@/store/app";
    import { useFocus } from '@vueuse/core'


    //props
    const props = defineProps<{
        screenshot: ScreenshotData | undefined,
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
        return liveService.getLatestImageLink(props.screenshot, props.timestamp.toString());
    });

    // tabindex="0"
    // @focusin="isTabFocused = true"
    // @focusout="isTabFocused = false"

    // // const isTabFocused = computed<boolean>(() => {
    // //     return 
    // // });

    // const isTabFocused = ref<boolean>(false);

    // const target = ref()
    // const { focused } = useFocus(target)

    // watch(focused, (focused) => {
    //     if (focused){
    //         isTabFocused.value = true;
    //     }
    //     else {
    //         isTabFocused.value = false;

    //     }
    // });

    // function focusTabEvent(event: FocusEvent){
    //     console.log(event)
    //     isTabFocused.value = true;
    // }



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