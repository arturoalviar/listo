<template>
  <div class="listo-search-wrapper w-full">
    <div class="listo-card p-4 shadow-xl">
      <label for class="listo-input-label">Search tasks</label>
      <div class="listo-search-container">
        <AppSearchFilter
          focus-on-mount
          :search="searchTasks"
          @searched="getSearchResults"
        />
        <div
          v-if="showScopeOptions"
          class="search-scope-filter-container relative z-10"
        >
          <select
            v-model="searchScopeOption"
            class="bg-input border-l-2 border-primary appearance-none h-10 pl-2 pr-8 active:outline-none focus:outline-none"
          >
            <option
              v-for="item in scopeOptions"
              :key="'search-scope-' + item.label"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
          <div
            class="flex items-center justify-center absolute top-0 right-0 h-10 w-6 z-20 pointer-events-none"
          >
            <ChevronDownIcon class="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasSearchResults" class="listo-card mt-10 p-4 shadow-xl">
      <p>Found results ({{ searchResults.length }})</p>
      <div class="listo-search-results">
        <div
          v-for="result in searchResults"
          :key="'result' + result"
          class="listo-search-result border-input"
        >
          <router-link
            class="block py-4"
            :to="'/board/' + tasks[result].boardId + '/task/' + result"
          >
            <p class="font-medium">{{ tasks[result].name }}</p>
            <p class="text-xs">in: {{ boards[tasks[result].boardId].name }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

import AppSearchFilter from '@/components/AppSearchFilter.vue'
import { ChevronDownIcon } from 'vue-feather-icons'

import { TaskCollection } from '@/types/tasks'
import { ColumnCollection } from '@/types/columns'
import { BoardsCollection } from '@/types/board'

const boardsModule = namespace('boards')
const columnsModule = namespace('columns')
const tasksModule = namespace('tasks')

@Component({
  name: 'app-search',
  components: {
    AppSearchFilter,
    ChevronDownIcon,
  },
})
export default class ListoSearch extends Vue {
  @tasksModule.State tasks!: TaskCollection
  @tasksModule.Getter('allTaskKeys') getAllTaskKeys!: () => string[]
  @columnsModule.State columns!: ColumnCollection
  @boardsModule.State boards!: BoardsCollection
  @boardsModule.Getter boardTasks!: (id: string) => string[]

  searchScopeOption = 'tasks'
  searchResults: null | string[] = null
  currentBoardTasks: string[] = []
  allTaskKeys: string[] = []

  $refs!: {
    searchInput: HTMLInputElement
  }

  get boardId() {
    return this.$route.params.uid ? this.$route.params.uid : false
  }

  get scopeOptions() {
    return [
      {
        label: 'All Tasks',
        value: 'tasks',
        include: true,
      },
      {
        label: 'Current board',
        value: 'currentBoard',
        include: !!this.boardId,
      },
    ].filter((item) => {
      return item.include && item
    })
  }

  get tasksToSearch() {
    switch (this.searchScopeOption) {
      case 'currentBoard':
        return this.currentBoardTasks
      default:
        return this.allTaskKeys
    }
  }

  get showScopeOptions() {
    return this.scopeOptions.length > 1
  }

  get hasSearchResults() {
    return this.searchResults && this.searchResults.length
  }

  mounted() {
    if (this.boardId) {
      this.searchScopeOption = 'currentBoard'
      this.currentBoardTasks = this.boardTasks(this.boardId)
    }
    this.allTaskKeys = this.getAllTaskKeys()
  }

  searchTasks(searchTerm: string) {
    return this.tasksToSearch.filter((taskId) => {
      const isInTitle = this.tasks[taskId].name.indexOf(searchTerm)

      if (isInTitle !== -1) {
        return taskId
      }
    })
  }

  getSearchResults(results: string[]) {
    this.searchResults = results
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-search.css';
</style>
