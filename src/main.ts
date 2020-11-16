import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import './registerServiceWorker'

import AppButton from '@/components/AppButton.vue'
import AppCloseButton from '@/components/AppCloseButton.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppPopover from '@/components/AppPopover.vue'

import ClickOut from '@/directives/ClickOut'

declare module 'vue/types/vue' {
  interface Vue {
    $globalDialog: AppDialog
  }
}

Vue.component('AppButton', AppButton)
Vue.component('AppCloseButton', AppCloseButton)
Vue.component('AppPopover', AppPopover)

Vue.directive('click-out', ClickOut)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
