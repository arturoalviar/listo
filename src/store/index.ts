import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import app from '@/store/modules/app'
import boards from '@/store/modules/boards'
import favBoards from '@/store/modules/favBoards'
import columns from '@/store/modules/columns'
import checklists from '@/store/modules/checklists'
import tasks from '@/store/modules/tasks'
import labels from '@/store/modules/labels'
import search from '@/store/modules/search'
import snackbar from '@/store/modules/snackbar'
import settings from '@/store/modules/settings'
import spaces from '@/store/modules/spaces'
import RootState from '@/types/store'
import { saveStatePlugin } from '@/utils'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  plugins: [saveStatePlugin],
  modules: {
    app,
    boards,
    favBoards,
    columns,
    checklists,
    tasks,
    labels,
    search,
    snackbar,
    settings,
    spaces,
  },
}

export default new Vuex.Store<RootState>(store)
