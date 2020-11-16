import Vue from 'vue'
import Component from 'vue-class-component'

import { keyCodes } from '@/utils/helpers'

@Component({
  name: 'escapable',
})
export default class EscapableMixin extends Vue {
  created() {
    if (typeof window !== 'undefined') {
      document.addEventListener('keyup', this.handleEscKey)
    }
  }

  beforeDestroy() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keyup', this.handleEscKey)
    }
  }

  isEscKey(keycode: number) {
    return keycode === keyCodes.esc
  }

  handleEscKey({ key }: KeyboardEvent) {
    return
  }
}
