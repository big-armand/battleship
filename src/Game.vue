<template lang="html">
  <div>
    <h1>Game id : {{ gameId }}</h1>
    <h2>{{ clientname }}</h2>
    <h2>Opponent's name : {{opponentName}}</h2>
    <div id="app">
      <span v-html="info"></span>
      <span v-html="status"></span>
    </div>
    <table class="table table-responsive blue">
      <thead>
        <tr>
          <td></td>
          <th v-for="(col, idx2) in items" scope="col">{{ idx2 + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx1) in items">
          <th scope="row">{{ char[idx1] }}</th>
          <td v-for="(col, idx2) in row">
             <button :id="items[idx1][idx2]" @click="handleClick(idx1, idx2)">{{ items[idx1][idx2] }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="begin">
      <h2 v-if="won == ''">Attack grid {{turn}}'s turn</h2>
      <h2 v-else class="success">{{won}} won!!</h2>
      <table class="table table-responsive blue">
        <thead>
          <tr>
            <td></td>
            <th v-for="(col, idx2) in items" scope="col">{{ idx2 + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx1) in items">
            <th scope="row">{{ char[idx1] }}</th>
            <td v-for="(col, idx2) in row">
              <button :id="'x' + items[idx1][idx2]" @click="attack(idx1, idx2)">{{ items[idx1][idx2] }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'gameId',
    'opponentName'
  ],
  data() {
    return {
      start: true,
      counter: 0,
      info: "",
      status: "",
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
      shipColor: ['yellow', 'blue', 'lightblue', 'pink', 'orange'],
      shipNames: ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat'],
      shipCoord: [ [-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1] ],
      begin: false,
      turn: '',
      hitPoints: [],
      won: ""
    }
  },
  sockets: {
    begin: function (id, name) {
      if (this.gameId == id) {
        this.begin = true
        this.turn = name
      }
    },
    attacked: function (id, name, x, y) {    
      if (id == this.gameId) {
        this.hitPoints.push([x, y])
        if (this.onShip(x, y)) {
          document.querySelector('#' + this.items[x][y]).style.background = 'red'
          this.$socket.client.emit('hit', this.gameId, this.clientname, x, y)
          if (this.hasWon()) {
            this.$socket.client.emit('win', this.gameId, this.opponentName)
          }
        } else {
          document.querySelector('#' + this.items[x][y]).style.background = 'green'
        }
      }
    },
    turn: function (id, name) {
      if (this.gameId == id) {
        this.turn = name
      }
    },
    hit: function (id, name, x, y) {
      if (this.gameId == id && name != this.clientname) {
        document.querySelector('#x' + this.items[x][y]).style.background = 'green'
      }
    },
    winner: function (id, name) {
      console.log('potato');
      
      if (this.gameId == id) {
        this.won = name
      }
    }
  },
  mounted: function() {
    this.askName()
    this.putShipsAlert()
    //this.$socket.client.emit('shipsPlaced', this.id, name)

    // while (this.isOn()) {
    //   this.attack()
    //   // allow other to attack
    //   // first one to have name plays first
    // }
  },
  methods: {
    askName: function() {
      while (this.clientname == "") {
        this.clientname = prompt("Enter your name: ")
      }
      this.$emit('name', this.clientname)
    },
    putShipsAlert: function() {
      var i = 0
      var content = ""
      for (; i < this.ships.length; ++i) {
          content += "<div>" + this.shipNames[i] + ': length -> ' + this.ships[i] + ' ; Coord -> ' + this.shipCoord[2*i ] + ' | ' + this.shipCoord[2 * i + 1] + ' ; color -> ' + this.shipColor[i] + "</div>"
      }
      this.info = content
      if (this.counter < this.shipCoord.length) {
        if (this.counter % 2 == 0) {
          this.status = "<div style=\"color: red; text-align: center;\">Choose a starting point for your " + this.shipNames[this.counter/2] + "</div>"
        } else {
          this.status = "<div style=\"color: red; text-align: center;\">Choose an ending point for your " + this.shipNames[(this.counter - 1) / 2] + "</div>"
        }
      } else {
        this.status = "<div style=\"color: red; text-align: center;\">All boats placed</div>"
        this.$socket.client.emit('shipsPlaced', this.gameId, this.clientname)
      }
    },
    handleClick: function(x, y) {
      if (this.counter < this.shipCoord.length) {
        if (this.counter % 2 != 0) {
          if (this.crossing(x, y)) {
            this.status = "<div style=\"color: red; text-align: center;\">" + this.shipNames[(this.counter - 1) /2] + " is misplaced : over another ship</div>"
            this.counter--
            return
          }
          var size = this.ships[this.counter/2-0.5]
          if (Math.abs(this.shipCoord[this.counter-1][0] - x) != size - 1 && Math.abs(this.shipCoord[this.counter-1][1] - y) != size - 1) {
            this.status = "<div style=\"color: red; text-align: center;\">" + this.shipNames[(this.counter - 1) /2] + " is misplaced</div>"
            this.counter--
            return
          } else {
            this.colorShips(x,y)
          }
        }

        this.shipCoord[this.counter][0] = x
        this.shipCoord[this.counter][1] = y
        this.counter++
        this.putShipsAlert()
      }
    },
    crossing: function(x,y) {
      var x_origin = this.shipCoord[this.counter-1][0]
      var y_origin = this.shipCoord[this.counter-1][1]
      var segment = []
      if (x != x_origin) {
        for (var i = Math.min(x, x_origin); i <= Math.max(x, x_origin); ++i) {
          segment.push([i,y]);
        }
      } else {
        for (var i = Math.min(y, y_origin); i <= Math.max(y, y_origin); ++i) {
          segment.push([x,i]);
        }
      }
      for (var i = 0; i < this.counter-1; i+=2) {
        var segment2 = []
        if (this.shipCoord[i][0] != this.shipCoord[i+1][0]) {
          for (var k = Math.min(this.shipCoord[i][0], this.shipCoord[i+1][0]); k <= Math.max(this.shipCoord[i][0], this.shipCoord[i+1][0]); ++k) {
            segment2.push([k,this.shipCoord[i][1]])
          }
        } else {
          for (var k = Math.min(this.shipCoord[i][1], this.shipCoord[i+1][1]); k <= Math.max(this.shipCoord[i][1], this.shipCoord[i+1][1]); ++k) {
            segment2.push([this.shipCoord[i][0],k])
          }
        }
        if (this.coordArrEquals(segment, segment2)) {
          return true;
        }
      }
      return false;
    },
    colorShips: function(x,y) {
      if (x < this.shipCoord[this.counter-1][0]) {
        for (var i = x; i <= this.shipCoord[this.counter-1][0]; ++i) {
          document.querySelector('#' + this.items[i][y]).style.background = this.shipColor[(this.counter-1)/2]
        }
      } else if (x > this.shipCoord[this.counter-1][0]) {
        for (var i = x; i >= this.shipCoord[this.counter-1][0]; --i) {
          document.querySelector('#' + this.items[i][y]).style.background = this.shipColor[(this.counter-1)/2]
        }
      } else if (y > this.shipCoord[this.counter-1][1]) {
        for (var i = y; i >= this.shipCoord[this.counter-1][1]; --i) {
          document.querySelector('#' + this.items[x][i]).style.background = this.shipColor[(this.counter-1)/2]
        }
      } else if (y < this.shipCoord[this.counter-1][1]) {
        for (var i = y; i <= this.shipCoord[this.counter-1][1]; ++i) {
          document.querySelector('#' + this.items[x][i]).style.background = this.shipColor[(this.counter-1)/2]
        }
      }
    },
    coordArrEquals: function(a, b) {
      for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
          var k = 0
          var l = 0
          while (a[i][k] == b[j][l]) {
            l++
            k++
            if (k == a[i].length) {
              return true
            }
          }
        }
      }
    },
    attack: function(x, y) {
      if (this.turn == this.clientname) {
        document.querySelector('#x' + this.items[x][y]).style.background = 'white'
        this.$socket.client.emit('attack', this.gameId, this.clientname, x, y)
      }
    },
    onShip: function(x, y) {
      for (var c = 0; c < this.shipCoord.length; c+=2) {        
        if (this.onShipArr(this.shipCoord[c], this.shipCoord[c+1], x, y)) {
          return true
        }
      }
      return false
    },
    onShipArr: function (p1, p2, x, y) {
      if (p1[1] == p2[1] && p1[1] == y) {
        for (var i = Math.min(p1[0], p2[0]); i <= Math.max(p1[0], p2[0]); ++i) {
          if (i == x) {
            return true
          }
        }
      }
      if (p1[0] == p2[0] && p1[0] == x) {
        for (var i = Math.min(p1[1], p2[1]); i <= Math.max(p1[1], p2[1]); ++i) {
          if (i == y) {
            return true
          }
        }
      }
      return false
    },
    hasWon: function () {
      var bool
      for (var c = 0; c < this.shipCoord.length; c++) {
        bool = false
        for (var k = 0; k < this.hitPoints.length; k++) {
          bool |= this.hitPoints[k][0] == this.shipCoord[c][0] && this.hitPoints[k][1] == this.shipCoord[c][1]
        }
        if (!bool)
          return false
      }
      return true
    }
  },
}
</script>

<style lang="css" scoped>
  .blue {
    color: blue;
  }
  .success {
    color:pink;
    background-color: black;
  }
</style>
