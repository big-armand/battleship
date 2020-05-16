<template>
  <div>
    <h1>{{ title }}</h1>
    <a v-bind:href="url + getId()">Click me!</a>
  </div>
</template>

<script>
var id = 0
export default {
  data() {
    return {
      title: 'Battleship',
      url: 'game'
    }
  },
  methods: {
    getId() {
      return Math.ceil(Math.random()*100000);
    }
  }
};
</script>
