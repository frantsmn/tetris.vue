import { createStore, createLogger } from 'vuex'
import session from './session'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    session
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : []
})
