
	var positions = [];

	var tempArray = [];

	var loadArrayPosition = function( position ){

		tempArray.x = 0;
		tempArray.y = 0;
		tempArray.w = 0;
		tempArray.h = 0;

		if(positions.length < 20){

			positions[positions.length] = position;

		}
		else{

			for( i = 0 ; i < positions.length-1 ; i++ ){
				positions[i] = positions[i+1];
				tempArray.x += positions[i][0];
				tempArray.y += positions[i][1];
				tempArray.w += positions[i][2];
				tempArray.h += positions[i][3];
			}

			positions[positions.length-1] = position;

		}

		tempArray.x /= 20;
		tempArray.y /= 20;
		tempArray.w /= 20;
		tempArray.h /= 20;

		return tempArray;

	};

	var captureImage = function() {

		console.log('click');

        $output = $("#output");
        video = $("#video").get(0);
        chaleco = $("#chaleco").get(0);
    	var scale = 1;

        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(chaleco, tempArray.x * scale - 10 * scale, tempArray.y * scale - 80 * scale, tempArray.w * scale, tempArray.h * scale);

        $output.empty();
        var img = document.createElement("img");
        img.src = canvas.toDataURL();
        $output.prepend(img);

    };

	window.onload = function() {

        $("#capture").click(captureImage); 
	
		var smoother = new Smoother([0.9999999, 0.9999999, 0.999, 0.999], [0, 0, 0, 0]),
			video = document.getElementById('video'),
			canvas = document.getElementById('canvas'),
			chaleco = document.getElementById('chaleco'),
			detector;

			var ctx = canvas.getContext("2d");

			radius = 20;

			circle_coords = [
				{
					x: 50,
					y: 200,
					color: "green",
				},
				{
					x: 50,
					y: 300,
					color: "red",
				},
				{
					x: 270,
					y: 50,
					color: "yellow",
				},
				{
					x: 390,
					y: 50,
					color: "blue",
				},
				{
					x: 590,
					y: 200,
					color: "pink",
				},
				{
					x: 590,
					y: 300,
					color: "gray",
				},
			]

			for(i = 0 ; i < circle_coords.length; i++){
				ctx.beginPath();
      			ctx.arc(circle_coords[i].x, circle_coords[i].y, radius, 0, 2 * Math.PI, false);
	      		ctx.fillStyle = circle_coords[i].color;
	      		ctx.fill();
			}
				
		try {
			compatibility.getUserMedia({video: true}, function(stream) {
				try {
					video.src = compatibility.URL.createObjectURL(stream);
				} catch (error) {
					video.src = stream;
				}
				compatibility.requestAnimationFrame(play);
			}, function (error) {
				alert('WebRTC not available');
			});
		} catch (error) {
			alert(error);
		}
		
		function play() {
			compatibility.requestAnimationFrame(play);
			if (video.paused) video.play();
          	
			if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
	          	
	          	// Prepare the detector once the video dimensions are known:
	          	if (!detector) {
		      		var width = ~~(60 * video.videoWidth / video.videoHeight);
					var height  =60;
		      		detector = new objectdetect.detector(width, height, 1.1, objectdetect.upperbody);
		      		handopen = new objectdetect.detector(width, height, 1.1, objectdetect.handopen);
		      	}
          		
          		// Perform the actual detection:
				var coords = detector.detect(video, 1);
				if (coords[0]) {
					var coord = coords[0];
					coord = smoother.smooth(coord);
					// console.log(coord);
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					// Rescale coordinates from detector to video coordinate space:
					coord[0] *= video.videoWidth / detector.canvas.width;
					coord[1] *= video.videoHeight / detector.canvas.height;
					coord[2] *= video.videoWidth / detector.canvas.width;
					coord[3] *= video.videoHeight / detector.canvas.height;

					fill = [
						~~(coord[0] + coord[2] * 0.8/8 + video.offsetLeft),
						~~(coord[1] + coord[3] * 3.2/8 + video.offsetTop),
						~~(coord[2] * 6/7),
						~~(coord[3] * 6/5)
					];

					pos = loadArrayPosition(fill);

					//ctx.fillRect(pos.x,pos.y,pos.w,pos.h);
					// ctx.fillRect(5,0,160,120);
					
					// Display chaleco overlay: 
					chaleco.style.left    = pos.x + 'px';
					chaleco.style.top     = pos.y + 'px';
					chaleco.style.width   = pos.w + 'px';
					chaleco.style.height  = pos.h + 'px';
					chaleco.style.opacity = 1;
					
				} else {
					var opacity = chaleco.style.opacity - 0.2;
					chaleco.style.opacity = opacity > 0 ? opacity : 0;
				}
			}
		}
		
		[].slice.call(document.getElementById('list').children).forEach(function(e) {
			e.addEventListener('click', function() {
				chaleco.src = e.src;
			}, false);
		});
	};
	
