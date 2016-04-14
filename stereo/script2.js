function onOpen(event) {
    document.getElementById('messages').innerHTML
      = 'Connection established';
  }

  function onError(event) {
       document.getElementById('messages').innerHTML
          += '<br/>'+event.data;
  }

  var newstream = new webkitMediaStream();

  var iceServer = {
            "iceServers": [{
                "url": "stun:stun.l.google.com:19302"
            }]
        };


  function start() {

      var webSocket =new WebSocket("ws://192.168.1.10:5567");
        webSocket.onopen = function(event) {
        onOpen(event);
      };

      webSocket.onerror = function(event) {
            onError(event);
      };
      webSocket.onclose=function(event){
          //document.getElementById('messages').innerHTML
          //+= '<br/>'+str(event.data);
          alert(event.data)
      }

      //   var iceServer = {
      //         "iceServers": [{
      //             "url": "stun:stun.l.google.com:19302"
      //         }]
      //     };
      //
      //
      // // 创建PeerConnection实例 (参数为null则没有iceserver，即使没有stunserver和turnserver，仍可在局域网下通讯)
      //
       var pc = new webkitRTCPeerConnection(iceServer);


      function send(message) {
          waitForConnection(function () {
          webSocket.send(message);
          }, 1000);
        };

     function waitForConnection(callback, interval) {
          if (webSocket.readyState === 1) {
            callback();
          } else {
          //var that = this;
          // optional: implement backoff for interval here
          setTimeout(function () {
              waitForConnection(callback, interval);
          }, interval);
        }
      };



      function setSDPStereo(sdp) {
          var sdpLines = sdp.split('\r\n');
          var fmtpLineIndex = null;
          for (var i = 0; i < sdpLines.length; i++) {
              if (sdpLines[i].search('opus/48000') !== -1) {
                  var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                  break;
              }
          }
          for (var i = 0; i < sdpLines.length; i++) {
              if (sdpLines[i].search('a=fmtp') !== -1) {
                  var payload = extractSdp(sdpLines[i], /a=fmtp:(\d+)/ );
                  if (payload === opusPayload) {
                      fmtpLineIndex = i;
                      break;
                  }
              }
          }
          if (fmtpLineIndex === null) return sdp;
         sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat('; stereo=1; sprop-stereo=1');
          sdp = sdpLines.join('\r\n');
          return sdp;
      }
      function extractSdp(sdpLine, pattern) {
        var result = sdpLine.match(pattern);
        return result && result.length === 2 ? result[1] : null;
      }
      // 发送offer和answer的函数，发送本地session描述
      var sendOfferFn = function(desc){
          desc.sdp = setSDPStereo(desc.sdp);
          pc.setLocalDescription(desc);
          send(JSON.stringify({
              "event": "_offer",
              "data": {
                  "sdp": desc
              }
          }));
      };
      var sendAnswerFn = function(desc){
          desc.sdp = setSDPStereo(desc.sdp);
          pc.setLocalDescription(desc);
          webSocket.send(JSON.stringify({
              "event": "_answer",
              "data": {
                  "sdp": desc
              }
          }));
      };










      pc.onicecandidate = function(event){
          if (event.candidate !== null) {
              send(JSON.stringify({
                  "event": "_ice_candidate",
                  "data": {
                      "candidate": event.candidate
                  }
              }));
          }
      };





      function remoteaudio() {
        var audioSource = audioSelect.value;
        var constraints = {
          audio: {
            mandatory:
            {
              echoCancellation:false,
              googEchoCancellation:false,
          //    arc:opus/48000,
            },
            optional: [{
              sourceId: audioSource
            }]
          }
        };
        navigator.getUserMedia(constraints, successCallback5, errorCallback);
      }

      function successCallback5(stream) {
      //  newstream.addTrack(stream.getAudioTracks()[0]);
        pc.addStream(stream);
        //如果是发起方则发送一个offer信令


        pc.createOffer(sendOfferFn, function (error) {
               console.log('Failure callback: ' + error);
            });
        //pc.addStream(newstream);


      }

      remoteaudio();


      //处理到来的信令
      webSocket.onmessage = function(event){
          //alert(event.data);
          //document.getElementById('messages').innerHTML
         // += '<br/>'+event.data;
          var jsonstr="'"+event.data+"'";
          var json = JSON.parse(event.data);

          console.log('onmessage: ', json);

          //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
          if( json.event == "_ice_candidate" ){

              pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
          } else {
              //接收到确认符号
              if(json.event == "_answer"){
                  pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp),function(){},function(){});
                   // 发送ICE候选到其他客户端
              }
          }
      };
  }
