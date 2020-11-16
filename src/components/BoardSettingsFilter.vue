<template>
  <div class="board-settings-search-container">
    <div class="mb-8">
      <label for="listo-board-search-filter" class="listo-input-label"
        >Filter cards</label
      >
      <input
        id="listo-board-search-filter"
        v-model="searchPhrase"
        class="listo-text-input"
        type="text"
      />
    </div>
    <div class="board-settings-search-item">
      <label for="listo-board-label-filter" class="listo-input-label"
        >Filter cards by labels</label
      >
      <div
        v-for="(label, id) in labels"
        :key="'item-label-' + id"
        class="listo-checkbox-item mb-4"
      >
        <div class="listo-checkbox-wrapper">
          <input
            :id="'label-filter-' + id"
            v-model="filters"
            class="w-full h-full"
            :value="id"
            type="checkbox"
          />
          <div
            class="listo-checkbox"
            :style="{
              backgroundColor: label.color,
            }"
          >
            <CheckIcon :style="{ stroke: label.textColor }" />
          </div>
        </div>
        <label
          class="h-8"
          :for="'label-filter-' + id"
          :style="{ color: label.textColor }"
          >{{ label.name ? label.name : 'unnamed label' }}</label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import { Prop } from 'vue-property-decorator'
import { CheckIcon } from 'vue-feather-icons'

import AppSearchFilter from '@/components/AppSearchFilter.vue'

import Labels from '@/types/labels'

const boardsModule = namespace('boards')
const labelsModule = namespace('labels')
const searchModule = namespace('search')

@Component({
  name: 'board-settings-filter',
  components: {
    AppSearchFilter,
    CheckIcon,
  },
})
export default class BoardSettingsFilter extends Vue {
  @Prop() boardId!: string

  @boardsModule.Getter boardTasks!: (id: string) => string[]
  @boardsModule.Getter columns!: (id: string) => string[]

  @searchModule.State searchTerm!: string
  @searchModule.State labelFilters!: string[]
  @searchModule.Mutation FILTER_TASKS!: (
    payload: Record<string, unknown>
  ) => void

  @labelsModule.Getter boardLabels!: (boardId: string) => Labels

  boardColumns: string[] = []

  get labels() {
    return this.boardLabels(this.boardId)
  }

  get searchPhrase() {
    return this.searchTerm
  }

  set searchPhrase(value) {
    this.FILTER_TASKS({
      searchTerm: value,
      labelFilters: this.filters,
      columns: this.boardColumns,
    })
  }

  get filters() {
    return this.labelFilters
  }

  set filters(updatedFilters) {
    this.FILTER_TASKS({
      searchTerm: this.searchPhrase,
      labelFilters: updatedFilters,
      columns: this.boardColumns,
    })
  }

  mounted() {
    this.boardColumns = this.columns(this.boardId)
  }
}
</script>

<style lang="css" scoped>
.label-filter-item {
  & .listo-checkbox-wrapper {
    & input {
      &:checked ~ .listo-checkbox {
        border-color: transparent;
        & svg {
          stroke: currentColor;
        }
      }
    }
    & .listo-checkbox {
      border-color: transparent;
    }
  }
}
</style>
