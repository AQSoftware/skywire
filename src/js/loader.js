////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

/*!
* 
* START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
* 
*/
function initPreload(_oData) {
	var _additionalInfo = _oData._additionalInfo;
	var _difficultyLevel = _oData.difficultyLevel;
	if (_additionalInfo) {
		if ((_oData.hasTargetScore)&&(_additionalInfo.targetScore)) {
			playerData.targetScore = _additionalInfo.targetScore[_difficultyLevel-1];
		}
		if (_additionalInfo.winCaption) {
			textWin = _additionalInfo.winCaption;
		}
		if (_additionalInfo.loseCaption) {
			textLose = _additionalInfo.loseCaption;
		}
	}
	console.log("_additionalInfo", _oData);
	if (_firstStart) {
		_firstStart = false;
		toggleLoader(true);
	}

	checkMobileEvent();

	$(window).resize(function () {
		resizeGameFunc();
	});
	resizeGameFunc();


	loader = new createjs.LoadQueue(false);
	manifest = [{ src: 'assets/background.jpg', id: 'background' },
	{ src: 'assets/button_start.png', id: 'buttonStart' },
	/// { src: 'assets/logo.png', id: 'logo' },

	{ src: 'assets/score.png', id: 'scoreTitle' },
	{ src: 'assets/button_replay.png', id: 'buttonReplay' },
	{ src: 'assets/button_share.png', id: 'buttonShare' },
	{ src: 'assets/share.png', id: 'shareTitle' },
	{ src: 'assets/button_back.png', id: 'buttonBack' },
	{ src: 'assets/button_facebook.png', id: 'buttonFacebook' },
	{ src: 'assets/button_twitter.png', id: 'buttonTwitter' },
	{ src: 'assets/button_google.png', id: 'buttonGoogle' },

	{ src: 'assets/bottom_Spritesheet5x5.png', id: 'bottom' },

	{ src: 'assets/head.png', id: 'head' },
	{ src: 'assets/body.png', id: 'body' },
	{ src: 'assets/handL.png', id: 'handL' },
	{ src: 'assets/handL1.png', id: 'handL1' },
	{ src: 'assets/handL2.png', id: 'handL2' },
	{ src: 'assets/handR.png', id: 'handR' },
	{ src: 'assets/handR1.png', id: 'handR1' },
	{ src: 'assets/handR2.png', id: 'handR2' }
	];

	for (n = 0; n < buildings_arr.length; n++) {
		manifest.push({ src: buildings_arr[n], id: 'building' + n })
	}

/// MMM
	if (_additionalInfo.startBackground) {
		manifest.push({src: _additionalInfo.startBackground, id: "background"})
	}
	if (_additionalInfo.gameBackground) {
		manifest.push({src: _additionalInfo.gameBackground, id: "background"})
	}
	if (_additionalInfo.playButton) {
		manifest.push({src: _additionalInfo.playButton, id: "buttonStart"})
	}
	if (_additionalInfo.building) {
		for (n = 0; n < _additionalInfo.building.length; n++) {
			manifest.push({ src: _additionalInfo.building[n], id: 'building' + n })
		}
	}
	if (_additionalInfo.head) {
		manifest.push({src: _additionalInfo.head, id: "head"})
	}
	if (_additionalInfo.body) {
		manifest.push({src: _additionalInfo.head, id: "body"})
	}
	if (_additionalInfo.handL1) {
		manifest.push({src: _additionalInfo.handL1, id: "handL1"})
	}
	if (_additionalInfo.handL2) {
		manifest.push({src: _additionalInfo.handL2, id: "handL2"})
	}
	if (_additionalInfo.handR1) {
		manifest.push({src: _additionalInfo.handR1, id: "handR1"})
	}
	if (_additionalInfo.handR2) {
		manifest.push({src: _additionalInfo.handR2, id: "handR2"})
	}
///
	soundOn = true;
	if ($.browser.mobile || isTablet) {
		if (!enableMobileSound) {
			soundOn = false;
		}
	}

	if (soundOn) {
		manifest.push({ src: 'assets/sounds/ambient.ogg', id: 'musicAmbient' })
		manifest.push({ src: 'assets/sounds/rope1.ogg', id: 'soundRope1' })
		manifest.push({ src: 'assets/sounds/rope2.ogg', id: 'soundRope2' })
		manifest.push({ src: 'assets/sounds/fall.ogg', id: 'soundFall' })
		manifest.push({ src: 'assets/sounds/heart.ogg', id: 'soundHeart' })
		manifest.push({ src: 'assets/sounds/humanscream1.ogg', id: 'soundHumanscream1' })
		manifest.push({ src: 'assets/sounds/humanscream2.ogg', id: 'soundHumanscream2' })
		manifest.push({ src: 'assets/sounds/humanscream3.ogg', id: 'soundHumanscream3' })
		manifest.push({ src: 'assets/sounds/shock1.ogg', id: 'soundShock1' })
		manifest.push({ src: 'assets/sounds/shock2.ogg', id: 'soundShock2' })
		manifest.push({ src: 'assets/sounds/shock3.ogg', id: 'soundShock3' })
		manifest.push({ src: 'assets/sounds/beep.ogg', id: 'soundBeep' })
		manifest.push({ src: 'assets/sounds/beepFinal.ogg', id: 'soundBeepFinal' })

		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}

	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error", handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader').html(Math.round(loader.progress / 1 * 100) + '%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	defaultLifeCycle.informReady();
	toggleLoader(false);
	initMain(_oData);

};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con) {
	if (con) {
		$('#mainLoader').show();
	} else {
		$('#mainLoader').hide();
	}
}