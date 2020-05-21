<template>
  <div>
    <h1>{{ title }}</h1>
    <div v-if="id == 0">
      <div>
        <label>Enter ID : </label>
        <input type="text" placeholder="ID" v-model="userID">
        <button @click="enterGame">Enter Game</button>
      </div>
      <div>
        <p>OR</p>
        <button  @click="getId()">Create Game</button>
      </div>
    </div>
    <div>
      <game-tile v-if="id != 0" :gameId="id" :opponentName="opName" @name="setName"></game-tile>
    </div>
  </div>
</template>

<script>
import Game from './Game.vue'

export default {
  data() {
    return {
      title: 'Battleship',
      url: 'game',
      id: 0,
      opName: '',
      name: '',
      userID: 0
    }
  },
  sockets: {
    connect: function () {
    },
    opponent: function (id, data) {
      if (id == this.id) {
        this.opName = data
      }
    },
    firstplayer(id, name) {
      if (id == this.id) {
        this.opName = name
      }
    }
  },
  components: {
    'game-tile': Game
  },
  methods: {
    getId() {
      this.id = Math.ceil(Math.random()*100000);
      //this.$socket.client.emit('id', this.id)
    },
    setName(name) {
      this.$socket.client.emit('newPlayer', this.id, name)
      this.name = name
    },
    enterGame() {
      this.id = this.userID;
    }
  }
};
</script>
