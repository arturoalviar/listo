<template>
  <div class="listo-settings-panel">
    <div class="listo-settings-panel-header">
      <h2 class="listo-section-heading">User data</h2>
    </div>
    <SettingsDownloadData /> 
    <SettingsUploadData />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import SettingsDownloadData from '@/components/SettingsDownloadData.vue'
import SettingsUploadData from '@/components/SettingsUploadData.vue'

@Component({
  name: 'settings-user-data',
  components: {
    SettingsDownloadData,
    SettingsUploadData
  },
})
export default class SettingsUserData extends Vue {

}
</script>
