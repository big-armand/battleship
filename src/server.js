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
    id = 0;

io.on('connection', (socket) => {
    console.log('someone connected');
    socket.on('disconnet', () => {
        console.log("A user disconnected");
    });
    socket.on('newPlayer', (id, data) => {    
        if (!player1[id] || data.localeCompare(player1[id]) == 0 ) {
            player1[id] = data;
            socket.broadcast.emit('opponent', id, data);
        } else if (!player2[id]) {
            player2 = data;
            socket.broadcast.emit('opponent', id, data);
            socket.emit('firstplayer', id, player1[id]);
        }
    });
    // socket.on('id', (data) => {
    //     id = data;
    //     console.log("ID : " + data);
    // });
});