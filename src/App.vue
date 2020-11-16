<template>
  <div id="app-wrapper">
    <div id="app" :data-theme="mode">
      <AppHeader />
      <div class="app-container">
        <router-view />
      </div>
      <AppDialog ref="globalDialog" />
      <AppSnack v-model="snackbarActive" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import { MetaInfo } from 'vue-meta'

import AppHeader from '@/components/AppHeader.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppSnack from '@/components/AppSnackBar.vue'
import { Mode } from '@/types/settings'

const appModule = namespace('app')
const boardsModule = namespace('app')
const settingsModule = namespace('settings')
const snackbarModule = namespace('snackbar')

Component.registerHooks(['metaInfo'])

@Component({
  components: {
    AppHeader,
    AppDialog,
    AppSnack,
  },
})
export default class App extends Vue {
  @appModule.State hasCompletedSetup!: boolean
  @appModule.Mutation COMPLETE_SETUP!: () => void
  @appModule.Action setInitalState!: () => string

  @boardsModule.Mutation ADD_COLUMN!: (payload: Record<string, unknown>) => void

  @settingsModule.State mode!: Mode

  @snackbarModule.State('isActive') snackbarActive!: boolean

  $refs!: {
    globalDialog: AppDialog
  }

  metaInfo(): MetaInfo {
    return {
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | Listo` : 'Listo'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'Listo - a task manager app' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    }
  }

  mounted() {
    document.documentElement.dataset.theme = this.mode
    this.$root.$globalDialog = this.$refs.globalDialog
    if (!this.hasCompletedSetup) {
      this.$store.dispatch('app/setInitalState').then(() => {
        this.COMPLETE_SETUP()
      })
    }
  }
}
</script>

<style>
@import '~fontsource-poppins/index.css';
@import '~fontsource-poppins/500-normal.css';
@import '~fontsource-poppins/600-normal.css';
@import '~fontsource-poppins/700-normal.css';
@import '~fontsource-poppins/900-normal.css';
@import 'assets/styles/tailwind.postcss';
@import 'assets/styles/global.css';
@import 'assets/styles/typography.css';
@import 'assets/styles/shared/app-card.css';
@import 'assets/styles/shared/app-popover-card.css';
@import 'assets/styles/shared/app-input.css';
@import 'assets/styles/shared/app-layout.css';
@import 'assets/styles/shared/app-dropdown-menu.css';
@import 'assets/styles/shared/app-scrollbar.css';
@import 'assets/styles/transitions/fade.css';
</style>
