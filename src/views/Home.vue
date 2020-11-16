<template>
  <div class="listo-home h-full">
    <BoardList />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import BoardList from '@/components/BoardList.vue'

@Component({
  name: 'home',
  components: {
    BoardList,
  },
})
export default class HomeView extends Vue {}
</script>
