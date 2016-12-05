/**
 * Simple directive for showing source code
 */
export default {
  name: 'source',
  bind (el, { value, modifiers }) {
    console.log(el)
  },
  inserted () {
    console.log('inserted')
  },
  update () {
    console.log('update')
  },
  componentUpdated () {
    console.log('componentUpdated')
  },
  unbind () {
    console.log('unbind')
  }
}
