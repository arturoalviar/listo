import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

import Settings, { Mode } from '@/types/settings'

const defaultSettings: Settings = {
  mode: 'light',
}

const localSettings = localStorage.getItem('listoSettings')
const settingsState = localSettings
  ? JSON.parse(localSettings)
  : defaultSettings

@Module({ namespaced: true, name: 'settings' })
export default class SettingsModule extends VuexModule implements Settings {
  mode: Mode = settingsState.mode

  @Mutation
  UPDATE_MODE(payload: { mode: Mode }) {
    const { mode } = payload
    this.mode = mode
  }
}
