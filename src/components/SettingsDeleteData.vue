<template>
  <div class="listo-settings-panel">
    <div class="listo-settings-panel-header">
      <h2 class="listo-section-heading">Danger Zone</h2>
    </div>
    <p class="mt-4 mb-2">
      Delete all boards and spaces. This action is not reversible.
    </p>
    <AppButton variant="danger" @click="deleteData">Delete all data</AppButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const appModule = namespace('app')
const snackbarModule = namespace('snackbar')

@Component({
  name: 'settings-delete-data',
})
export default class SettingsDeleteDataComponent extends Vue {
  @appModule.Action resetAppState!: () => void
  @appModule.Action setInitalState!: () => string
  @appModule.Mutation COMPLETE_SETUP!: () => void

  @snackbarModule.Mutation SHOW_SNACKBAR!: (
    payload: Record<string, unknown>
  ) => void

  async deleteData() {
    const confirm = await this.$root.$globalDialog.open({
      title: 'Delete all saved data?',
      description:
        'This action will delete all of you current boards and cannot be undone.',
      actionLabel: 'Delete all data',
      variant: 'danger',
    })
    if (confirm) {
      this.$store.dispatch('app/resetAppState').then(() => {
        this.$store.dispatch('app/setInitalState').then(() => {
          this.COMPLETE_SETUP()
          this.$router
            .push({
              name: 'home',
            })
            .then(() => {
              this.SHOW_SNACKBAR({
                message: 'All local data cleared.',
              })
            })
        })
      })
    }
  }
}
</script>