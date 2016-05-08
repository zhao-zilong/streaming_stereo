# streaming_stereo

## Condition of this program
All these codes can run perfectly in OS X El Capitan, the program of obtaining the rotation information of Oculus Rift tested only in Xcode, the type of Arduino is Arduino Uno, all html files have to run under server appache. For the part of streaming videos, it's realised by WebRTC, so please use chrome to test all html files.


###websocket-server.js

A webserver realised by websocket, it's used to exchange the configurations of two ends, then the two ends use P2P, for using this server, please go to folder cs, there is a module which is indispensable pour websocket-server.js

###Folder cs:

For sending two videos from a client to a server

###Folder datachannel

For sending the data catched in port 50000 where on put the informations de rotations from Oculus Rift

###Folder stereo

For sending an audio on stereo from a client to a server 

# Order of starting this program

Preparation:
Connect two cameras and microphones to client's computer, connect Arduino uno and Oculus Rift to server's computer

1. Start websocket-server.js by command 'node websocket-server.js'(if you want to test stereo effect, you have to start another websocket server too, like 'node websocket-server1.js')
2. Open client.html and server.html in Chrome, login in server first, then connect client, if everything is right, server can show two videos streamed from client's cameras 
3. Use the files here: https://github.com/possan/oculus-rest  this is a program executable in Xcode, it can capture the rotation information of Oculus Rift, start this program with a connected Oculus Rift, the console will show that there is a Oculus detected if all lines of Oculus connect well.
4. Install cylon.js, follow the tutorial to install the files for connecting Arduino with your computer and cylon.js, then use command 'node cylontest.js', if the led is actived, the Arduino works. In other hand, open client.hmtl in Chrome, it can transmit the rotation information of Oculus Rift to Arduino.

### A short video to show the resultat
https://www.youtube.com/watch?v=LneAnyqop7w
### A powerpoint to see more this project
http://air.imag.fr/images/6/67/Soutenance_ZHAO_HAMMOUTI.pdf



