<template>
  <span
    class="batch"
    :class="{
      'batch--active': value,
      'batch--inactive': !value,
    }"
  >
    <span
      aria-hidden="true"
      :class="{
        icon: true,
        'icon--active': value,
        'icon--inactive': !value,
      }"
    >
      <CheckIcon v-if="value" class="icon__inner"></CheckIcon>
      <span v-if="!value" class="icon__inner">!</span>
    </span>

    {{ label }}
  </span>
</template>

<script>
import { computed } from "vue";
import { CheckIcon } from "@vue-hero-icons/solid";

export default {
  name: "StatusBadge",
  components: {
    CheckIcon,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    return { label: computed(() => (props.value ? "Active" : "Inactive")) };
  },
};
</script>

<style lang="scss" scoped>
.batch {
  @apply inline-flex;
  @apply relative;
  @apply z-0;
  @apply items-center;
  @apply border-l-8;
  @apply pl-1.5;

  @apply sm:border-0;
  @apply sm:pl-7;

  &.batch--active {
    @apply border-eth-green;
  }

  &.batch--inactive {
    @apply border-eth-red;
  }
}

.icon {
  @apply hidden;
  @apply sm:block;
  @apply absolute;
  @apply left-0;
  @apply h-6;
  @apply w-5;

  &::after {
    content: "";
    @apply block;
    @apply absolute;
    @apply z-20;
    @apply h-4;
    @apply w-4;
    @apply border;
    @apply border-white;
    @apply rounded-full;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .icon__inner {
    @apply block;
    @apply absolute;
    @apply z-10;
    @apply w-full;
    @apply text-white;
    @apply text-center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.icon--active {
    @apply bg-eth-green;

    .icon__inner {
      @apply w-3;
      @apply h-3;
    }
  }

  &.icon--inactive {
    @apply bg-eth-red;

    .icon__inner {
      @apply text-xs;
    }
  }
}
</style>
