<template>
  <div class="listo-search-container relative flex">
    <label class="sr-only" for="listo-search-filter">{{ placeholder }}</label>
    <input
      id="listo-search-filter"
      ref="searchInput"
      v-model="searchPhrase"
      name="listo-search-filter"
      v-bind="inputProps"
      type="text"
      :class="classes"
      :placeholder="placeholder"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @keyup="handleSearch"
    />
    <button
      class="listo-searchbar-icon absolute right-0 flex items-center justify-center w-10 h-10 opacity-0"
      :class="{ 'is-visible': isIconVisible }"
      aria-label="Clear search"
      @click="clearSearch"
    >
      <XIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { XIcon } from 'vue-feather-icons'

@Component({
  name: 'app-search-filter',
  components: {
    XIcon,
  },
})
export default class ListoSearch extends Vue {
  @Prop({ default: 'tasks' }) searchKey!: string
  @Prop({ required: true }) search!: (input: string) => string[]
  @Prop({ default: 'Search...' }) placeholder!: string
  @Prop(Boolean) focusOnMount!: boolean
  @Prop(Boolean) rounded!: boolean
  @Prop() customClass!: string

  searchPhrase = ''
  searchResults: null | string[] = null

  $refs!: {
    searchInput: HTMLInputElement
  }

  get inputProps() {
    return {
      autocomplete: 'off',
      autocapitalize: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
    }
  }

  get classes() {
    return {
      'listo-searchbar': true,
      'rounded-lg': !!this.rounded,
      [this.customClass]: !!this.customClass,
    }
  }

  get isIconVisible() {
    return this.searchPhrase.length
  }

  mounted() {
    if (this.focusOnMount) {
      this.$refs.searchInput.focus()
    }
  }

  handleFocus() {
    this.$emit('focus')
  }

  handleBlur() {
    this.$emit('blur')
  }

  handleInput() {
    this.$emit('input', this.searchPhrase)
  }

  clearSearch() {
    this.searchPhrase = ''
    this.handleSearch()
  }

  handleSearch() {
    if (this.searchPhrase.length) {
      this.searchResults = this.search(this.searchPhrase)
    } else {
      this.searchResults = []
    }

    this.$emit('searched', this.searchResults)
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-search-filter.css';
</style>
