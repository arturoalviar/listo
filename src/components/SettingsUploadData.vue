<template>
  <div class="my-4">
    <AppLoading v-if="isLoading" />
    <form enctype="multipart/form-data" novalidate>
      <label for="listo-upload-dropbox" class="listo-block-heading mb-2"
        >Upload existing data</label
      >
      <p class="text-sm mb-4">
        This will recover backup data and preserve your existing data.
      </p>
      <div v-if="isFailed" class="listo-panel is-alert">
        <div v-if="uploadErrors.length">
          <p class="font-bold">{{ filename }} has the following errors:</p>
          <p v-for="(errors, index) in uploadErrors" :key="'error-' + index">
            {{ errors.message }}
          </p>
        </div>
      </div>
      <div class="dropbox">
        <input
          id="listo-upload-dropbox"
          type="file"
          name="listo-upload-data"
          accept="application/json"
          class="input-file"
          @change="handleFile($event.target.files)"
        />
        <div>
          <p v-if="isInitial">
            Drag your Listo user data json file here to begin or click to browse
          </p>
          <p v-if="isLoading">Just a moment, merging {{ filename }}...</p>
          <p v-if="isSuccess">
            {{ filename }} has been uploaded but has yet to be merged
          </p>
          <p v-if="isFailed" class="font-bold">
            Failed to upload {{ filename }}. Please make sure {{ filename }} is
            formated correctly.
          </p>
        </div>
      </div>
    </form>
    <AppButton v-if="hasLoadedFile" variant="success" @click="mergeState"
      >Merge data</AppButton
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import { AppUploadData } from '@/types/app'

import AppLoading from '@/components/AppLoading.vue'

import validateUploadData from '@/utils/validateUploadData'

import { ErrorObject } from 'ajv'

const appModule = namespace('app')
const snackbarModule = namespace('snackbar')

const STATUS_INITIAL = 0,
  STATUS_SUCCESS = 1,
  STATUS_LOADING = 2,
  STATUS_FAILED = 3

@Component({
  name: 'settings-upload-data',
  components: {
    AppLoading,
  },
})
export default class SettingsDeleteDataComponent extends Vue {
  @appModule.Mutation MERGE_BOARD_DATA!: (payload: AppUploadData) => void
  @snackbarModule.Mutation SHOW_SNACKBAR!: (
    payload: Record<string, unknown>
  ) => void

  currentStatus = 0
  uploadedData: AppUploadData = {
    boards: {},
    columns: {},
    checklists: {},
    tasks: {},
    spaces: {},
    favBoards: [],
  }
  hasLoadedFile = false
  filename = ''
  uploadErrors!: ErrorObject<string, Record<string, any>>[] | null | undefined

  get isInitial() {
    return this.currentStatus === STATUS_INITIAL
  }
  get isSuccess() {
    return this.currentStatus === STATUS_SUCCESS
  }
  get isLoading() {
    return this.currentStatus === STATUS_LOADING
  }
  get isFailed() {
    return this.currentStatus === STATUS_FAILED
  }

  handleFile(files: FileList) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const file = event.target?.result as string

      this.filename = files[0].name

      try {
        this.uploadedData = JSON.parse(file)

        const validation = validateUploadData(this.uploadedData)

        if (validation.valid) {
          this.currentStatus = STATUS_SUCCESS
          this.hasLoadedFile = true
        } else {
          this.currentStatus = STATUS_FAILED
          this.uploadErrors = validation.errors
        }
      } catch (error) {
        this.currentStatus = STATUS_FAILED
      }
    }

    reader.onerror = () => {
      alert('Failed to read file!\n\n' + reader.error)
      reader.abort()
    }

    reader.readAsText(files[0])
  }

  async mergeState() {
    const confirm = await this.$root.$globalDialog.open({
      title: 'Merge uploaded data?',
      description:
        'This action will merge your existing data with the uploaded data. Nothing will be deleted.',
      actionLabel: 'Merge',
      variant: 'success',
    })
    if (confirm) {
      this.currentStatus = STATUS_LOADING
      this.MERGE_BOARD_DATA(this.uploadedData)
      this.hasLoadedFile = false
      this.currentStatus = STATUS_INITIAL
      this.SHOW_SNACKBAR({
        message: 'Backup data has been successfully merged',
      })
    }
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/shared/app-panel.css';
.dropbox {
  @apply cursor-pointer relative p-8 mb-8 rounded-md flex flex-col items-center justify-center;
  background: theme(colors.card);
  outline: 3px dashed var(--color-primary);
  outline-offset: -1rem;
  min-height: 200px;
}

.input-file {
  @apply opacity-0 absolute cursor-pointer;
  width: 100%;
  height: 200px;
}

.dropbox:hover {
  background: theme(colors.header);
}
</style>
