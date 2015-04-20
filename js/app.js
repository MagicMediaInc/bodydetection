(function () {

	// config start
	var OUTLINES = false;
	// config end

	window.hotSpots = [];

	var content = $('#content');
	var video = $('#webcam')[0];
	var canvases = $('canvas');
	var fb_data_href = 'http://programingphp.hol.es/uploads/';

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
		/*$('#picture-save').on('submit', function(event) {
			event.preventDefault();
			$.ajax({
				url: "./ajax/picture_save.php", // Url to which the request is send
				type: "POST",             // Type of request to be send, called as method
				data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
				contentType: false,       // The content type used when sending data to the server.
				cache: false,             // To unable request pages to be cached
				processData:false,        // To send DOMDocument or non processed data file it is set to false
				success: function(data)   // A function to be called if request succeeds
				{
					console.log(data);
					$('#loading').hide();
					$("#message").html(data);
				}
			});
		});*/
		$('#change-gender').on('click', function(event) {
			event.preventDefault();
			(gender_selected == 'male') ? gender_selected = 'female' : gender_selected = 'male';
			color_position = 0;
			vests_position = 0;
		});
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
			video.src = window.URL.createObjectURL(stream);
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

	var chaleco_pos = 0;
	var chaleco = $('.chalecos').get(chaleco_pos);
	var changing_image = false;
	var changing_color = false;

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
		var logo=document.createElement('img');
		logo.src='img/logo-4.png';
		// console.log('gender_selected = ' + gender_selected + ' - vests_position = ' + vests_position + ' - color_position = ' + color_position);
		//console.log(vests[gender_selected][vests_position].colors[color_position]);
		contextSource.drawImage(video, 0, 0, video.width, video.height);
		contextSource.drawImage($(vests[gender_selected][vests_position].colors[color_position]).get(0), image.x, image.y, image.w, image.h);
		// translate context to center of canvas
      	contextSource.translate(0, 0);
      	contextSource.scale(-1, 1);
      	contextSource.save()
      	contextSource.scale(1, 1);
		contextSource.drawImage(logo, -600, 400, 140, 38);
		contextSource.restore()
      	// flip context horizontally
      	contextSource.font = '15pt Calibri';
    	contextSource.fillStyle = 'black';
		contextSource.fillRect(-650,450,650,100);
		contextSource.save();
		contextSource.restore();
    	contextSource.fillStyle = 'green';
		contextSource.fillText($(vests[gender_selected][vests_position].colors[color_position]).attr("data-description"), -600,470);
      	contextSource.scale(-1, 1);
		contextSource.save();
		contextSource.restore();
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
		'',
		'AHORA!',
		'Casi, casi',
		'Falta poco',
		'Posa rápido',
		'Vamos a Tomar la Foto',
		'Camara Activada',
		];

	var color_position = 0;

	var vests_position = 0;

	var gender_selected = 'male';

	var vests = {
		female : [
			{
				colors: [
					'#female-01-blue',
					'#female-01-gray',
					'#female-01-green',
				],
			},
			{
				colors: [
					'#female-02-beige',
					'#female-02-black',
					'#female-02-gray',
					'#female-02-white',
				],
			},
		],
		male : [
			{
				colors: [
					'#male-01-blue',
					'#male-01-gray',
					'#male-01-green',
				],
			},
			{
				colors: [
					'#male-02-blue',
				],
			},
			{
				colors: [
					'#male-03-beige',
					'#male-03-green',
				],
			},
		]
	};

	var changed_image = 0;

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
              }
            },
            onCreate: function(notification, data) {
              if (window.console) {
              }
            },
            onClose: function(notification, data) {
              if (window.console) {
              }
            }
          },
          text = decreaserMessages[decreaseCounter];
		  $.notific8(text, params);
	}

	var takePicture = function() {

		console.log('taking_picture');

		waitinPicture = setInterval(function(){
			console.log('decreaser: '+decreaseCounter);
			decreaseNotific8();
			decreaseCounter--;
			console.log("waiting");
	        //document.getElementById('censor-beep-audio').play();
		},1000);;

		setTimeout(function(){

			clearInterval(waitinPicture);
			$output = $("#output");
	        camera = $("#canvas-source")[0];
	    	var scale = 1;

	        zindex++;

	        var min = -10;
			var max = 10;
			var random = Math.floor(Math.random() * (max - min + 1)) + min;
	        var img = document.createElement("img");
	        img.src = canvasSource.toDataURL();
	        $("#picture-data").attr('value',canvasSource.toDataURL());
	        var downloadLink = document.getElementById('download-link');
			downloadLink.href = img.src;
			picture_name = Math.floor(Math.random() * (999999999)) + 1;
			picture_name = CryptoJS.MD5(picture_name.toString()) + ".png";
	        $("#picture-name").attr('value', picture_name);
			downloadLink.setAttribute('download', picture_name); 
			downloadLink.click(); 
	        $(img).css("z-index",zindex);
	        $(img).css({ WebkitTransform: 'rotate(' + random + 'deg)'});
	        document.getElementById('camera-shutter-audio').play();
        	$output.prepend(img);
        	$output.children().removeClass("active-picture");
        	$(img).last().addClass("active-picture");
			console.log ($(img).last());
        	console.log('picture_taked');
        	taking_picture = false;
        	decreaseCounter = 5;
        	var image_data = canvasSource.toDataURL();
    		image_data = image_data.replace('data:image/png;base64,', '');
    		$('.fb-post').attr('data-href',fb_data_href+picture_name);
			// console.log(image_data);
        	$.ajax({
				url: "./ajax/picture_save.php", // Url to which the request is send
				type: "POST",             // Type of request to be send, called as method
		        data: { 
		        	imageData : image_data,
		        	imageName : picture_name
		        	},
		        // contentType: 'application/json; charset=utf-8',
		        // dataType: 'json',
				success: function(data)   // A function to be called if request succeeds
				{
					console.log(data);
				},
                error: function(err) {
                	console.log(err);
                    console.log('AWWW!');
                },
                progress: function(e) {
                    if(e.lengthComputable) {
                        var pct = (e.loaded / e.total) * 100;
                        $('#prog')
                            .progressbar('option', 'value', pct)
                            .children('.ui-progressbar-value')
                            .html(pct.toPrecision(3) + '%')
                            .css('display', 'block');
                    } else {
                        console.warn('Content Length not reported!');
                    }
                }
			}).done(function(o){
				console.log(o);
			});

		}, 6000);        

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

	function changeVests(){

		if(!changing_image){
			vests_position++;
			color_position = 0;
			if(vests_position == vests[gender_selected].length) vests_position = 0;
			changing_image = true;
			setTimeout(function(){
				changing_image = false;
			}, 2000);
		}

	}

	function changeColor(){
		//console.log('changing_color = '+ changing_color);

		if(!changing_color){
			//console.log('changin color');
			color_position++;
			if(color_position == vests[gender_selected][vests_position].colors.length) color_position = 0;
			changing_color = true;
			setTimeout(function(){
				changing_color = false;
			}, 2000);
		}

	}

	function setImagePosition(action){
		console.log("x:"+image.x+", y:"+image.y+', w:'+image.w+', h:'+image.h);
		switch(action){
			case 'scale-up':
				if(image.w < 250){
					image.w += 3;
					image.h = image.h/(image.w-3)*image.w;
					image.x--;
					image.y--;
				}
				break;
			case 'scale-down':
				if(image.w > 175){
					image.w -= 3;
					image.h = image.h/(image.w+3)*image.w;
					image.x++;
					image.y++;
				}
				break;
			case 'x-plus':
				if(image.x >= 125) image.x -= 5;
				break;
			case 'x-minus':
				if(image.x <= 305) image.x += 5;
				break;
			case 'y-plus':
				if(image.y <= 195) image.y += 5;
				break;
			case 'y-minus':
				if(image.y >= 75) image.y -= 5;
				break;	
			case 'take-picture':
				if(enable_picture){
					if(!taking_picture){
						taking_picture = true;
						takePicture();
					}
				} 
				break;	
			case 'next-picture':
				changeVests();
				break;	
			case 'next-color':
				changeColor();
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
				average += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2]) / 3;
				++i;
			}
			average = Math.round(average / (blendedData.data.length * 0.25));
			if (average > 10) {
				data = {confidence: average, spot: hotSpots[h]};
				action = $(data.spot.el).attr('data-action');
				//console.log(action);
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

	$("#facebook").on("click", publish);

	function publish(){
		alert("Have been clicked on me");
		var imgURL=$(".active-picture").attr("src");//change with your external photo url
		alert(imgURL);
      FB.api('/me/photos', 'post', {
          message:'photo description',
          url:imgURL        
      }, function(response){

          if (!response || response.error) {
              //console.log(response.error);
              //console.log(FB.getLoginStatus());
          } else {
              alert('Post ID: ' + response.id);
          }

      });
	}

})();