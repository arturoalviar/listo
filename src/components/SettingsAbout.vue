<template>
  <div class="listo-settings-panel">
    <div class="listo-settings-panel-header">
      <h2 class="listo-section-heading">About</h2>
    </div>
    <p class="text-sm max-w-xl mb-4">
      Listo is a task manager app similar to trello and clickup. It was inspired
      by the app build in the
      <a
        class="font-semibold border-b border-current"
        href="https://www.vuemastery.com/courses/watch-us-build-trello-clone/extracting-drag-and-drop"
        >Vue Mastery course: Watch Us Build a Trello Clone.</a
      >
    </p>
    <a
      class="listo-button is-default"
      href="https://github.com/arturoalviar/listo"
      target="_blank"
      rel="noopener"
    >
      <GithubIcon /> Github Repo</a
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { GithubIcon } from 'vue-feather-icons'

@Component({
  name: 'settings-about',
  components: {
    GithubIcon,
  },
})
export default class SettingsPage extends Vue {}
</script>

