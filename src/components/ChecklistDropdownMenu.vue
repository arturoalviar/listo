<template>
  <div v-click-out="emitClose" class="listo-dropdown-menu-wrapper right-0">
    <ul role="menu">
      <li class="listo-dropdown-menu-item" @click="emitAddItem">
        <div class="listo-dropdown-menu-item-icon">
          <PlusIcon />
        </div>
        <div class="listo-dropdown-menu-item-content">Add item</div>
      </li>
      <li class="listo-dropdown-menu-item" @click="emitEditName">
        <div class="listo-dropdown-menu-item-icon">
          <Edit2Icon />
        </div>
        <div class="listo-dropdown-menu-item-content">Rename</div>
      </li>
      <li class="listo-dropdown-menu-item" @click="emitToggleShowCompleted">
        <div class="listo-dropdown-menu-item-icon">
          <eye-off-icon v-if="showCompleted" />
          <eye-icon v-else />
        </div>
        <div class="listo-dropdown-menu-item-content">
          {{ showCompletedLabel }}
        </div>
      </li>
      <li
        class="listo-dropdown-menu-item"
        @click="dispatchSetAllChecklistItems(true)"
      >
        <div class="listo-dropdown-menu-item-icon">
          <CheckIcon />
        </div>
        <div class="listo-dropdown-menu-item-content">Check all items</div>
      </li>
      <li
        class="listo-dropdown-menu-item"
        @click="dispatchSetAllChecklistItems(false)"
      >
        <div class="listo-dropdown-menu-item-icon">
          <SquareIcon />
        </div>
        <div class="listo-dropdown-menu-item-content">Uncheck all items</div>
      </li>
      <li class="listo-dropdown-menu-item" @click="dispatchDeleteChecklist">
        <div class="listo-dropdown-menu-item-icon">
          <TrashIcon />
        </div>
        <div class="listo-dropdown-menu-item-content">Delete</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Edit2Icon,
  PlusIcon,
  SquareIcon,
  TrashIcon,
} from 'vue-feather-icons'

import menuEmittable from '@/mixins/menuEmittable'

const checklistModule = namespace('checklists')
const tasksModule = namespace('tasks')

@Component({
  name: 'checklist-dropdown',
  components: {
    CheckIcon,
    EyeIcon,
    EyeOffIcon,
    Edit2Icon,
    PlusIcon,
    SquareIcon,
    TrashIcon,
  },
})
export default class ChecklistDropdownMenu extends mixins(menuEmittable) {
  @Prop() checklistId!: string
  @Prop() taskId!: string
  @Prop() itemsCount!: number
  @Prop() completedCount!: number
  @Prop() showCompleted!: boolean

  @checklistModule.Action deleteChecklist!: (
    payload: Record<string, unknown>
  ) => void
  @checklistModule.Action setAllChecklistItems!: (
    payload: Record<string, unknown>
  ) => void

  @tasksModule.Mutation DELETE_CHECKLIST!: (
    payload: Record<string, unknown>
  ) => void

  get showCompletedLabel() {
    return this.showCompleted ? 'Hide completed items' : 'Show completed items'
  }

  emitToggleShowCompleted() {
    this.$emit('toggle-show-completed')
  }

  dispatchDeleteChecklist() {
    this.$store
      .dispatch('checklists/deleteChecklist', {
        checklistId: this.checklistId,
        taskId: this.taskId,
      })
      .then(({ checklistId, taskId }) => {
        this.DELETE_CHECKLIST({
          checklistId,
          taskId,
        })
      })
  }

  dispatchSetAllChecklistItems(checkItems: boolean) {
    // only dispatch if checkItems is true and not all items are checked
    // or if checkItems is false  (meaning it will uncheck all items) and not all items are unchecked
    if (
      (checkItems && this.completedCount !== this.itemsCount) ||
      (!checkItems && this.completedCount !== 0)
    ) {
      this.$store
        .dispatch('checklists/setAllChecklistItems', {
          checklistId: this.checklistId,
          value: checkItems,
        })
        .then(() => {
          this.emitClose()
        })
    } else {
      this.emitClose()
    }
  }
}
</script>

<style lang="css" scoped>
.listo-dropdown-menu-wrapper {
  top: 100%;
}
</style>
