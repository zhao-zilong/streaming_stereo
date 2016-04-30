# streaming_stereo

###websocket-server.js

A webserver realised by websocket, it's used to exchange the configurations of two ends, then the two ends use P2P, for using this server, please go to folder cs, there is a module which is indispensable pour websocket-server.js

###Folder cs:

For sending two videos from a client to a server

###Folder datachannel

For sending the data catched in port 50000 where on put the informations de rotations from Oculus Rift

###Folder stereo

For sending an audio on stereo from a client to a server 

# order of starting this program

1. Start websocket-server.js by command 'node websocket-server.js'(if you want to test stereo effect, you have to start another websocket server too, like 'node websocket-server1.js')
2. Open client.html and server.html in Chrome, login in server first, then connect client



