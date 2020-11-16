<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { VNode, CreateElement } from 'vue'

import escapable from '@/mixins/escapable'
import toggleable from '@/mixins/toggleable'

import { getSlot, createAbsoluteElement, removeElement } from '@/utils/helpers'
import { getElPosition } from '@/utils'

@Component({
  name: 'app-popover',
})
export default class AppPopoverComponent extends mixins(toggleable, escapable) {
  @Prop({ default: 'fade' }) transition!: string
  @Prop({ default: 'div' }) tag!: string
  @Prop() target!: Element

  $refs!: {
    popover: HTMLElement
    content: HTMLElement
    trigger: HTMLInputElement
  }

  _bodyEl!: undefined | HTMLElement

  @Watch('isActive')
  onIsActiveChanged() {
    this.updateAppendToBody()
  }

  genTransition() {
    const content = this.genContent()

    if (!this.transition) return content

    return this.$createElement(
      'transition',
      {
        props: {
          name: this.transition,
        },
      },
      [content]
    )
  }

  genContent() {
    return this.$createElement(
      'div',
      {
        ref: 'content',
        directives: [
          {
            name: 'show',
            value: this.isActive,
          },
        ],
      },
      getSlot(this, 'content')
    )
  }

  getTrigger() {
    return this.$createElement(
      'div',
      {
        staticClass: 'listo-popover-trigger',
        ref: 'trigger',
      },
      getSlot(this)
    )
  }

  updateAppendToBody() {
    const popover = this.$refs.popover

    if (popover && this.isActive) {
      const trigger = this.$refs.trigger
      let position = { top: 0, left: 0 }
      // update wrapper popover
      const tooltipEl = this.$data._bodyEl.children[0]
      if (this.$vnode && this.$vnode.data && this.$vnode.data.staticClass) {
        tooltipEl.classList.add(this.$vnode.data.staticClass)
      }
      if (trigger) {
        tooltipEl.style.width = `${trigger.clientWidth}px`
        tooltipEl.style.height = `${trigger.clientHeight}px`

        const { top, left } = getElPosition(trigger)
        position.top = top
        position.left = left
      }
      if (this.target) {
        const { top, left } = getElPosition(this.target)
        position.top = top
        position.left = left
      }

      this.$data._bodyEl.style.position = 'absolute'
      this.$data._bodyEl.style.top = `${position.top}px`
      this.$data._bodyEl.style.left = `${position.left}px`
      this.$data._bodyEl.style.zIndex = '99'
    } else {
      this.$data._bodyEl.style.zIndex = '-99'
    }
  }

  handleEscKey({ keyCode }: KeyboardEvent) {
    if (this.isActive && this.isEscKey(keyCode)) {
      this.isActive = false
    }
  }

  mounted() {
    this.$data._bodyEl = createAbsoluteElement(this.$refs.content)
    this.updateAppendToBody()
  }

  beforeDestroy() {
    removeElement(this.$data._bodyEl)
  }

  render(h: CreateElement): VNode {
    return h(
      this.tag,
      { staticClass: 'listo-popover w-full', ref: 'popover' },
      [this.genTransition(), this.getTrigger()]
    )
  }
}
</script>

