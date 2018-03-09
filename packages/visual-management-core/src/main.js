// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import App from './App'

Vue.config.productionTip = false

// Connect to the WebSocket
Vue.use(VueSocketio, process.env.SERVER_URL)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  sockets: {
    connect () {
      console.log('Socket connected')
      this.$socket.on('grid', (data) => console.log(data))
    }
  }
})
