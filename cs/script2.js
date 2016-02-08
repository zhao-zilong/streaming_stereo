function onOpen(event) {
    document.getElementById('messages').innerHTML
      = 'Connection established';
  }

  function onError(event) {
       document.getElementById('messages').innerHTML
          += '<br/>'+event.data;
  }

  var newstream = new webkitMediaStream();
      //var flag = true;
      // var webSocket =new WebSocket("ws://130.190.52.87:5566");
  var iceServer = {
            "iceServers": [{
                "url": "stun:stun.l.google.com:19302"
            }]
        };


  function start() {

      var webSocket =new WebSocket("ws://172.20.10.6:5566");
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


      // 发送offer和answer的函数，发送本地session描述

      var sendOfferFn = function(desc){

          pc.setLocalDescription(desc);
          send(JSON.stringify({
              "event": "_offer",
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



      function remotevideo() {
      	  // if (window.stream) {
      	  //   videoElement.src = null;
      	  //   window.stream.stop;
      	  // }
      	  var videoSource = videoSelect.value;
      	  var constraints = {
      	    video: {
      	      optional: [{
      	        sourceId: videoSource
      	      }]
      	    }
      	  };
      	  navigator.getUserMedia(constraints, successCallback3, errorCallback);
      }

      function successCallback3(stream) {
    	  newstream.addTrack(stream.getVideoTracks()[0]);

      }


      function remotevideo1() {
      	  // if (window.stream) {
      	  //   videoElement2.src = null;
      	  //   window.stream.stop;
      	  // }
      	  var videoSource = videoSelect2.value;
      	  var constraints = {
      	    video: {
      	      optional: [{
      	        sourceId: videoSource
      	      }]
      	    }
      	  };
      	  navigator.getUserMedia(constraints, successCallback4, errorCallback);
      }
      function successCallback4(stream) {

        newstream.addTrack(stream.getVideoTracks()[0]);
        //var k = newstream.getTracks().length;
        //alert(newstream.getTracks().length);

        pc.addStream(newstream);
        //如果是发起方则发送一个offer信令


        pc.createOffer(sendOfferFn, function (error) {
               console.log('Failure callback: ' + error);
            });
        //pc.addStream(newstream);
      }

      remotevideo();
      remotevideo1();


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
