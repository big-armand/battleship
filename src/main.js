import Vue from 'vue'
import App from './App.vue'
import NotFound from './NotFound.vue'
import Game from './Game.vue'

Vue.config.productionTip = false



const routes = {
  '/': App,
  '/game': Game
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
