let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/')
});


http.listen(1234, () => {
    console.log('Listening on port *: 1234');
});

var player1 = [],
    player2 = [],
    done1 = [],
    done2 = [];

io.on('connection', (socket) => {
    socket.on('newPlayer', (id, data) => {    
        if (!player1[id] ) {
            player1[id] = data;
            socket.broadcast.emit('opponent', id, data);
        } else if (!player2[id]) {
            player2[id] = data;
            socket.broadcast.emit('opponent', id, data);
            socket.emit('firstplayer', id, player1[id]);
        }
    });
    socket.on('shipsPlaced', (id, name) => {
        
        if (player1[id] == name) {
            done1[id] = true;
        } else if (player2[id] == name) {
            done2[id] = true;
        }
        if (done1[id] && done2[id]) {
            socket.emit('begin', id, player1[id]);
            socket.broadcast.emit('begin', id, player1[id]);
        }
    });
    socket.on('attack', (id, name, x, y) => {
        if (name == player1[id]) {
            socket.emit('turn', id, player2[id]);
            socket.broadcast.emit('turn', id, player2[id]);
        } else {
            socket.emit('turn', id, player1[id]);
            socket.broadcast.emit('turn', id, player1[id]);
        }
        socket.broadcast.emit('attacked', id, name, x, y);
    });
    socket.on('hit', (id, name, x, y) => {
        socket.broadcast.emit('hit', id, name, x, y);
    });
    socket.on('win', (id, name) => {
        socket.emit('winner', id, name);
        socket.broadcast.emit('winner', id, name);
    });
    // socket.on('id', (data) => {
    //     id = data;
    //     console.log("ID : " + data);
    // });
});