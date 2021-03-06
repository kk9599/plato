import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'

import I18n from 'application/plugins/i18n'
import Validator from 'application/plugins/validator'
import tap from 'application/directives/tap'
import createStore from 'application/store/create'
import createRouter from 'application/router/create'

import Root from 'application/components/root'

import faq from 'modules/faq'
import base from 'modules/base'
import demo from 'modules/demo'
import about from 'modules/about'

/**
 * Plugins part 1
 */

Vue.use(Vuex)
Vue.use(Router)

/**
 * Modules
 */

export const modules = {}
export const routes = []

register(base(Vue), {
  name: 'base',
  pathPrefix: ''
})
register(faq(Vue), {
  name: 'faq',
  pathPrefix: ''
})
register(demo(Vue), {
  name: 'demo'
})
register(about(Vue), {
  name: 'about'
})

export const store = createStore(modules)
export const router = createRouter(routes)

// keep vue-router and vuex store in sync.
sync(store, router)

// router hooks
router.beforeEach((to, from, next) => {
  store.dispatch('setProgress', 80)
  if (to.matched.some(m => m.meta.auth) && !store.getters.authorized) {
    next('/')
  } else {
    next()
  }
})
router.afterEach(() => {
  if (document.activeElement && document.activeElement.nodeName !== 'BODY') {
    document.activeElement.blur()
  }
  store.dispatch('setProgress', 100)
})

/**
 * Plugins part 2
 */

// 国际化，如果未使用，请移除
Vue.use(I18n, {
  // 翻译资源库
  data () {
    return store.getters.i18n
  }
})

// (表单)验证，如果未使用，请移除
Vue.use(Validator)

/**
 * Directives
 */

// tap event
Vue.directive('tap', tap)

/**
 * Let's go!
 */

new Vue(Vue.util.extend({ router, store }, Root)).$mount('#app')

/**
 * Register Modules
 */
function register ({ store: s, routes: r }, { name, pathPrefix }) {
  if (s) {
    modules[name] = s
  }
  if (r) {
    if (pathPrefix === undefined) {
      pathPrefix = '/' + name
    }
    r.forEach(({ path, ...rest }) => {
      path = pathPrefix + path
      path = path.replace(/\/+$/, '')
      routes.push({ path, ...rest })
    })
  }
}
