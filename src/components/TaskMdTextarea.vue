<template>
  <div class="listo-markdown-wrapper">
    <div class="listo-icon-heading">
      <AlignLeftIcon />
      <h2 class="listo-block-heading">Description</h2>
    </div>
    <div class="listo-markdown">
      <div
        v-show="!isEditing"
        class="listo-markdown-result relative w-full border border-transparent p-2 cursor-pointer transition-primary hover:bg-input hover:text-placeholder"
        @click="enterEditMode"
        v-html="renderHTML()"
      />
      <textarea
        v-show="isEditing"
        ref="editingInput"
        v-model="mdText"
        class="listo-markdown-textarea bg-input relative w-full border border-transparent p-2 leading-normal"
        :placeholder="placeholder"
        @blur="onChange($event)"
        @change="onChange($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { AlignLeftIcon } from 'vue-feather-icons'
import marked from 'marked'

@Component({
  name: 'task-md-textarea',
  components: {
    AlignLeftIcon,
  },
})
export default class TaskMdTextarea extends Vue {
  @Prop() content!: string
  placeholder = 'Add a description'
  mdText = ''
  convertedText = ''
  isEditing = false

  $refs!: {
    editingInput: HTMLInputElement
  }

  created() {
    this.mdText = this.content
  }

  mounted() {
    this.convertText()
  }

  enterEditMode() {
    this.isEditing = true
    this.$nextTick(() => {
      this.$refs.editingInput.focus()
    })
  }

  convertText() {
    this.convertedText = marked(this.mdText)
  }

  renderHTML() {
    if (this.mdText.length) {
      return this.convertedText
    }
    return this.placeholder
  }

  onChange($event: KeyboardEvent) {
    this.convertText()
    this.isEditing = false
    this.$emit('change', $event)
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/task-md-textarea.css';
</style>
