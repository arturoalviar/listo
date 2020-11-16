import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { Mode } from '@/types/settings'

const settingsModule = namespace('settings')

@Component({
  name: 'theme-toggle',
})
export default class ThemeToggleMixin extends Vue {
  @settingsModule.State mode!: Mode
  @settingsModule.Mutation UPDATE_MODE!: (
    payload: Record<string, unknown>
  ) => void

  themes = ['light', 'sakura', 'dark']
  selectedMode = 'light'

  @Watch('mode')
  onModeChange() {
    this.selectedMode = this.mode
  }

  get nextTheme() {
    const currentIndex = this.themes.indexOf(this.selectedMode)
    const nextIndex = (currentIndex + 1) % this.themes.length
    return this.themes[nextIndex]
  }

  created() {
    this.selectedMode = this.mode
  }

  toggleNextMode() {
    this.selectedMode = this.nextTheme
    this.toggleThemeMode()
  }

  toggleThemeMode() {
    this.UPDATE_MODE({ mode: this.selectedMode })
    document.documentElement.dataset.theme = this.selectedMode
  }
}
