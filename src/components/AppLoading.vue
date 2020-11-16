<template>
  <div
    class="listo-loading-wrapper fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 flex flex-col items-center justify-center"
  >
    <div
      class="listo-loading relative inline-flex items-center justify-center w-10 h-10"
    >
      <svg
        class="absolute top-0 left-0 bottom-0 right-0 m-auto w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="22 22 45 45"
      >
        <circle
          fill="transparent"
          cx="45"
          cy="45"
          r="20"
          stroke-width="5"
          stroke-dasharray="125"
          stroke-dashoffset="125px"
          class="listo-loading-indicator"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'app-loading',
})
export default class AppLoading extends Vue {}
</script>

<style lang="css" scoped>
@import '../assets/styles/components/app-loading.css';
</style>
