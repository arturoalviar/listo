<template>
  <div class="listo-settings-panel">
    <div class="listo-settings-panel-header">
      <h2 class="listo-section-heading">Site theme</h2>
    </div>
    <div class="listo-settings-theme">
      <h2 class="listo-secondary-heading">Change Site Theme</h2>
      <div class="listo-theme-options relative py-4">
        <div class="theme-option">
          <input
            id="option-light"
            v-model="selectedMode"
            type="radio"
            value="light"
            @change="toggleThemeMode"
          />
          <label for="option-light">Light</label>
        </div>
        <div class="theme-option">
          <input
            id="option-sakura"
            v-model="selectedMode"
            type="radio"
            value="sakura"
            @change="toggleThemeMode"
          />
          <label for="option-sakura">Sakura</label>
        </div>
        <div class="theme-option">
          <input
            id="option-dark"
            v-model="selectedMode"
            type="radio"
            value="dark"
            @change="toggleThemeMode"
          />
          <label for="option-dark">Dark</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'

import themeToggle from '@/mixins/themeToggle'

@Component({
  name: 'settings-themes',
})
export default class SettingsPage extends mixins(themeToggle) {}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/settings-themes.css';
</style>
