<template>
  <div class="rounded-sm bg-red-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0" aria-hidden="true">
        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XCircleIcon } from "@vue-hero-icons/solid" 

export default {
  name: "AlertMsg",
  components: { XCircleIcon },
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>
