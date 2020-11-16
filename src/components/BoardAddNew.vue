<template>
  <div class="relative w-full">
    <label class="listo-input-label" for="add-new-board">Board Name</label>
    <input
      id="add-new-board"
      ref="editingInput"
      v-model="newBoardName"
      class="listo-text-input"
      type="text"
      placeholder="Todos..."
      @keyup.enter="addBoard"
    />
    <AppButton variant="primary" @click="addBoard">Create board</AppButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const boardsModule = namespace('boards')

@Component({
  name: 'board-add-new',
})
export default class BoardAddNew extends Vue {
  @boardsModule.Mutation CREATE_BOARD!: (
    payload: Record<string, unknown>
  ) => void

  newBoardName = ''

  $refs!: {
    editingInput: HTMLInputElement
  }

  mounted() {
    this.$refs.editingInput.focus()
  }

  addBoard() {
    if (this.newBoardName.length) {
      this.CREATE_BOARD({
        name: this.newBoardName,
      })
      this.newBoardName = ''
      this.$emit('board-created')
    }
  }
}
</script>
