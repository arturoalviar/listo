<template>
  <div
    class="listo-card board-list-card relative col-span-1 overflow-hidden border z-0"
  >
    <router-link class="block relative z-0" :to="'/board/' + id">
      <div class="flex items-center pl-6 pr-12 h-32">
        <div class="listo-card-title overflow-hidden">
          <h2 class="font-semibold text-xl truncate">{{ name }}</h2>
        </div>
      </div>
    </router-link>
    <BoardFavorite
      class="board-list-fav-toggle absolute right-0 mb-2 mr-2 text-2xl z-10"
      :board-id="id"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import BoardFavorite from '@/components/BoardFavorite.vue'

@Component({
  name: 'board-list-card',
  components: {
    BoardFavorite,
  },
})
export default class BoardListCard extends Vue {
  @Prop() id!: string
  @Prop() name!: string
}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/board-list-card.css';
</style>
