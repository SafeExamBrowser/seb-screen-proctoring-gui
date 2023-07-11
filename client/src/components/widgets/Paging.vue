<!-- <template>
  <div class="wrapper">
    <div class="wrapper__inner">
      <template v-if="paging.totalItems.value > 0">
        <p class="summary" :aria-hidden="true">
          Showing
          {{ " " }}
          <span class="font-medium">{{ paging.firstVisibleItem.value }}</span>
          {{ " " }}
          to
          {{ " " }}
          <span class="font-medium">{{ paging.lastVisibleItem.value }}</span>
          {{ " " }}
          of
          {{ " " }}
          <span class="font-medium">{{ paging.totalItems.value }}</span>
          {{ " " }}
          results
        </p>
        <span class="sr-only"
          >Table showing {{ paging.firstVisibleItem.value }} to
          {{ paging.lastVisibleItem.value }} of
          {{ paging.totalItems.value }} results</span
        >
      </template>
      <p v-else class="summary">No results</p>

      <nav v-if="paging.totalPages.value > 1" class="nav" aria-label="Paging">
        <button
          class="item item--prev"
          :disabled="paging.prevPage.value === 0"
          @click="goToPage(paging.prevPage.value)"
        >
          <span class="sr-only">Go to previous page</span>
          <div aria-hidden="true">
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </div>
        </button>
        <button
          v-if="paging.showFirstPage.value"
          class="item"
          @click="goToPage(1)"
        >
          <span class="sr-only">Go to page </span>
          1
        </button>
        <span
          v-if="paging.showFillerAfterFirstPage.value"
          class="item item--filler"
          :aria-hidden="true"
          >...</span
        >
        <button
          v-if="paging.prevPage.value !== 0"
          class="item"
          @click="goToPage(paging.prevPage.value)"
        >
          <span class="sr-only">Go to page </span>
          {{ paging.prevPage.value }}
        </button>
        <span
          ref="currentPageNode"
          aria-current="page"
          class="item item--current"
        >
          <span class="sr-only">Page {{ paging.currentPage.value }}</span>
          <span :aria-hidden="true">{{ paging.currentPage.value }}</span>
        </span>
        <button
          v-if="paging.nextPage.value !== 0"
          class="item"
          @click="goToPage(paging.nextPage.value)"
        >
          <span class="sr-only">Go to page </span>
          {{ paging.nextPage.value }}
        </button>
        <span
          v-if="paging.showFillerBeforeLastPage.value"
          class="item item--filler"
          :aria-hidden="true"
          >...</span
        >
        <button
          v-if="paging.showLastPage.value"
          class="item"
          @click="goToPage(paging.totalPages.value)"
        >
          <span class="sr-only">Go to page </span>
          {{ paging.totalPages.value }}
        </button>
        <button
          class="item item--next"
          :disabled="paging.nextPage.value === 0"
          @click="goToPage(paging.nextPage.value)"
        >
          <span class="sr-only">Go to next page</span>
          <div aria-hidden="true">
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </div>
        </button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
//import { useInstitutions } from "@/composables/institution/useInstitutions";
import { ChevronLeftIcon, ChevronRightIcon } from "@vue-hero-icons/solid";
import { ref, watch } from "vue";
//import { focusElement } from "@/utils/focus";

export default {
  name: "Paging",
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  setup() {
    // const { paging } = useInstitutions();
    // const currentPageNode = ref(null);

    // const goToPage = (index) => {
    //   const stopWatching = watch(paging.currentPage, () => {
    //     focusElement(currentPageNode.value, 300);
    //     stopWatching();
    //   });

    //   paging.goToPage(index);
    // };

    // return {
    //   paging,
    //   goToPage,
    //   currentPageNode,
    // };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  @apply bg-white;
  @apply px-2;
  @apply py-3;
  @apply flex;
  @apply items-center;
  @apply justify-between;
  @apply sm:px-0;
}

.wrapper__inner {
  @apply flex-1;
  @apply flex;
  @apply items-center;
  @apply justify-between;
}

.summary {
  @apply text-sm;
  @apply text-gray-700;
}

.nav {
  @apply relative;
  @apply z-0;
  @apply inline-flex;
  @apply -space-x-px;
}

.item {
  @apply hidden;
  @apply relative;
  @apply items-center;
  @apply bg-white;
  @apply border-gray-300;
  @apply text-gray-500;
  @apply hover:bg-primary-50;
  @apply px-2.5;
  @apply py-1;
  @apply border;
  @apply text-sm;
  @apply font-normal;

  @apply sm:inline-flex;

  &:focus {
    @apply z-20;
  }

  &:disabled {
    @apply text-gray-200;
    @apply pointer-events-none;
  }

  &.item--current {
    @apply inline-flex;
    @apply z-10;
    @apply bg-primary-50;
    @apply border-primary-500;
    @apply text-primary-600;
    @apply font-medium;
  }

  &.item--filler {
    @apply pointer-events-none;
    @apply hover:bg-white;
  }

  &.item--prev {
    @apply inline-flex;
    @apply rounded-l-sm;
    @apply px-1;
  }

  &.item--next {
    @apply inline-flex;
    @apply rounded-r-sm;
    @apply px-1;
  }
}
</style> -->
