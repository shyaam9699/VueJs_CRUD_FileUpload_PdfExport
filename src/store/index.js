import Vue from 'vue'
import Vuex from 'vuex'
import eventsModule from './modules/events'
import snackbarModule from "./modules/snackbar"
import themeModule from './modules/theme'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    themeModule,
    eventsModule,
    snackbarModule
  }
})
