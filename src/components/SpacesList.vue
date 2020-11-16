<template>
  <div class="listo-page-body">
    <div class="listo-page-body-header">
      <div class="container">
        <div class="listo-page-header">
          <h1 class="listo-page-heading">Spaces</h1>
          <AppButton @click="isAddingSpace = true">Add new space</AppButton>
        </div>
      </div>
    </div>
    <div class="listo-page-body-content listo-scrollbar">
      <div class="container">
        <div v-if="hasSpaces" class="space-list-cards">
          <SpacesListCard
            v-for="space in spaces"
            :id="space.id"
            :key="'space' + space.id"
            :space="space"
          />
        </div>
        <AppEmptyList
          v-else
          title="Nothing to see here. Add your first space."
        />
      </div>
    </div>
    <AppModal v-model="isAddingSpace">
      <SpaceAddNew @space-created="isAddingSpace = false" />
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

import AppEmptyList from '@/components/AppEmptyList.vue'
import AppModal from '@/components/AppModal.vue'
import SpaceAddNew from '@/components/SpaceAddNew.vue'
import SpacesListCard from '@/components/SpacesListCard.vue'

import { SpacesCollection } from '@/types/spaces'
const spacesModule = namespace('spaces')

@Component({
  name: 'spaces-list',
  components: {
    AppEmptyList,
    AppModal,
    SpaceAddNew,
    SpacesListCard,
  },
})
export default class SpaceList extends Vue {
  @spacesModule.State spaces!: SpacesCollection

  isAddingSpace = false

  get hasSpaces() {
    return Object.keys(this.spaces).length !== 0
  }
}
</script>

<style lang="css" scoped>
.space-list-cards {
  @media (--vp-min-md) {
    @apply grid grid-cols-2 gap-10 grid-flow-row;
  }

  @media (--vp-min-lg) {
    @apply grid-cols-3;
  }
}

.spaces-list-card {
  &:not(:last-of-type) {
    @apply mb-6;
    @media (--vp-min-md) {
      @apply mb-0;
    }
  }
}
</style>
