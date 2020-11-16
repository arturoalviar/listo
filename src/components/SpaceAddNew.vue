<template>
  <div class="relative w-full">
    <label class="listo-input-label" for="add-new-space">Space Name</label>
    <input
      id="add-new-space"
      ref="editingInput"
      v-model="newSpaceName"
      class="listo-text-input"
      type="text"
      placeholder="Dev boards"
      @keyup.enter="addSpace"
    />
    <AppButton variant="primary" @click="addSpace"> Create Space </AppButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const spacesModule = namespace('spaces')

@Component({
  name: 'add-new-space',
})
export default class SpaceAddNew extends Vue {
  @spacesModule.Mutation CREATE_SPACE!: (
    payload: Record<string, unknown>
  ) => void

  newSpaceName = ''

  $refs!: {
    editingInput: HTMLInputElement
  }

  mounted() {
    this.$refs.editingInput.focus()
  }

  addSpace() {
    this.CREATE_SPACE({
      name: this.newSpaceName,
    })
    this.newSpaceName = ''
    this.$emit('space-created')
  }
}
</script>
