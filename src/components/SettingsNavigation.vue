<template>
  <nav class="listo-settings-nav">
    <ul class="bg-card border border-card rounded-lg overflow-hidden">
      <li class="border-card">
        <router-link
          class="flex flex-row p-4 items-center transition-primary hover:opacity-100 hover:bg-cardHover"
          :to="{ name: 'settings-about' }"
        >
          <InfoIcon class="w-5 h-5" />
          <p class="ml-4 font-semibold text-sm">About</p>
        </router-link>
      </li>
      <li class="border-card">
        <router-link
          class="flex flex-row p-4 items-center transition-primary hover:opacity-100 hover:bg-cardHover"
          :to="{ name: 'settings-themes' }"
        >
          <TypeIcon class="w-5 h-5" />
          <p class="ml-4 font-semibold text-sm">Appearance</p>
        </router-link>
      </li>
      <li class="border-card">
        <router-link
          class="flex flex-row p-4 items-center transition-primary hover:opacity-100 hover:bg-cardHover"
          :to="{ name: 'settings-user-data' }"
        >
          <DatabaseIcon class="w-5 h-5" />
          <p class="ml-4 font-semibold text-sm">User Data</p>
        </router-link>
      </li>
      <li class="border-card">
        <router-link
          class="flex flex-row p-4 items-center transition-primary hover:opacity-100 hover:bg-cardHover"
          :to="{ name: 'settings-delete-data' }"
        >
          <XCircleIcon class="w-5 h-5" />
          <p class="ml-4 font-semibold text-sm">Danger Zone</p>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  InfoIcon,
  TypeIcon,
  DatabaseIcon,
  XCircleIcon,
} from 'vue-feather-icons'

@Component({
  name: 'settings-navigation',
  components: {
    InfoIcon,
    DatabaseIcon,
    TypeIcon,
    XCircleIcon,
  },
})
export default class SettingsNavigation extends Vue {}
</script>
