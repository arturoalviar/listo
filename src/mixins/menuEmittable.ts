import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'menu-emittable',
})
export default class MenuEmittableMixin extends Vue {
  emitClose() {
    this.$emit('close')
  }

  emitAddItem() {
    this.$emit('add-item')
  }

  emitDelete() {
    this.$emit('delete')
  }

  emitEditName() {
    this.$emit('edit-name')
  }
}
