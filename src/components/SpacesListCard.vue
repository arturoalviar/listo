<template>
  <div class="listo-card spaces-list-card">
    <router-link class="block py-8" :to="'/space/' + id">
      <div class="spaces-list-card-content p-4">
        <h2 class="text-2xl font-semibold truncate">{{ space.name }}</h2>
        <p class="text-xs mt-2">boards: {{ space.boards.length }}</p>
      </div>
    </router-link>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Space } from '@/types/spaces'

@Component({
  name: 'spaces-list-card',
})
export default class SpacesListCard extends Vue {
  @Prop() id!: string
  @Prop() space!: Space
}
</script>
