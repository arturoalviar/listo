import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'menu-toggleable',
})
export default class MenuToggleableMixin extends Vue {
  @Prop({ default: false }) isOpen!: boolean

  isDropdownOpen = !!this.isOpen

  showDropdown() {
    this.isDropdownOpen = true
  }

  closeDropdown() {
    this.isDropdownOpen = false
  }
}
