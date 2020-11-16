<template>
  <div class="listo-settings">
    <header class="listo-setting-header p-4 lg:p-8">
      <h2 class="listo-section-heading">Settings</h2>
    </header>
    <div class="listo-settings-view-wrapper">
      <SettingsNavigation />
      <div class="listo-settings-view">
        <div class="container">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import SettingsNavigation from '@/components/SettingsNavigation.vue'

@Component({
  name: 'settings',
  components: {
    SettingsNavigation,
  },
})
export default class SettingsPage extends Vue {}
</script>

<style lang="css" scoped>
@import '../assets/styles/views/settings.css';
</style>
