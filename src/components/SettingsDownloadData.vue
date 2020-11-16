<template>
  <div>
    <h2 class="listo-block-heading mb-2">Save Listo data</h2>
    <p class="text-sm mb-4">
      Download all your current data. The data can be reuploaded to the app if
      you wish to recover it.
    </p>
    <AppButton @click="downloadData">
      <DownloadIcon /> Download all data
    </AppButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import { DownloadIcon } from 'vue-feather-icons'

import Boards from '@/types/board'
import Columns from '@/types/columns'
import Tasks from '@/types/tasks'
import Checklists from '@/types/checklists'
import Spaces from '@/types/spaces'

const boardsModule = namespace('boards')
const columnsModule = namespace('columns')
const checklistsModule = namespace('checklists')
const tasksModule = namespace('tasks')
const spacesModules = namespace('spaces')
const favBoardsModule = namespace('favBoards')

@Component({
  name: 'settings-download-data',
  components: {
    DownloadIcon,
  },
})
export default class SettingsDownloadDataComponent extends Vue {
  @boardsModule.State boards!: Boards
  @columnsModule.State columns!: Columns
  @checklistsModule.State checklists!: Checklists
  @tasksModule.State tasks!: Tasks
  @spacesModules.State spaces!: Spaces
  @favBoardsModule.State favBoards!: string[]

  downloadData() {
    const data = {
      boards: this.boards,
      columns: this.columns,
      checklists: this.checklists,
      tasks: this.tasks,
      spaces: this.spaces,
      favBoards: this.favBoards,
    }
    const download = JSON.stringify(data, null, '\t')
    const blob = new Blob([download], { type: 'text/plain' })
    const e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = `listo-data-${Date.now()}.json`
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initEvent('click')
    a.dispatchEvent(e)
  }
}
</script>
