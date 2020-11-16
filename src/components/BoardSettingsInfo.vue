<template>
  <div class="mb-4">
    <h2 class="listo-block-heading">About Board</h2>
    <p class="font-medium text-sm">created: {{ completed }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const boardModule = namespace('boards')

@Component({
  name: 'board-settings-info',
})
export default class BoardSettingsInfo extends Vue {
  @boardModule.Getter createdAtDate!: (id: string) => Date
  @Prop() id!: string

  get completed() {
    const date = new Date(this.createdAtDate(this.id))
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      year: 'numeric',
      month: 'long',
    }).format(date)
  }
}
</script>

