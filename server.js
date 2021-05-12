const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid');
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server,{
    debug: true
})

app.use('/peerjs',peerServer);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req,res) => {
    res.render('room', {roomId: req.params.room});
})

io.on('connection', (socket) => {
    socket.on('room-joined', (roomId,userId) => {
        console.log(roomId,userId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected',userId)
        })
    })
})


const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
})