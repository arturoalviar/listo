import { Store } from 'vuex'
import RootState from '@/types/store'

export function uuid() {
  return Math.random().toString(16).slice(2)
}

export function saveStatePlugin(store: Store<RootState>) {
  store.subscribe((mutation, state) => {
    localStorage.setItem(
      'listoState',
      JSON.stringify({
        ...state.app,
        ...state.favBoards,
        ...state.boards,
        ...state.columns,
        ...state.checklists,
        ...state.tasks,
        ...state.spaces,
      })
    )

    localStorage.setItem('listoSettings', JSON.stringify(state.settings))
  })
}

export function getElPosition(el: Element) {
  const rectProps = el.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  return {
    top: rectProps.top + scrollTop,
    left: rectProps.left + scrollLeft,
    height: rectProps.height,
    width: rectProps.width,
  }
}
