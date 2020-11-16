import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import store from '@/store'
import Home from '@/views/Home.vue'

import { Route, NavigationGuardNext } from 'vue-router'

Vue.use(VueRouter)
Vue.use(VueMeta)

const mt = (title: string) => `${title} | Listo`

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/board/:uid',
    name: 'board',
    component: () =>
      import(/* webpackChunkName: "board" */ '@/views/Board.vue'),
    beforeEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
      const boardExists = store.state.boards.boards[to.params.uid]
      if (boardExists) {
        next()
      } else {
        next({
          name: 'notFound',
          params: {
            pageTitle: 'Bummer, board does not exist'
          }
        })
      }
    },
    children: [
      {
        path: 'task/:id',
        name: 'task',
        component: () =>
          import(/* webpackChunkName: "board" */ '@/views/Task.vue'),
        beforeEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
          const task = store.state.tasks.tasks[to.params.id]

          if (task && task.boardId === to.params.uid) {
            next()
          } else {
            next({
              name: 'notFound',
              params: {
                pageTitle: 'Bummer, task does not exist'
              }
            })
          }
        },
      },
    ],
  },
  {
    path: '/spaces/',
    name: 'spaces',
    component: () =>
      import(/* webpackChunkName: "spaces" */ '@/views/Spaces.vue'),
    meta: {
      title: 'Spaces',
    },
  },
  {
    path: '/space/:id',
    name: 'space',
    component: () =>
      import(/* webpackChunkName: "space" */ '@/views/Space.vue'),
    beforeEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
      const space = store.state.spaces.spaces[to.params.id]

      if (space) {
        next()
      } else {
        next({
          name: 'notFound',
          params: {
            pageTitle: 'Bummer, space does not exist'
          }
        })
      }
    },
  },
  {
    path: '/settings',
    redirect: '/settings/about',
    name: 'settings',
    component: () =>
      import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
      meta: {
        title: 'Settings',
      },
      children: [
        {
          path: 'about',
          name: 'settings-about',
          component: () =>
            import(/* webpackChunkName: "settings-about" */ '@/components/SettingsAbout.vue'),
            meta: {
              title: 'About',
            },
        },
        {
          path: 'appearance',
          name: 'settings-themes',
          component: () =>
            import(/* webpackChunkName: "settings-themes" */ '@/components/SettingsThemes.vue'),
            meta: {
              title: 'Appearance',
            },
        },
        {
          path: 'user-data',
          name: 'settings-user-data',
          component: () =>
            import(/* webpackChunkName: "settings-user-data" */ '@/components/SettingsUserData.vue'),
            meta: {
              title: 'User Data',
            },
        }, 
        {
          path: 'danger-zone',
          name: 'settings-delete-data',
          component: () =>
            import(/* webpackChunkName: "settings-delete-data" */ '@/components/SettingsDeleteData.vue'),
            meta: {
              title: 'Danger Zone',
            },
        },
      ],
  },
  {
    path: '*',
    name: 'notFound',
    component: () =>
    import(/* webpackChunkName: "notFound" */ '@/views/404.vue'),
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title ? mt(to.meta.title) : 'Listo'
  document.title = title
  next()
})

export default router
