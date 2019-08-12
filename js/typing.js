// Alias for selector https://stackoverflow.com/questions/13383886/making-a-short-alias-for-document-queryselectorall
window.$ = document.querySelectorAll.bind(document);

const typingClasses = {
	currentWord: 'current-word',
	correctWord: 'correct-word',
	incorrectWord: 'incorrect-word',
	incorrectWordBgrnd: 'incorrect-word-bgrnd'
};

const elementIds = {
	words: '#textPreview',
	input: '#typeInput',
	timer: '#timer',
	speed: '#speed',
	errors: '#errors'
};

class TypingTest {
	_info = {
		seconds: 60,
		secondsLeft: 0,
		correct: 0,
		incorrect: 0,
		total: 0,
		typed: 0,
		typing: false,
		typingTimer: null
	};

	constructor() {
		//do nothing
	}

	initializeTyping(text, seconds) {
		if (!text) {
			console.error('Text is empty');
			return;
		}

		this._info.seconds = seconds;

		let words = text.split(' ');
		let wordsElement = $(elementIds.words)[0];
		wordsElement.innerHTML = '';
		this._clearInput();

		for (let i = 0; i < words.length; i++) {
			let wordSpan = `<span>${words[i]}</span>`;
			wordsElement.innerHTML += wordSpan;
		}
		wordsElement.firstChild.classList.add(typingClasses.currentWord);
	}

	restart() {
		this._clearInput();
		location.reload();
	}

	typeCharacter(keyCode) {
		const spaceKey = 32;

		let wordElement = $(elementIds.input)[0];
		let finish = false;

		if (wordElement.value.match(/^\s/g)) {
			// empty word
			wordElement.value = '';
		} else {
			if (!this._info.typingTimer) {
				this._startTimer(this._info.seconds);
			}

			if (this._verifyTimer()) {
				this._verifyWord(wordElement.value);
				// Push new word on 'space'
				if (keyCode == spaceKey) {
					finish = this._pushWord(wordElement.value);
					this._nextLine();
					this._clearInput();
				}
				this._info.typed += 1;
			} else {
				finish = true;
			}
		}
		if (finish) {
			this._finishTyping();
		}
	}

	_startTimer(seconds) {
		this._info.secondsLeft = seconds;
		this._info.typingTimer = setInterval(() => {
			if (this._info.secondsLeft <= 0) {
				this._finishTyping();
			} else {
				this._info.secondsLeft -= 1;
				let currentMinutes = Math.floor(this._info.secondsLeft / 60);
				let currentSeconds = this._info.secondsLeft % 60; // time - currentMinutes * 60
				let paddedCurrentSeconds = currentSeconds < 10 ? '0' + currentSeconds : currentSeconds;
				$(elementIds.timer)[0].innerHTML = `${currentMinutes}:${paddedCurrentSeconds}`;
				this._refreshStatistics(this._info);
			}
		}, 1000);
	}

	_verifyTimer() {
		let timerTextValue = $(elementIds.timer)[0].innerHTML;
		if (timerTextValue == '0:00') {
			return false;
		}
		return true;
	}

	_verifyWord(word) {
		let currentElement = $(`.${typingClasses.currentWord}`)[0];
		let hasErrors = word.trim() != currentElement.innerHTML.substring(0, word.length);
		if (hasErrors) {
			currentElement.classList.add(typingClasses.incorrectWordBgrnd);
		} else {
			currentElement.classList.remove(typingClasses.incorrectWordBgrnd);
		}
		return !hasErrors;
	}

	_pushWord(word) {
		let currentElement = $(`.${typingClasses.currentWord}`)[0];
		if (this._verifyWord(word)) {
			currentElement.classList.remove(typingClasses.currentWord);
			currentElement.classList.add(typingClasses.correctWord);
			this._info.correct += 1;
		} else {
			currentElement.classList.remove(typingClasses.currentWord, typingClasses.incorrectWordBgrnd);
			currentElement.classList.add(typingClasses.incorrectWord);
			this._info.incorrect += 1;
		}
		this._info.total = this._info.correct + this._info.incorrect;
		if (!currentElement.nextSibling) {
			return true; // TODO (wordData.total >= wordList.length)
		}
		currentElement.nextSibling.classList.add(typingClasses.currentWord);
		return false;
	}

	_nextLine() {
		let currentElement = $(`.${typingClasses.currentWord}`)[0]; // second line (first word)
		if (!currentElement) return;
		let previous = currentElement.previousSibling;
		if (currentElement.offsetTop > previous.offsetTop) {
			currentElement.parentElement.scrollTop += previous.offsetHeight; // TODO
		}
	}

	//  http://indiatyping.com/index.php/typing-tips/typing-speed-calculation-formula
	//  https://en.wikipedia.org/wiki/Words_per_minute
	_refreshStatistics(data) {
		const commonWordLength = 5;
		let minutes = data.seconds === data.secondsLeft ? 1 / 60 : (data.seconds - data.secondsLeft) / 60;
		let speed_wpm = Math.ceil(data.typed / commonWordLength / minutes);
		//let adjustedSpeedWPM = Math.ceil((data.typed / commonWordLength - data.incorrect) / minutes);
		let mistyped_words = data.incorrect;
		//let accuracy = Math.ceil((correct / total) * 100);
		$(elementIds.speed)[0].innerHTML = speed_wpm >= 0 ? speed_wpm : 0;
		$(elementIds.errors)[0].innerHTML = mistyped_words;
	}

	_finishTyping() {
		if (!!this._info.typingTimer) {
			clearInterval(this._info.typingTimer);
			this._info.typingTimer = null;
		}
	}

	_clearInput() {
		$(elementIds.input)[0].value = '';
	}
}

// function getElement(id) {
// 	return document.getElementById(id);
// }
// function getElementByClass(className) {
// 	return document.getElementsByClassName(className);
// }
