import Vue from 'vue'
import App from './App.vue'
import NotFound from './NotFound.vue'
import Game from './Game.vue'

Vue.config.productionTip = false

const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const routes = {
  '/': App,
  '/game': Game
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname,
  },
  computed: {
    ViewComponent () {
      if (this.currentRoute.includes('/game'))
        return routes['/game']
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})
