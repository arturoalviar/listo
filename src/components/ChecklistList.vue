<template>
  <div class="listo-checklists">
    <Checklist
      v-for="checklistId in checklists"
      :key="'checklist-item-' + checklistId"
      :checklist-id="checklistId"
      :task-id="taskId"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Checklist from '@/components/Checklist.vue'

import { ChecklistItem } from '@/types/checklists'

const tasksModule = namespace('tasks')

@Component({
  name: 'checklist-list',
  components: {
    Checklist,
  },
})
export default class LabelGroup extends Vue {
  @Prop() taskId!: string

  @tasksModule.Getter('checklists') getChecklists!: (
    id: string
  ) => ChecklistItem[]

  checklists: ChecklistItem[] = []

  mounted() {
    this.checklists = this.getChecklists(this.taskId)
  }
}
</script>
