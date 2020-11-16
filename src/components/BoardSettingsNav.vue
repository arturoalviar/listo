<template>
  <nav
    class="board-settings-nav bg-input absolute top-0 left-0 w-16 h-full -ml-16"
  >
    <ul class="board-settings-nav-links">
      <li
        v-for="(item, index) in nav"
        :key="'nav-item-' + index"
        class="board-setting-nav-link flex items-center justify-center w-16 h-16 mb-4"
        :class="{ 'is-active bg-primary': currentView === item.action }"
      >
        <a class="p-5" href="#" @click="switchNavView($event, item.action)">
          <span class="sr-only">{{ item.label }}</span>
          <component :is="item.icon" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  AlertTriangleIcon,
  InfoIcon,
  TagIcon,
  FilterIcon,
  SettingsIcon,
} from 'vue-feather-icons'

@Component({
  name: 'board-settings-nav',
  components: {
    AlertTriangleIcon,
    InfoIcon,
    TagIcon,
    SettingsIcon,
  },
})
export default class BoardSettings extends Vue {
  currentView = 'INFO'

  nav = [
    {
      label: 'info',
      action: 'INFO',
      icon: InfoIcon,
    },
    {
      label: 'labels',
      action: 'LABELS',
      icon: TagIcon,
    },
    {
      label: 'filter',
      action: 'FILTER',
      icon: FilterIcon,
    },
    {
      label: 'danger',
      action: 'DANGER',
      icon: AlertTriangleIcon,
    },
  ]

  switchNavView($event: MouseEvent, view: string) {
    $event.preventDefault()
    this.currentView = view
    this.$emit('changed', this.currentView)
  }
}
</script>

<style lang="css" scoped>
.board-setting-nav-link.is-active svg {
  stroke: #fff;
}
</style>
