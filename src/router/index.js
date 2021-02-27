import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index.js'

import Start from '../views/Start.vue'
import Game from '../views/Game.vue'

// Overlays
import NewGame from '../views/overlay/NewGame.vue'
import Settings from '../views/overlay/Settings.vue'
import Scores from '../views/overlay/Scores.vue'
import Help from '../views/overlay/Help.vue'

const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    children: [
      {
        path: 'new',
        component: NewGame
      },
      {
        path: 'settings',
        component: Settings
      },
      {
        path: 'scores',
        component: Scores
      },
      {
        path: 'help',
        component: Help
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  // Запрет перехода на компонент Game
  // если не выбран gamemode
  if (
    to.matched.some(component => component.name === 'Game') &&
    store.state.session.gamemode.length === 0
  ) {
    router.replace('/')
  }

  next();
})

export default router
