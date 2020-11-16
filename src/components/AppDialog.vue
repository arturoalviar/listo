<template>
  <div v-if="isOpen" class="listo-dialog-overlay" @click.self="cancel">
    <div class="listo-dialog">
      <div class="mb-4">
        <h2 class="listo-card-heading mb-4">{{ title }}</h2>
        <p v-if="!!description">{{ description }}</p>
      </div>
      <div class="relative flex flex-row justify-end w-full">
        <AppButton class="ml-4 uppercase" variant="text" @click="cancel"
          >Cancel</AppButton
        >
        <AppButton
          class="ml-4 uppercase"
          :variant="variant"
          @click="resolveAction"
          >{{ actionLabel }}</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import escapable from '@/mixins/escapable'

@Component({
  name: 'app-dialog',
})
export default class AppDialogComponent extends mixins(escapable) {
  isOpen = false
  title = ''
  description = ''
  actionLabel = ''
  variant = ''
  resolve!: (value: boolean) => void
  reject!: (value: boolean) => void

  open(payload: {
    title: string
    description: string
    actionLabel: string
    variant: string
  }) {
    const { title, description, actionLabel, variant } = payload
    this.isOpen = true
    this.title = title
    this.description = description
    this.actionLabel = actionLabel
    this.variant = variant
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  resolveAction() {
    this.resolve(true)
    this.isOpen = false
  }

  cancel() {
    this.resolve(false)
    this.isOpen = false
  }

  handleEscKey() {
    this.isOpen = false
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-dialog.css';
</style>
