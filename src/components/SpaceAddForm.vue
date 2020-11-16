<template>
  <div class="listo-form w-full">
    <h3>Select Boards for this Space</h3>

    <div class="space-board-select-wrapper">
      <div
        class="space-board-select-items listo-scrollbar mt-4 mb-8 w-full overflow-y-auto"
      >
        <div
          v-for="board in boards"
          :key="'board-select-' + board.id"
          class="listo-checkbox-item"
        >
          <div class="listo-checkbox-wrapper">
            <input
              :id="'board-select-' + board.id"
              v-model="selectedBoards"
              :name="'board-select-' + board.id"
              type="checkbox"
              :value="board.id"
            />
            <div class="listo-checkbox">
              <CheckIcon />
            </div>
          </div>
          <label :for="'board-select-' + board.id">{{ board.name }}</label>
        </div>
      </div>
      <AppButton variant="success" @click="addBoard">Update Space</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { CheckIcon } from 'vue-feather-icons'

const boardsModule = namespace('boards')
const spacesModule = namespace('spaces')
import { Boards } from '@/types/board'

@Component({
  name: 'space-add-form',
  components: {
    CheckIcon,
  },
})
export default class SpaceAddForm extends Vue {
  @Prop() spaceId!: string
  @Prop() spaceBoards!: string[]

  @boardsModule.State boards!: Boards

  @spacesModule.Action addBoardsToSpace!: (payload: {
    boardIds: string[]
    spaceId: string
  }) => void

  selectedBoards: string[] = []

  mounted() {
    this.selectedBoards = this.spaceBoards
  }

  addBoard() {
    this.$store
      .dispatch('spaces/addBoardsToSpace', {
        spaceId: this.spaceId,
        boardIds: this.selectedBoards,
      })
      .then(() => {
        this.$emit('completed')
      })
  }
}
</script>

<style lang="css" scoped>
.space-board-select-items {
  max-height: 300px;
}
</style>
