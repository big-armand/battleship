<template lang="html">
  <div>
    <h1>Page Loaded with id : {{ idUrl }}</h1>
    <h2>{{ clientname }}</h2>
    <table class="table table-responsive">
      <thead>
        <tr>
          <td></td>
          <th v-for="(col, idx2) in items" scope="col">{{ idx2 + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx1) in items">
          <th scope="row">{{ char[idx1] }}</th>
          <td class="table-success" v-for="(col, idx2) in row">
             <button>{{ items[idx1][idx2] }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="app">
      <span v-html="info"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: "",
      clientname : "",
      char: ['A','B','C','D','E','F','G','H','I','J'],
      items:[
         ['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10'],
         ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'],
         ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10'],
         ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10'],
         ['E1','E2','E3','E4','E5','E6','E7','E8','E9','E10'],
         ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10'],
         ['G1','G2','G3','G4','G5','G6','G7','G8','G9','G10'],
         ['H1','H2','H3','H4','H5','H6','H7','H8','H9','H10'],
         ['I1','I2','I3','I4','I5','I6','I7','I8','I9','I10'],
         ['J1','J2','J3','J4','J5','J6','J7','J8','J9','J10'],
      ],
      ships: [5, 4, 3, 3, 2],
      shipNames: ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat']
    }
  },
  computed: {
    idUrl: function () {
      return window.location.pathname.split('/game')[1] || 0
    },

  },
  mounted: function() {
    this.askName()
    this.putShips()
  },
  methods: {
    askName: function() {
      while (this.clientname == "")
        this.clientname = prompt("Enter your name: ")
    },
    putShips: function() {
      var i = 0
      var content = ""
      for (; i < this.ships.length; ++i) {
          content += "<div>" + this.ships[i] + ' ' +this.shipNames[i] + "</div>"
      }
      this.info = content
    }
  },
}
</script>

<style lang="css" scoped>
</style>
