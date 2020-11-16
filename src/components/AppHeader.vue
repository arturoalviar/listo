<template>
  <header
    class="listo-header bg-header relative flex flex-col min-h-0 w-14 lg:w-24 h-full items-center py-4 lg:py-6"
  >
    <div class="relative flex justify-center items-center w-full">
      <router-link class="flex flex-col items-center p-2 w-full" to="/">
        <svg
          class="listo-logo w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
          viewBox="0 0 80 128"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <title>Listo logo</title>
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g fill-rule="nonzero">
              <polygon class="fill-heading" points="0 128 0 94 80 94 80 128" />
              <path
                d="M2.5,78.5 L31.5,78.5 L31.5,49.5 L2.5,49.5 L2.5,78.5 Z"
                class="stroke-primary"
                stroke-width="8"
              />
              <polygon class="fill-heading" points="0 34 0 0 34 0 34 34" />
            </g>
          </g>
        </svg>
      </router-link>
    </div>
    <nav class="listo-nav relative mt-6 w-full">
      <ul class="nav-items flex flex-col items-center justify-center">
        <li class="nav-item relative block w-full mb-4">
          <button
            class="relative flex flex-row justify-center p-4 w-full"
            aria-label="Search listo"
            @click="isSearching = true"
          >
            <SearchIcon class="listo-icon" />
          </button>
        </li>
        <li class="nav-item relative block w-full z-10">
          <router-link
            class="relative flex flex-row justify-center p-4 w-full z-40"
            :to="{ name: 'home' }"
          >
            <div
              class="nav-item-label bg-card p-1 -mt-4 ml-2 top-0 shadow absolute opacity-0 z-50 transition-opacity duration-300 ease-in-out pointer-events-none md:p-2 md:ml-0"
            >
              Boards
            </div>
            <HomeIcon class="listo-icon" />
          </router-link>
        </li>
        <li class="nav-item relative block w-full z-10">
          <router-link
            class="relative flex flex-row justify-center p-4 w-full z-40"
            :to="{ name: 'spaces' }"
          >
            <div
              class="nav-item-label bg-card p-1 -mt-4 ml-2 top-0 shadow absolute opacity-0 z-50 transition-opacity duration-300 ease-in-out pointer-events-none md:p-2 md:ml-0"
            >
              Spaces
            </div>
            <LayoutIcon class="listo-icon" />
          </router-link>
        </li>
        <li class="nav-item relative block w-full z-10">
          <router-link
            class="relative flex flex-row justify-center p-4 w-full z-40"
            :to="{ name: 'settings' }"
          >
            <div
              class="nav-item-label bg-card p-1 -mt-4 ml-2 top-0 shadow absolute opacity-0 z-50 transition-opacity duration-300 ease-in-out pointer-events-none md:p-2 md:ml-0"
            >
              Settings
            </div>
            <SettingsIcon class="listo-icon" />
          </router-link>
        </li>
      </ul>
      <AppModal v-model="isSearching" is-top no-bg>
        <AppSearch />
      </AppModal>
    </nav>
    <AppThemeToggle class="mt-auto" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

import AppModal from '@/components/AppModal.vue'
import AppSearch from '@/components/AppSearch.vue'
import AppThemeToggle from '@/components/AppThemeToggle.vue'

import {
  LayoutIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
} from 'vue-feather-icons'

@Component({
  name: 'app-header',
  components: {
    AppModal,
    AppSearch,
    AppThemeToggle,
    HomeIcon,
    LayoutIcon,
    SearchIcon,
    SettingsIcon,
  },
})
export default class AppHeader extends Vue {
  @Watch('$route')
  onRouteChange() {
    this.isSearching = false
  }

  isSearching = false
}
</script>

<style lang="css" scoped>
.nav-item-label {
  font-size: 0.65rem;
  left: 50%;
  transform: translateX(-50%);
}
.nav-item {
  &:hover {
    & .nav-item-label {
      @apply opacity-100;
    }
  }
}
</style>