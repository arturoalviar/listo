<template>
  <button class="listo-button" :class="classes" @click="onClick">
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'app-button',
})
export default class AppButton extends Vue {
  @Prop() private variant!: string
  @Prop(Boolean) full!: boolean

  get classes() {
    return {
      'is-full': !!this.full,
      [this.variantClass]: true,
    }
  }

  get variantClass() {
    switch (this.variant) {
      case 'primary':
        return 'is-primary'
      case 'success':
        return 'is-success'
      case 'danger':
        return 'is-danger'
      case 'text':
        return 'is-text'
      default:
        return 'is-default'
    }
  }

  onClick() {
    this.$emit('click')
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-button.css';
</style>
