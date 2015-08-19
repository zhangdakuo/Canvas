	var isTouch = "ontouchend" in document ? true : false,
	evStart = isTouch ? 'touchstart' : 'mousedown',
	evMove = isTouch ? 'touchmove' : 'mousemove',
	evEnd = isTouch ? 'touchend' : 'mouseup',
	WH = $(window).height(),
	imgCan = document.getElementById('imgCanvas'),
	resCan = document.getElementById('hideCanvas'),
	conCan = document.getElementById('conCanvas'),
	imgStage = new createjs.Stage(imgCan);
	conStage = new createjs.Stage(conCanvas);
	// alert(WH)
	$(function () {
		$('.imgCanvas').attr('height', WH);
		$('.conCanvas').attr('height', 760);
		$('#page_icon').on('click', function() {
			$('#wrap .page').fadeOut(500);
			$('#wrap .photo').fadeIn(500);
			TemplateCanvas()
			});
		
	})
	function TemplateCanvas() {
			var Consrc = $('.swiper-slide-active').attr('sr');
			// console.log(Consrc);
			var image = new createjs.Bitmap(Consrc);
			conStage.addChild(image);
			conStage.update();
	}
	$('#upimg_canvas').on(evStart, function(){
		setResultCanvas();
			// alert(1)
			$('.upimg_canvas').fadeOut(400);
			$('#wrap .photo').fadeIn(400);
		});
	function handleFiles() {
		imgStage.removeAllChildren();
		imgStage.clear();
		var resultFile = document.getElementById("fileElem").files[0];
		var orientation, rate = 1, scal=1;

		if (resultFile) {
			EXIF.getData(resultFile, function() {
				orientation = EXIF.getTag(this, "Orientation");
				if(orientation == 6) {
					rate = 6;
				} else if(orientation == 8) {
					rate = 8;
				}

				var mpImg = new MegaPixImage(resultFile);
				mpImg.render(hideCanvas, {maxWidth:640, maxHeight:WH, quality:0.5, orientation:rate}, function(){
					var url = hideCanvas.toDataURL('jpg');
					var img = new Image();
					img.src = url;
					img.onload = function(){
						if(img.width<640) scal = 640/img.width;
						if(img.height<640) scal = 640/img.height;
						x = 320;
						y = WH/2;
						rx = img.width/2;
						ry = img.height/2;
						var bitmap = new createjs.Bitmap(url);
						bitmap.set({
							x:x, 
							y:y,
							regX:rx, 
							regY:ry,
							scaleX:scal,
							scaleY:scal,
						});
						imgStage.addChild(bitmap);
						setTimeout(function () {
							imgStage.update();
						},1000)
						

						$('.upimg_canvas').fadeIn(1000);
						$('#wrap .photo').fadeOut(1000);
						touch.on('#op', 'touchstart', function(ev){
							ev.preventDefault();
						});
						var initialScale = 1;
						var currentScale;
						var angle = 0;
						var dx = x;
						var dy = y;

						touch.on('#op', 'drag', function(ev){
							dx = dx || 0;
							dy = dy || 0;
							var offx = dx + ev.x
							var offy = dy + ev.y
							bitmap.x = offx;
							bitmap.y = offy;
							imgStage.update();
						});

						touch.on('#op', 'dragend', function(ev){
							dx += ev.x;
							dy += ev.y;
						});

						touch.on('#op', 'pinch', function(ev){
							currentScale = ev.scale - 1;
							currentScale = initialScale + currentScale;
							currentScale = currentScale < 0.1 ? 0.1 : currentScale;
							bitmap.scaleX = currentScale;
							bitmap.scaleY = currentScale;
							imgStage.update();
						});

						touch.on('#op', 'pinchend', function(ev){
							initialScale = currentScale;
						});

						touch.on('#op', 'rotate', function(ev){
							var totalAngle = angle + ev.rotation;
							if(ev.fingerStatus === 'end'){
								angle = angle + ev.rotation;
							}
							bitmap.rotation = totalAngle;
							imgStage.update();
						});

					}	
				})
})
}
}
function setResultCanvas() {
	conStage.removeAllChildren();
	conStage.clear();
	
	// if(document.getElementById("fileElem").value != '') {
	// 	var tempImg = imgCan.toDataURL("jpg");
	// 	// alert(tempImg)
	// 	var Allbitmap = new createjs.Bitmap(tempImg);
	// 	conStage.addChild(Allbitmap);
	// 	conStage.update();
		
	// }
	// 
	// 
	// 
	if(document.getElementById("fileElem").value != '') {
		var tempImg = imgCan.toDataURL("jpg");
		var tImg = new Image();
		tImg.src = tempImg;
		tImg.onload = function(){
					if(tImg.width<640) scal = 640/tImg.width;
					if(tImg.height<640) scal = 640/tImg.height;
					y = -WH/10;
			var Allbitmap = new createjs.Bitmap(tImg.src);
			Allbitmap.set({
							x:0,
							y:y
						})
			conStage.addChild(Allbitmap);
			TemplateCanvas()
			setTimeout(function () {
				conStage.update();
				console.log(conCan.toDataURL("jpg"))
			},1000)
			
		}
	}
	
}
