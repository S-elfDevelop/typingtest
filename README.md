# typingtest
Test your typing-speed which is expressed in words-per-minute.


Public methods description.

initializeTyping() 
Initializes the initial state of the component according to the text and seconds values. 
Parameters:
text - text for typing (string),
seconds - total time (number).

typeCharacter()
This method handles the typed character, then indicates the word if it is required or finish if the word was the last. Also this method works with the timer: starts if the first character is typed, finishes if time’s up. 
Parameters:
keyCode - key of the symbol (number).

restart()
Clear input area and reload the page.
