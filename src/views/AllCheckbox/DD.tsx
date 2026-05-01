import { defineComponent } from 'vue'

export default defineComponent({
  // name: 'DD',
  setup(props, { slots }) {
    return () => <ins>{slots.default!()}</ins>
  }
})
