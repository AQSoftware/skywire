////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
var stageW = 405;
var stageH = 720;
var contentW = 405;
var contentH = 720;

/*!
 * 
 * START BUILD GAME - This is the function that runs build game
 * 
 */
function initMain(_oData) {
	if (!$.browser.mobile || !isTablet) {
		$('#canvasHolder').show();
	}

	initGameCanvas(stageW, stageH);
	buildGameCanvas();
	buildGameButton(_oData);
	buildInGameButton();
	buildStartBuilding();

	playSound('musicAmbient', true);
	goPage('main');
	defaultLifeCycle.informReady();
	resizeCanvas();
}

var windowW = windowH = 0;
var scalePercent = 0;
var offset = { x: 0, y: 0, left: 0, top: 0 };

/*!
 * 
 * GAME RESIZE - This is the function that runs to resize and centralize the game
 * 
 */
function resizeGameFunc() {
	setTimeout(function () {
		$('.mobileRotate').css('left', checkContentWidth($('.mobileRotate')));
		$('.mobileRotate').css('top', checkContentHeight($('.mobileRotate')));

		windowW = window.innerWidth;
		windowH = window.innerHeight;

		scalePercent = windowH / contentH;
		if ((contentW * scalePercent) > windowW) {
			scalePercent = windowW / contentW;
		}

		scalePercent = scalePercent > 1 ? 1 : scalePercent;

		if (windowW > stageW && windowH > stageH) {
			if (windowW > stageW) {
				scalePercent = windowW / stageW;
				if ((stageH * scalePercent) > windowH) {
					scalePercent = windowH / stageH;
				}
			}
		}

		var newCanvasW = ((stageW) * scalePercent);
		var newCanvasH = ((stageH) * scalePercent);

		offset.left = 0;
		offset.top = 0;

		if (newCanvasW > windowW) {
			offset.left = -((newCanvasW) - windowW);
		} else {
			offset.left = windowW - (newCanvasW);
		}

		if (newCanvasH > windowH) {
			offset.top = -((newCanvasH) - windowH);
		} else {
			offset.top = windowH - (newCanvasH);
		}

		offset.x = 0;
		offset.y = 0;

		if (offset.left < 0) {
			offset.x = Math.abs((offset.left / scalePercent) / 2);
		}
		if (offset.top < 0) {
			offset.y = Math.abs((offset.top / scalePercent) / 2);
		}

		$('canvas').css('width', newCanvasW);
		$('canvas').css('height', newCanvasH);

		$('canvas').css('left', (offset.left / 2));
		$('canvas').css('top', (offset.top / 2));

		$(window).scrollTop(0);

		resizeCanvas();
	}, 100);
}