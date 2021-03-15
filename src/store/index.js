import { createStore, createLogger } from 'vuex'
import loader from './loader'
import controls from './controls'
import game from './game'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    loader,
    controls,
    game
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : []
})
