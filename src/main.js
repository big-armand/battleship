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
    currentRoute: window.location.pathname,
    test: 'Je suis un test'

  },
  computed: {
    ViewComponent () {
      if (this.currentRoute.includes('/game'))
        return routes['/game']
      return routes[this.currentRoute] || NotFound
    }
  },
  methods : {
    change : function(test) {
      this.test = name
    }
  },
  render (h) {
    return h(this.ViewComponent, {
      attrs: {
        test: this.test
      }
    })
  }
})
