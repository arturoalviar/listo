<template>
  <div
    class="inline-flex relative pt-4 pb-0 px-2 text-lg mb-4 truncate w-auto lg:pt-6 lg:px-6"
  >
    <h1
      ref="currentTitle"
      class="board-title flex items-center h-8 p-4 font-black leading-none border border-transparent rounded cursor-pointer hover:bg-input"
      :class="currentTitleClasses"
      @click="toggleEditingMode"
    >
      {{ newBoardTitle }}
    </h1>
    <div v-if="isEditing" class="relative w-full">
      <input
        ref="editingInput"
        v-model.trim="newBoardTitle"
        class="relative inline-flex w-full bg-transparent border border-transparent rounded h-8 p-4 font-black leading-none focus:outline-none focus:border-current"
        type="text"
        :style="{
          width: currentTitleWidth,
        }"
        @keyup.enter="updateBoardTitle"
        @blur="updateBoardTitle"
        @input="adjustInputWidth($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const boardsModule = namespace('boards')

@Component({
  name: 'board-title',
})
export default class BoardTitle extends Vue {
  @boardsModule.Mutation UPDATE_NAME!: (
    payload: Record<string, unknown>
  ) => void

  @Prop() title!: string
  @Prop() id!: string

  isEditing = false
  newBoardTitle = this.title
  currentTitleWidth = ''
  prevTitleLength = 0

  $refs!: {
    currentTitle: HTMLInputElement
    editingInput: HTMLInputElement
  }

  get currentTitleClasses() {
    return {
      'is-editing absolute top-0 left-0 opacity-0': this.isEditing,
    }
  }

  toggleEditingMode() {
    this.isEditing = !this.isEditing
    this.currentTitleWidth = `${this.$refs.currentTitle.offsetWidth}px`
    if (this.isEditing) {
      this.$nextTick(() => {
        this.prevTitleLength = this.$refs.editingInput.value.length
        this.$refs.editingInput.focus()
      })
    }
  }

  updateBoardTitle() {
    this.UPDATE_NAME({
      name: this.newBoardTitle,
      id: this.id,
    })
    this.isEditing = false
  }

  adjustInputWidth(event: KeyboardEvent) {
    const currentTarget = event.target as HTMLInputElement
    const currentLength = currentTarget.value.length

    if (currentLength < 1) {
      this.currentTitleWidth = `0px`
    } else if (this.prevTitleLength >= currentLength) {
      this.$nextTick(() => {
        this.currentTitleWidth = `${this.$refs.currentTitle.offsetWidth}px`
      })
    } else {
      this.currentTitleWidth = `${currentTarget.scrollWidth}px`
    }
    this.prevTitleLength = currentLength
  }
}
</script>