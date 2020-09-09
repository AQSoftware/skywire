////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////
var stageWidth, stageHeight = 0;
var isLoaded = false;
var _firstStart = true;
var _props;
var bgImg;
var _oData = {};
var Events = AQCore.Events;
var _isSoundMuted = false;
var oldData = {};
var sameImagesFlag = false;
var defAssetsLoaded = false;

/*!
* 
* DOCUMENT READY
* 
*/
$(function () {

	var defaultLifeCycle = AQCore.defaultLifeCycle;
	var Utils = AQCore.Utils;
	_props = props;
	var _additionalInfo = _props.data.engagementInfo;

	var resumeAudioContext = function () {
		// handler for fixing suspended audio context in Chrome
		try {
			if (createjs.WebAudioPlugin.context.state === "suspended") {
				createjs.WebAudioPlugin.context.resume();
				// Should only need to fire once
				window.removeEventListener("click", resumeAudioContext);
			}
		} catch (e) {
			// SoundJS context or web audio plugin may not exist
			console.error("There was an error while trying to resume the SoundJS Web Audio context...");
			console.error(e);
		}
	};
	window.addEventListener("click", resumeAudioContext);

	// Check for running exported on file protocol
	if (window.location.protocol.substr(0, 4) === "file") {
		alert("To install the game just upload folder 'game' to your server. The game won't run locally with some browser like Chrome due to some security mode.");
	}

	$(window).resize(function () {
		resizeLoaderFunc();
	});
	resizeLoaderFunc();
	checkBrowser();



	this._onData = function (data) {
		console.log(data);
	/// MMM !!!
	oldData = JSON.parse(JSON.stringify(data));

		//if (data.isSoundMuted) {
				createjs.Sound.muted = data.isSoundMuted;
				_isSoundMuted = data.isSoundMuted;
		//}  
		_oData._additionalInfo = data.engagementInfo;
		_oData.hasTargetScore = data.hasTargetScore;
		_oData.argetScore = data.targetScore
		_oData.difficultyLevel = data.difficultyLevel;
		/// _oData.shouldWin = data.shouldWin;
		if (_oData.hasTargetScore) {
			_oData.targetScore = _oData._additionalInfo.targetScore[_oData.difficultyLevel-1];
		}
		///_oData.targetScore = data.targetScore
		if (_oData._additionalInfo.backgroundBig) {
			_oData.backgroundImage = _oData._additionalInfo.backgroundBig;
			defaultLifeCycle.setAppData({
				backgroundBig: _oData.backgroundImage,

			});
		}
		//ADD PRELOADER
		//  this.gotoMenu();
		//_oPreloader = new CPreloader();
		isLoaded = false;
		checkBrowser();
	}

	this._onReset = function (newData) {
		_oData._additionalInfo = newData.engagementInfo;
		_oData.hasTargetScore = newData.hasTargetScore;
		_oData.difficultyLevel = newData.difficultyLevel;
		if (_oData.hasTargetScore) {
			_oData.targetScore = _oData._additionalInfo.targetScore[_oData.difficultyLevel-1];
		}

		_oData.shouldWin = newData.shouldWin;
		///_oData.background = _oData._additionalInfo.backgroundBig;
		removeGameCanvas();
		TweenMax.killAll();
		createjs.Tween.removeAllTweens();

		if (checkDataImagesEquality(oldData, newData)) {
			console.log("SAME DATA !!!");
			sameImagesFlag = true;
			handleComplete();
		} else {
			/// MMM !!!
			oldData = JSON.parse(JSON.stringify(newData));
			///
			sameImagesFlag = false;
			isLoaded = false;
			//checkBrowser();
		}
		// initMain(_oData)
	}

	function onAppStateChange(data) {
		if (!data.isSoundMuted) {
			if (data.state == "inactive") {
				createjs.Sound.muted = true;
				_isSoundMuted = true;
			} else {
				createjs.Sound.muted = false;
				_isSoundMuted = false;
			}
		}  
		if (data.state == "active") {
			createjs.Sound.muted = data.isSoundMuted;
			_isSoundMuted = data.isSoundMuted;
		}
	  }
	
	//setting call back handlers
	defaultLifeCycle.setOnDataCallback(this._onData.bind(this));
	defaultLifeCycle.setOnResetCallback(this._onReset.bind(this));
	defaultLifeCycle.setCallback(Events.ON_APP_STATE_CHANGE, onAppStateChange);
	///defaultLifeCycle.informLoaded();
	if (_props.devt) {
		//console.log(_props.data)
		this._onData(_props.data)
	}



});

  
/*!
 * 
 * LOADER RESIZE - This is the function that runs to centeralised loader when resize
 * 
 */
function resizeLoaderFunc() {
	stageWidth = $(window).width();
	stageHeight = $(window).height();

	$('#mainLoader').css('left', checkContentWidth($('#mainLoader')));
	$('#mainLoader').css('top', checkContentHeight($('#mainLoader')));
}

/*!
 * 
 * BROWSER DETECT - This is the function that runs for browser and feature detection
 * 
 */
var browserSupport = false;
var isTablet;
function checkBrowser() {
	isTablet = (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
	deviceVer = getDeviceVer();

	var canvasEl = document.createElement('canvas');
	if (canvasEl.getContext) {
		browserSupport = true;
	}

	if ($.browser.mobile || isTablet) {
		if (window.DeviceOrientationEvent) {
			browserSupport = false;
			window.addEventListener('deviceorientation', onDeviceOrientationLoad);
		} else {
			browserSupport = false;
		}
	}
	setTimeout(function () {
		startPage();
	}, 500);
}

/*!
 * 
 * START PAGE - This is the function that runs to start the page
 * 
 */
function startPage() {
	if (browserSupport) {
		if (window.DeviceOrientationEvent) {
			window.removeEventListener('deviceorientation', onDeviceOrientationLoad);
		}

		if (!isLoaded) {
			isLoaded = true;
			initPreload(_oData);
		}
	} else {
		//browser not support
		$('#notSupportHolder').show();
	}
}

/*!
 * 
 * DEVICE ORIENTATION DETECTION - This is the function that runs for mobile orientation detection
 * 
 */
function onDeviceOrientationLoad(event) {
	if (event.gamma != null) browserSupport = true;
	startPage();
}