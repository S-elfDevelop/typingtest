# typingtest
Test your typing-speed which is expressed in words-per-minute.



## initializeTyping(text, seconds)
Initializes the initial state of the component according to the text and seconds values. 

**Parameters:**

``text - text for typing (string),
seconds - total time (number).``

## typeCharacter(keyCode)
This method handles the typed character, then indicates the word if it is required or finish if the word was the last. Also this method works with the timer: starts if the first character is typed, finishes if time’s up. 

**Parameters:**

``keyCode - key of the symbol (number).``

## restart()
Clears input area and reloads the page.
