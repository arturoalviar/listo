<template>
  <div class="board-fav-wrapper">
    <button
      class="board-fav-button p-2 focus:outline-none"
      :aria-label="fav ? 'unfavorite board' : 'favorite board'"
      @click.prevent="dispatchToggleFav"
    >
      <svg
        class="transition-all ease-in-out duration-300"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke="strokeColor"
        :fill="fillColor"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const boardModule = namespace('boards')

const favColor = 'var(--color-primary)'

@Component({
  name: 'board-favorite',
})
export default class BoardFavoriteComponent extends Vue {
  @Prop() boardId!: string
  @boardModule.Action toggleFav!: (payload: Record<string, unknown>) => void
  @boardModule.Getter isFav!: (id: string) => boolean

  get fav() {
    return this.isFav(this.boardId)
  }

  get fillColor() {
    return this.fav ? favColor : 'none'
  }

  get strokeColor() {
    return this.fav ? favColor : 'currentColor'
  }

  dispatchToggleFav() {
    this.$store.dispatch('boards/toggleFav', {
      id: this.boardId,
      isFav: !this.fav,
    })
  }
}
</script>