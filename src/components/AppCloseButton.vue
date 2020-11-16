<template>
  <button
    class="listo-close-button inline-flex items-center absolute top-0 right-0"
    aria-label="Close"
    @click="onClick"
  >
    <XIcon class="h-6 w-6" />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { XIcon } from 'vue-feather-icons'

@Component({
  name: 'app-close-button',
  components: {
    XIcon,
  },
})
export default class AppCloseButton extends Vue {
  onClick() {
    this.$emit('click')
  }
}
</script>

<style lang="css" scoped>
.listo-close-button {
  &:focus {
    @apply outline-none;
  }

  & svg {
    stroke: theme(colors.text);
  }
}
</style>
