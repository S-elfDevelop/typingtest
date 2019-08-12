// Alias for selector https://stackoverflow.com/questions/13383886/making-a-short-alias-for-document-queryselectorall
window.$ = document.querySelectorAll.bind(document);

let typingClasses = {
	currentWord: 'current-word',
	correctWord: 'correct-word',
	incorrectWord: 'incorrect-word',
	incorrectWordBgrnd: 'incorrect-word-bgrnd'
};

let elementIds = {
	words: '#textPreview',
	input: '#typeInput',
	timer: '#timer',
	speed: '#speed',
	errors: '#errors'
};

let typingInfo = {
	seconds: 60,
	secondsLeft: 0,
	correct: 0,
	incorrect: 0,
	total: 0,
	typed: 0,
	typing: false,
	typingTimer: null
};

function initializeTyping(text, seconds) {
	if (!text) {
		console.error('Text is empty');
		return;
	}

	typingInfo.seconds = seconds;

	let words = text.split(' ');
	let wordsElement = $(elementIds.words)[0];
	wordsElement.innerHTML = '';
	_clearInput();

	for (let i = 0; i < words.length; i++) {
		let wordSpan = `<span>${words[i]}</span>`;
		wordsElement.innerHTML += wordSpan;
	}
	wordsElement.firstChild.classList.add(typingClasses.currentWord);
}

function restart() {
	_clearInput();
	location.reload();
}

function typeCharacter(e) {
	const spaceKey = 32;

	let keyCode = (e || window.event).keyCode;
	let wordElement = $(elementIds.input)[0];
	let finish = false;

	if (wordElement.value.match(/^\s/g)) {
		// empty word
		wordElement.value = '';
	} else {
		if (!typingInfo.typingTimer) {
			_startTimer(typingInfo.seconds);
		}

		if (_verifyTimer()) {
			_verifyWord(wordElement.value);
			// Push new word on 'space'
			if (keyCode == spaceKey) {
				finish = _pushWord(wordElement.value);
				_nextLine();
				_clearInput();
			}
			typingInfo.typed += 1;
		} else {
			finish = true;
		}
	}
	if (finish) {
		_finishTyping();
	}
}

function _startTimer(seconds) {
	typingInfo.secondsLeft = seconds;
	typingInfo.typingTimer = setInterval(() => {
		if (typingInfo.secondsLeft <= 0) {
			_finishTyping();
		} else {
			typingInfo.secondsLeft -= 1;
			let currentMinutes = Math.floor(typingInfo.secondsLeft / 60);
			let currentSeconds = typingInfo.secondsLeft % 60; // time - currentMinutes * 60
			let paddedCurrentSeconds = currentSeconds < 10 ? '0' + currentSeconds : currentSeconds;
			$(elementIds.timer)[0].innerHTML = `${currentMinutes}:${paddedCurrentSeconds}`;
			_refreshStatistics(typingInfo);
		}
	}, 1000);
}

function _verifyTimer() {
	let timerTextValue = $(elementIds.timer)[0].innerHTML;
	if (timerTextValue == '0:00') {
		return false;
	}
	return true;
}

function _verifyWord(word) {
	let currentElement = $(`.${typingClasses.currentWord}`)[0];
	let hasErrors = word.trim() != currentElement.innerHTML.substring(0, word.length);
	if (hasErrors) {
		currentElement.classList.add(typingClasses.incorrectWordBgrnd);
	} else {
		currentElement.classList.remove(typingClasses.incorrectWordBgrnd);
	}
	return !hasErrors;
}

function _pushWord(word) {
	let currentElement = $(`.${typingClasses.currentWord}`)[0];
	if (_verifyWord(word)) {
		currentElement.classList.remove(typingClasses.currentWord);
		currentElement.classList.add(typingClasses.correctWord);
		typingInfo.correct += 1;
	} else {
		currentElement.classList.remove(typingClasses.currentWord, typingClasses.incorrectWordBgrnd);
		currentElement.classList.add(typingClasses.incorrectWord);
		typingInfo.incorrect += 1;
	}
	typingInfo.total = typingInfo.correct + typingInfo.incorrect;
	if (!currentElement.nextSibling) {
		return true; // TODO (wordData.total >= wordList.length)
	}
	currentElement.nextSibling.classList.add(typingClasses.currentWord);
	return false;
}

function _nextLine() {
	let currentElement = $(`.${typingClasses.currentWord}`)[0]; // second line (first word)
	if (!currentElement) return;
	let previous = currentElement.previousSibling;
	if (currentElement.offsetTop > previous.offsetTop) {
		currentElement.parentElement.scrollTop += previous.offsetHeight; // TODO
	}
}

//  http://indiatyping.com/index.php/typing-tips/typing-speed-calculation-formula
//  https://en.wikipedia.org/wiki/Words_per_minute
function _refreshStatistics(data) {
	const commonWordLength = 5;
	let minutes = data.seconds === data.secondsLeft ? 1 / 60 : (data.seconds - data.secondsLeft) / 60;
	let speed_wpm = Math.ceil(data.typed / commonWordLength / minutes);
	//let adjustedSpeedWPM = Math.ceil((data.typed / commonWordLength - data.incorrect) / minutes);
	let mistyped_words = data.incorrect;
	//let accuracy = Math.ceil((correct / total) * 100);
	$(elementIds.speed)[0].innerHTML = speed_wpm >= 0 ? speed_wpm : 0;
	$(elementIds.errors)[0].innerHTML = mistyped_words;
}

function _finishTyping() {
	if (!!typingInfo.typingTimer) {
		clearInterval(typingInfo.typingTimer);
		typingInfo.typingTimer = null;
	}
}

function _clearInput() {
	$(elementIds.input)[0].value = '';
}

// function getElement(id) {
// 	return document.getElementById(id);
// }
// function getElementByClass(className) {
// 	return document.getElementsByClassName(className);
// }
