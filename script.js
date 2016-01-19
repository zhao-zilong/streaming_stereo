    
navigator.getUserMedia = navigator.getUserMedia 
					   || navigator.webkitGetUserMedia
					   || navigator.mozGetUserMedia
					   || navigator.msGetUserMedia;

navigator.getUserMedia({
        video: true,
        audio: true
    }, 
    function(stream) {
        var video = document.getElementById('video');
		var video2 = document.getElementById('video2');
        video.src = window.URL.createObjectURL(stream);
		video2.src = window.URL.createObjectURL(stream);
        /*video.onloadedmetadata = function(e) {
            console.log("Label: " + stream.label);
            console.log("AudioTracks" , stream.getAudioTracks());
            console.log("VideoTracks" , stream.getVideoTracks());
        };*/
    }, 
    function(e) {
        console.log('Reeeejected!', e);
    });