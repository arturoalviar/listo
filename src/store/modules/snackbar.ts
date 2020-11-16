import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

import Snackbar, { SnackbarVariant } from '@/types/snackbar'

@Module({ namespaced: true })
export default class SnackbarModule extends VuexModule implements Snackbar {
  isActive = false
  message = ''
  timeout = 5000
  variant: SnackbarVariant = 'success'

  @Mutation
  SHOW_SNACKBAR(payload: {
    message: string
    timeout?: number
    variant?: SnackbarVariant
  }) {
    const { message, timeout, variant } = payload
    this.isActive = true
    this.message = message
    this.variant = variant ? variant : this.variant
    this.timeout = timeout ? timeout : this.timeout
  }

  @Mutation
  CLOSE_SNACKBAR() {
    this.isActive = false
  }
}
