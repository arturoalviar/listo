<template>
  <div class="relative">
    <button
      v-show="!isAdding"
      class="flex flex-row bg-transparent rounded-lg w-full p-2 mb-3 font-medium text-left text-sm leading-tight active:bg-input hover:bg-input focus:outline-none"
      @click.prevent="showAddInput"
    >
      <slot name="icon" />
      {{ buttonText }}
    </button>
    <input
      v-show="isAdding"
      ref="toggleInput"
      class="block bg-transparent rounded-lg w-full py-2 px-4 mb-3 font-medium leading-tight placeholder-input text-sm active:bg-input hover:bg-input focus:bg-input focus-within:bg-input focus:outline-none"
      type="text"
      @blur="handleBlur($event)"
      @keyup.esc="handleEsc"
      @keyup.enter="handleKeyupEnter($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'app-toggle-input',
})
export default class AppDrag extends Vue {
  @Prop() buttonText!: string

  isAdding = false

  $refs!: {
    toggleInput: HTMLInputElement
  }

  showAddInput() {
    this.isAdding = true
    this.$nextTick(() => this.$refs.toggleInput.focus())
  }

  handleEsc(event: KeyboardEvent) {
    const currentTarget = event.target as HTMLInputElement

    this.isAdding = false
    currentTarget.value = ''
  }

  handleBlur(event: KeyboardEvent) {
    const currentTarget = event.target as HTMLInputElement
    const value = currentTarget.value

    if (value.length) {
      this.$emit('blur', value)
    }
    this.isAdding = false
    currentTarget.value = ''
  }

  handleKeyupEnter(event: KeyboardEvent) {
    const currentTarget = event.target as HTMLInputElement
    const value = currentTarget.value

    if (value.length) {
      this.$emit('keyup-enter', value)
      this.isAdding = false
      currentTarget.value = ''
    }
  }
}
</script>
