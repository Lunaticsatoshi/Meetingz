const express = require('express');
const app = express()
const server = require('http').Server(app);
const socket = require('socket.io')(server);

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
})