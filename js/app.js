(function () {

	// config start
	var OUTLINES = false;
	// config end

	window.hotSpots = [];

	var content = $('#content');
	var video = $('#webcam')[0];
	var canvases = $('canvas');

	var resize = function () {
		var ratio = video.width / video.height;
		var w = $(this).width();
		var h = $(this).height() - 110;

		if (content.width() > w) {
			content.width(w);
			content.height(w / ratio);
		} else {
			content.height(h);
			content.width(h * ratio);
		}
		canvases.width(content.width());
		canvases.height(content.height());
		content.css('left', (w - content.width()) / 2);
		content.css('top', ((h - content.height()) / 2) + 55);
	}
	$(window).resize(resize);
	$(window).ready(function () {
		resize();
		$('.fancybox').fancybox();
		$('#watchVideo').click(function () {
			$(".browsers").fadeOut();
			$(".browsersWithVideo").delay(300).fadeIn();
			$("#video-demo").delay(300).fadeIn();
			$("#video-demo")[0].play();
			$('.backFromVideo').fadeIn();
			event.stopPropagation();
			return false;
		});
		$('.backFromVideo a').click(function () {
			$(".browsersWithVideo").fadeOut();
			$('.backFromVideo').fadeOut();
			$(".browsers").fadeIn();
			$("#video-demo")[0].pause();
			$('#video-demo').fadeOut();
			event.stopPropagation();
			return false;
		});
		setTimeout(function(){
			console.log('enable_picture');
			enable_picture = true;
		}, 5000);
	});

	function hasGetUserMedia() {
		// Note: Opera builds are unprefixed.
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia || navigator.msGetUserMedia);
	}

	if (hasGetUserMedia()) {
		$('.introduction').fadeIn();
		$('.allow').fadeIn();
	} else {
		$('.browsers').fadeIn();
		return;
	}

	var webcamError = function (e) {
		alert('Webcam error!', e);
	};

	if (navigator.getUserMedia) {
		navigator.getUserMedia({audio: false, video: true}, function (stream) {
			video.src = stream;
			initialize();
		}, webcamError);
	} else if (navigator.webkitGetUserMedia) {
		navigator.webkitGetUserMedia({audio: false, video: true}, function (stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			initialize();
		}, webcamError);
	} else {
		//video.src = 'somevideo.webm'; // fallback.
	}

	var lastImageData;
	var canvasSource = $("#canvas-source")[0];
	var canvasBlended = $("#canvas-blended")[0];

	var contextSource = canvasSource.getContext('2d');
	var contextBlended = canvasBlended.getContext('2d');

	var taking_picture = false;
	var enable_picture = false;
	// mirror video
	contextSource.translate(canvasSource.width, 0);
	contextSource.scale(-1, 1);

	var image = {
		w: 200,
		h: 250,
		x: 200,
		y: 200
	};

	var c = 5;

	function initialize() {
		$('.introduction').fadeOut();
		$('.allow').fadeOut();
		$('.loading').delay(300).fadeIn();
		start();
	}

	function start() {
		$('.loading').fadeOut();
		$('#hotSpots').fadeIn();
		$('body').addClass('black-background');
		$(".instructions").delay(600).fadeIn();
		$(canvasSource).delay(600).fadeIn();
		$(canvasBlended).delay(600).fadeIn();
		$('#canvas-highlights').delay(600).fadeIn();
		$(window).trigger('start');
		update();
	}

	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame       ||
			   window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame    ||
			   window.oRequestAnimationFrame      ||
			   window.msRequestAnimationFrame     ||
			function (callback) {
				window.setTimeout(callback, 1000 / 20);
			};
	})();

	function update() {
		drawVideo();
		blend();
		checkAreas();
		requestAnimFrame(update);
	}

	function drawVideo() {
		contextSource.drawImage(video, 0, 0, video.width, video.height);
		contextSource.drawImage($('.chalecos').get(0), image.x, image.y, image.w, image.h);
	}

	function blend() {
		var width = canvasSource.width;
		var height = canvasSource.height;
		// get webcam image data
		var sourceData = contextSource.getImageData(0, 0, width, height);
		// create an image if the previous image doesn’t exist
		if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
		// create a ImageData instance to receive the blended result
		var blendedData = contextSource.createImageData(width, height);
		// blend the 2 images
		differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
		// draw the result in a canvas
		contextBlended.putImageData(blendedData, 0, 0);
		// store the current webcam image
		lastImageData = sourceData;
	}

	function fastAbs(value) {
		// funky bitwise, equal Math.abs
		return (value ^ (value >> 31)) - (value >> 31);
	}

	function threshold(value) {
		return (value > 0x15) ? 0xFF : 0;
	}

	function difference(target, data1, data2) {
		// blend mode difference
		if (data1.length != data2.length) return null;
		var i = 0;
		while (i < (data1.length * 0.25)) {
			target[4 * i] = data1[4 * i] == 0 ? 0 : fastAbs(data1[4 * i] - data2[4 * i]);
			target[4 * i + 1] = data1[4 * i + 1] == 0 ? 0 : fastAbs(data1[4 * i + 1] - data2[4 * i + 1]);
			target[4 * i + 2] = data1[4 * i + 2] == 0 ? 0 : fastAbs(data1[4 * i + 2] - data2[4 * i + 2]);
			target[4 * i + 3] = 0xFF;
			++i;
		}
	}

	var waitinPicture = null;

	var zindex = 1;

	var decreaseCounter = 5;

	var decreaserMessages = [
		'AHORA!',
		'Casi, casi',
		'Falta poco',
		'Posa rápido',
		];

	var decreaseNotific8 = function(){
		var params = {
            life: 1000,
            theme: 'lemon',
            heading: "Tomando Fotografía...",
            icon: ""+decreaseCounter,
            sticky: false,
            horizontalEdge: 'top',
            verticalEdge: 'bottom',
            onInit: function(data) {
              if (window.console) {
                // console.log('--onInit--');
                // console.log('data:');
                // console.log(data);
              }
            },
            onCreate: function(notification, data) {
              if (window.console) {
                // console.log('--onCreate--');
                // console.log('notification:');
                // console.log(notification);
                // console.log('data:');
                // console.log(data);
              }
            },
            onClose: function(notification, data) {
              if (window.console) {
                // console.log('--onClose--');
                // console.log('notification:');
                // console.log(notification);
                // console.log('data:');
                // console.log(data);
              }
            }
          },
          text = decreaserMessages[decreaseCounter];
		  $.notific8(text, params);
	}

	var takePicture = function() {

		console.log('taking_picture');

		waitinPicture = setInterval(function(){
			decreaseCounter--;
			console.log('decreaser: '+decreaseCounter);
			decreaseNotific8();
			console.log("waiting");
		},1000);;

		setTimeout(function(){

			clearInterval(waitinPicture);
			$output = $("#output");
	        camera = $("#canvas-source")[0];
	        chaleco = $(".chalecos").get(0);
	    	var scale = 1;

	        // var canvas_output = document.createElement("canvas");
	        // canvas_output.width = camera.videoWidth * scale;
	        // canvas_output.height = camera.videoHeight * scale;
	        // console.log(video);
	        // canvas_output.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
	        // canvas_output.getContext('2d').drawImage($('#chaleco').get(0), image.x * scale, image.y * scale, image.w * scale, image.h * scale);
	        zindex++;
	        // $output.empty();
	        var min = -10;
			var max = 10;
			var random = Math.floor(Math.random() * (max - min + 1)) + min;
	        var img = document.createElement("img");
	        img.src = canvasSource.toDataURL();
	        $(img).css("z-index",zindex);
	        $(img).css({ WebkitTransform: 'rotate(' + random + 'deg)'});
        	$output.prepend(img);
        	console.log('picture_taked');
        	taking_picture = false;

		}, 5000);        

    };

	function differenceAccuracy(target, data1, data2) {
		if (data1.length != data2.length) return null;
		var i = 0;
		while (i < (data1.length * 0.25)) {
			var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
			var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
			var diff = threshold(fastAbs(average1 - average2));
			target[4 * i] = diff;
			target[4 * i + 1] = diff;
			target[4 * i + 2] = diff;
			target[4 * i + 3] = 0xFF;
			++i;
		}
	}

	function setImagePosition(action){

		switch(action){
			case 'scale-up':
				image.h += 2;
				image.w += 2;
				image.x--;
				image.y--;
				break;
			case 'scale-down':
				image.h -= 2;
				image.w -= 2;
				image.x++;
				image.y++;
				break;
			case 'x-plus':
				image.x -= 5;
				break;
			case 'x-minus':
				image.x += 5;
				break;
			case 'y-plus':
				image.y += 5;
				break;
			case 'y-minus':
				image.y -= 5;
				break;	
			case 'take-picture':
				console.log
				if(enable_picture){
					if(!taking_picture){
						taking_picture = true;
						takePicture();
					}
				} 
				break;	
			case 'next-picture':
				image.y -= 5;
				break;			
		}

	}

	function checkAreas() {
		var data;
		for (var h = 0; h < hotSpots.length; h++) {
			var blendedData = contextBlended.getImageData(hotSpots[h].x, hotSpots[h].y, hotSpots[h].width, hotSpots[h].height);
			var i = 0;
			var average = 0;
			while (i < (blendedData.data.length * 0.25)) {
				// make an average between the color channel
				average += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2]) / 3;
				++i;
			}
			// calculate an average between the color values of the spot area
			average = Math.round(average / (blendedData.data.length * 0.25));
			if (average > 10) {

				// over a small limit, consider that a movement is detected
				data = {confidence: average, spot: hotSpots[h]};
				action = $(data.spot.el).attr('data-action');
				console.log(action);
				setImagePosition(action);
				$(data.spot.el).trigger('motion', data);
			}
		}
	}

	function getCoords() {
		$('#hotSpots').children().each(function (i, el) {
			var ratio = $("#canvas-highlights").width() / $('video').width();
			hotSpots[i] = {
				x:      this.offsetLeft / ratio,
				y:      this.offsetTop / ratio,
				width:  this.scrollWidth / ratio,
				height: this.scrollHeight / ratio,
				el:     el
			};
		});
		if (OUTLINES) highlightHotSpots();
	}

	$(window).on('start resize', getCoords);

	function highlightHotSpots() {
		var canvas = $("#canvas-highlights")[0];
		var ctx = canvas.getContext('2d');
		canvas.width = canvas.width;
		hotSpots.forEach(function (o, i) {
			ctx.strokeStyle = 'rgba(0,0,255,1)';
			ctx.lineWidth = 1;
			ctx.strokeRect(o.x, o.y, o.width, o.height);
		});
	}
})();