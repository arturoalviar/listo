<template>
  <div
    class="listo-snack bg-transparent flex flex-col items-end justify-end bottom-0 right-0 left-0 fixed h-full w-full z-50 pointer-events-none"
  >
    <transition name="fade">
      <div
        v-show="isActive"
        class="listo-snack-wrapper flex items-center relative p-2 pointer-events-auto shadow-lg mr-4 mb-4 border-l-4 border-transparent rounded"
        :class="classes"
      >
        <div class="listo-snack-content flex-grow py-2 px-4 text-sm">
          {{ message }}
        </div>
        <AppButton variant="text" @click="closeSnack">Close</AppButton>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import toggleable from '@/mixins/toggleable'
import { SnackbarVariant } from '@/types/snackbar'

const snackbarModule = namespace('snackbar')

@Component({
  name: 'app-snackbar',
})
export default class AppSnackbarComponent extends mixins(toggleable) {
  @snackbarModule.State message!: string
  @snackbarModule.State timeout!: number
  @snackbarModule.State variant!: SnackbarVariant
  @snackbarModule.Mutation CLOSE_SNACKBAR!: () => void
  activeTimeout = -1

  @Watch('isActive')
  onIsActiveChange() {
    this.setTimeout()
  }

  get classes() {
    return {
      [this.variantClass]: true,
    }
  }

  get variantClass() {
    switch (this.variant) {
      case 'success':
        return 'is-success'
      case 'error':
        return 'is-error'
      case 'warning':
        return 'is-warning'
      default:
        return 'is-info'
    }
  }

  setTimeout() {
    window.clearTimeout(this.activeTimeout)

    const timeout = Number(this.timeout)
    if (!this.isActive) return

    this.activeTimeout = window.setTimeout(() => {
      this.CLOSE_SNACKBAR()
      this.isActive = false
    }, timeout)
  }

  closeSnack() {
    this.CLOSE_SNACKBAR()
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-snackbar.css';
</style>
