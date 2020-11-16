<template>
  <div>
    <transition name="fade">
      <div
        v-if="isActive"
        class="listo-modal-wrapper fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center"
        :class="modalClasses"
        @click.self="hideModal"
      >
        <div
          class="listo-modal relative bg-card flex w-full max-w-lg rounded overflow-hidden shadow-lg px-8 py-10"
        >
          <AppCloseButton class="p-2" @click="hideModal" />
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import escapable from '@/mixins/escapable'
import toggleable from '@/mixins/toggleable'

@Component({
  name: 'app-modal',
})
export default class AppModal extends mixins(toggleable, escapable) {
  @Prop(Boolean) isTop!: boolean
  @Prop(Boolean) noBg!: boolean

  get modalClasses() {
    return {
      'is-top': !!this.isTop,
      'no-bg': !!this.noBg,
    }
  }

  handleEscKey({ keyCode }: KeyboardEvent) {
    if (this.isActive && this.isEscKey(keyCode)) {
      this.hideModal()
    }
  }

  hideModal() {
    this.isActive = false
    this.$emit('close')
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-modal.css';
</style>
