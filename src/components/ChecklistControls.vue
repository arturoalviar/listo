<template>
  <div class="listo-checklist-form-wrapper">
    <AppPopover v-model="isAdding">
      <template #content>
        <div
          v-click-out="{
            handler: () => (isAdding = false),
            closeConditional: () => isAdding,
          }"
          class="listo-checklist-form-wrapper"
        >
          <div class="listo-popover-card checklist-form bg-card p-4 shadow">
            <div class="relative mb-4">
              <p class="listo-popover-card-title">Checklist name</p>
              <AppCloseButton class="px-2 -mr-2" @click="isAdding = false" />
            </div>
            <input
              v-model="newChecklistName"
              class="listo-text-input"
              type="text"
              @keyup.enter="addChecklistToTask"
            />
            <AppButton variant="success" @click="addChecklistToTask"
              >Add</AppButton
            >
          </div>
        </div>
      </template>
      <AppButton @click="showAddForm">Add Checklist</AppButton>
    </AppPopover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const checklistModule = namespace('checklists')

@Component({
  name: 'checklist-controls',
})
export default class ChecklistControls extends Vue {
  @Prop() taskId!: string

  @checklistModule.Action createChecklist!: (
    payload: Record<string, unknown>
  ) => void

  newChecklistName = 'Checklist'
  isAdding = false

  showAddForm() {
    this.isAdding = true
  }

  addChecklistToTask() {
    if (this.newChecklistName.length) {
      this.$store
        .dispatch('checklists/createChecklist', {
          taskId: this.taskId,
          name: this.newChecklistName,
        })
        .then(() => {
          this.isAdding = false
        })
    }
  }
}
</script>