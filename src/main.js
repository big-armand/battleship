import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended';
//import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"
import NotFound from './NotFound.vue'

Vue.config.productionTip = false

Vue.use(VueSocketIOExt, SocketIO('localhost:1234'))

new Vue({
  el: '#app',
  render (h) {
    return h(App)
  }
})
