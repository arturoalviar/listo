<template>
  <div class="listo-spaces h-full">
    <SpacesList />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import SpacesList from '@/components/SpacesList.vue'

@Component({
  name: 'spaces',
  components: {
    SpacesList,
  },
})
export default class SpacesView extends Vue {}
</script>