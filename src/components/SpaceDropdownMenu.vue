<template>
  <nav
    v-click-out="emitClose"
    class="listo-dropdown-menu-wrapper top-0 right-0"
  >
    <ul>
      <li class="listo-dropdown-menu-item" @click="emitAddItem">
        <div class="listo-dropdown-menu-item-icon">
          <PlusIcon />
        </div>
        <div class="listo-dropdown-menu-item-content">Edit space boards</div>
      </li>
      <li class="listo-dropdown-menu-item" @click="emitEditName">
        <div class="listo-dropdown-menu-item-icon">
          <Edit2Icon />
        </div>
        <div class="listo-dropdown-menu-item-content">Edit Title</div>
      </li>
      <li class="listo-dropdown-menu-item" @click="emitDelete">
        <div class="listo-dropdown-menu-item-icon">
          <TrashIcon />
        </div>
        <div class="listo-dropdown-menu-item-content">Delete Space</div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Edit2Icon, PlusIcon, TrashIcon } from 'vue-feather-icons'

import menuEmittable from '@/mixins/menuEmittable'

@Component({
  name: 'space-dropdown-menu',
  components: {
    Edit2Icon,
    PlusIcon,
    TrashIcon,
  },
})
export default class SpaceDropdownMenu extends mixins(menuEmittable) {
  @Prop() spaceId!: string
}
</script>

<style lang="css" scoped>
.listo-dropdown-menu-wrapper {
  top: 100%;
}
</style>
