//app.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
var $ = require( "jquery" );

//Socket.io
const io = require('socket.io')(server);
//We'll store our online users here
let onlineUsers = {};
let channels = {"General" : []};

io.on("connection", (socket) => {
  // Make sure to send the channels to our chat file
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);
});


const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars');
})


$(document).ready( () => {
  //Connect to the socket.io server
  const socket = io.connect();
})
io.on("connection", (socket) => {
  // Do something when a new socket(client) connection is formed
})

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})