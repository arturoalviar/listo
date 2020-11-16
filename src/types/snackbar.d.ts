type SnackbarVariant = 'success' | 'error' | 'warning' | 'info'

interface Snackbar {
  isActive: boolean
  message: string
  timeout: number
  variant: SnackbarVariant
}

export default Snackbar
export { SnackbarVariant }
