<template>
    <div class="table-container">

        <table v-if="groups" class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Start-Time</th>
                </tr>
            </thead>
            <tbody id="table-body">

                <tr v-for="group in groups" :key="group.id" @dblclick="openGalleryView(group)">
                    <td>{{ group.name }}</td>
                    <td>{{ group.description }}</td>
                    <td>{{ group.creationTime }}</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import {ref, onBeforeMount} from "vue";
    import * as groupService from "../../services/groupService";
    import router from "@/router";

    const groups = ref<Group[]>();

    onBeforeMount(async () => {
        try {
            groups.value = await groupService.getGroups();

        } catch (error) {
            //todo: add better error handling
            console.error(error);
        }

    });

    function openGalleryView(group: Group){
        router.push({
            path: "/galleryView/" + group.uuid
        })
    }


</script>

<style>
.table-container {
    width: 50%;
}
</style>