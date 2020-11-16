<template>
  <transition name="slide-in-out">
    <div
      v-show="isVisible"
      class="listo-board-settings bg-card fixed right-0 top-0 bottom-0 p-6 shadow-lg"
    >
      <AppCloseButton class="py-6 px-5" @click="closeBoard" />
      <BoardSettingsNav @changed="currentView = $event" />
      <div class="board-settings-view">
        <div class="mb-8">
          <h2 class="listo-section-heading font-bold mb-2">Board Settings</h2>
        </div>
        <BoardSettingsInfo v-if="currentView === 'INFO'" :id="id" />
        <LabelGroup v-if="currentView === 'LABELS'" :board-id="id" />
        <BoardSettingsFilter v-if="currentView === 'FILTER'" :board-id="id" />
        <div v-if="currentView === 'DANGER'">
          <h2 class="listo-block-heading font-semibold mb-2">Danger Zone</h2>
          <div class="listo-board-controls">
            <AppButton variant="danger" @click="dispatchDeleteBoard"
              >Delete Board</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import BoardSettingsInfo from '@/components/BoardSettingsInfo.vue'
import BoardSettingsNav from '@/components/BoardSettingsNav.vue'
import BoardSettingsFilter from '@/components/BoardSettingsFilter.vue'
import LabelGroup from '@/components/LabelGroup.vue'

const boardsModule = namespace('boards')

@Component({
  name: 'board-settings',
  components: {
    BoardSettingsInfo,
    BoardSettingsNav,
    BoardSettingsFilter,
    LabelGroup,
  },
})
export default class BoardSettings extends Vue {
  @boardsModule.Action deleteBoard!: (payload: Record<string, unknown>) => void

  @Prop() id!: string
  @Prop() isVisible!: boolean

  currentView = 'INFO'

  closeBoard() {
    this.$emit('close-board-menu')
  }

  async dispatchDeleteBoard() {
    const confirm = await this.$root.$globalDialog.open({
      title: 'Delete Board?',
      description:
        'This action will delete this board and all the items in this board',
      actionLabel: 'Delete',
      variant: 'danger',
    })

    if (confirm) {
      this.$store
        .dispatch('boards/deleteBoard', {
          id: this.id,
        })
        .then(() => {
          this.$router.push({
            name: 'home',
          })
        })
    }
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/transitions/slide-in-out.css';

.listo-board-settings {
  min-width: 320px;
}
</style>
