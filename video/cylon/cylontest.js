var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
// io.sockets.on('connection', function (socket) {
//     console.log('Un client est connecté !');
// });


server.listen(9000);





'use strict';

var Cylon = require('cylon');
var io = require('socket.io').listen(server);


Cylon.robot({
  name: 'rosie',

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1421' }
  },

  devices: {
    led: { driver: 'led', pin: 13 }
  },

  work: function() {
    // for this example with sockets
    // we are going to be interacting
    // with the robot using the code in
    // ./**-client.html
    io.sockets.on('connection', function (socket) {
    //console.log('Un client est connecté !');
    socket.on('message', function(message) {
          var jsonstr = JSON.stringify(message);
          console.log('Le serveur a un message pour vous : ' + jsonstr);
        })
    });
  }
});

// ensure you install the API plugin first:
// $ npm install cylon-api-socket-io
// Cylon.api('socketio',
// {
//   host: '0.0.0.0',
//   port: '9000'
// });

Cylon.start();
