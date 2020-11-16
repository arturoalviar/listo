// taken from vuetify
export function getSlot(
  vm: Vue,
  name = 'default',
  data?: Record<string, unknown> | (() => Record<string, unknown>),
  optional = false
) {
  if (vm.$scopedSlots[name]) {
    return vm.$scopedSlots[name]!(data instanceof Function ? data() : data)
  } else if (vm.$slots[name] && (!data || optional)) {
    return vm.$slots[name]
  }
  return undefined
}

export function getSlotType<T extends boolean = false>(
  vm: Vue,
  name: string,
  split?: T
): (T extends true ? 'v-slot' : never) | 'normal' | 'scoped' | void {
  if (
    vm.$slots[name] &&
    vm.$scopedSlots[name] &&
    (vm.$scopedSlots[name] as any).name
  ) {
    return split ? ('v-slot' as any) : 'scoped'
  }
  if (vm.$slots[name]) return 'normal'
  if (vm.$scopedSlots[name]) return 'scoped'
}

export const keyCodes = Object.freeze({
  enter: 13,
  tab: 9,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  backspace: 8,
})

// taken from buefy
export function createAbsoluteElement(el: HTMLElement) {
  const root = document.createElement('div')
  root.style.position = 'absolute'
  root.style.left = '0px'
  root.style.top = '0px'
  const wrapper = document.createElement('div')
  root.appendChild(wrapper)
  wrapper.appendChild(el)
  document.body.appendChild(root)
  return root
}

export function removeElement(el: HTMLElement) {
  if (typeof el.remove !== 'undefined') {
    el.remove()
  } else if (typeof el.parentNode !== 'undefined' && el.parentNode !== null) {
    el.parentNode.removeChild(el)
  }
}
