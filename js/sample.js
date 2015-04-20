
(function(){
	
	// consider using a debounce utility if you get too many consecutive events
	$(window).on('motion', function(ev, data){
		//console.log('detected motion at', new Date(), 'with data:', data);
		var spot = $(data.spot.el);
		var img = spot.children("img");
		//spot.attr("id")
		// img.attr("src")
		console.log(spot.attr("id"));
		spot.addClass('active');
		checkstatus(spot);

		setTimeout(function(){
			spot.removeClass('active');
			checkstatus(spot);
		}, 230);
	});
	function checkstatus(spot){
			if(spot.hasClass('active')){
			var img = spot.children("img");
			console.log(img)
			spot.children("img").attr("src", "images/"+spot.attr("id")+"-press.png");
		}else{
			spot.children("img").attr("src", "images/"+spot.attr("id")+".png");
		}
	}
	// example using a class
	$('.link').on('motion', function(ev, data){
		//console.log('motion detected on a link to', data.spot.el.href);
	});

	// examples for id usage
	$('#one').on('motion', function(){
		//console.log('touched one');
	});

	$('#another').on('motion', function(){
		//console.log('another');
	});
})();