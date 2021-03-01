import { createStore, createLogger } from 'vuex'
import session from './session'
import gamepads from './gamepads'
import game from './game'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    session,
    gamepads,
    game
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : []
})
