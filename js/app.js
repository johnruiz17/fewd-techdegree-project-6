//Selects the #qwerty keyboard, the #phrase div and ul, and the #overlay div
//The 'missed' variable will keep track of how many incorrect guesses the user has made
const keyboard = document.querySelector('#qwerty');
const phrase = document.querySelector('#phrase');
const ul = document.querySelector('#phrase ul');
const overlay = document.querySelector('#overlay');
let missed = 0;

//Selects the 'Start Game' button in the start screen and stores it in the startGameButton variable 
//Creates a resetGameButton that will be used in the win and lose screens 
const startGameButton = document.querySelector('.btn__reset');
const resetGameButton = document.createElement('button');
resetGameButton.textContent = 'Reset Game';
resetGameButton.className = 'btn__reset';

//Hides the start screen when the user clicks on startGameButton
startGameButton.addEventListener('click', function(){
  overlay.style.display = 'none';
})

//These are the 5 phrases that are used in the game
const phrases = [
  "your guess is as good as mine",
  "time flies when you are having fun",
  "going on a wild goose chase",
  "the best thing since sliced bread",
  "birds of a feather flock together"
];

//Chooses a random phrase and returns it as an array of characters
function getRandomPhraseAsArray(arr) {
  let randomIndex = Math.floor(Math.random() * 5);
  let randomPhrase = arr[randomIndex];
  let arrayOfCharacters = randomPhrase.split("");
  return arrayOfCharacters;
}

//Adds the phrase to the display 
function addPhraseToDisplay(arr) {
  for (let i = 0; i < arr.length; i++) {
    const character = arr[i];
    const li = document.createElement('li');
    li.textContent = character;
    ul.append(li);
    if (character !== ' ' ) {
      li.className = 'letter';
    } else {
      li.className = 'space';
    }
  }
}

//Calls the above functions to set up the game
let phraseArray = getRandomPhraseAsArray(phrases);
addPhraseToDisplay(phraseArray);


//Resets the game if resetGameButton is clicked 
//Hides the win or lose screen
//Deletes the list items in the #phrase display
//Calls the getRandomPhraseAsArray and addPhraseToDisplay functions to start the game again
//Adds the .tries list items back to the #scoreboard ordered list
//Removes the .chosen class name and the 'disabled' attribute from each of the keys on the #qwerty keyboard
overlay.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    overlay.style.display = 'none';
    let listItems = document.querySelectorAll('#phrase li');
    for (let i = 0; i < listItems.length; i++) {
      let li = listItems[i];
      ul.removeChild(li);
    }
    phraseArray = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(phraseArray);
    missed = 0;
    let ol = document.querySelector('#scoreboard ol')
    ol.innerHTML = ` 
    <li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>
    <li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>
    <li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>
    <li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>
    <li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>`;

    const keys = document.querySelectorAll('#qwerty button');
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      key.className = '';
      key.removeAttribute('disabled');
    }
  }
})

//When a user clicks a key the handler checks if the letter in the key matches any of the hidden letters
//If there is a match the checkLetter function gives the hidden letter a class of .show
//Checks the condition for winning or losing 
//If all the letters are shown the overlay gets the .win class and the winning text gets displayed
//If the user has missed 5 times the overlay gets the .lose class and the losing text gets displayed
//The resetGameButton is appended to the overlay div in botch cases
keyboard.addEventListener('click', function(event) {
  function checkLetter(button) {
    const letters = document.querySelectorAll('li.letter');
    let playerChoice = button.textContent;
    let match = false;
    for (let i = 0; i < letters.length; i++) {
      let li = letters[i];
      let letter = li.textContent;
      if (playerChoice === letter) {
        li.className = 'letter show';
        match = true;
      } 
    }
    if (match) {
      return playerChoice;
    } else {
      return null;
    }
  }

  function checkWin() {
    const showClass = document.querySelectorAll('li.show') ;
    const letterClass = document.querySelectorAll('li.letter');

    if (showClass.length === letterClass.length) {
    overlay.className = 'win';
    overlay.textContent = 'Congratulations! You win!';
    overlay.style.fontSize = '1.7em';
    overlay.appendChild(resetGameButton);
    overlay.style.display = 'flex';
    
    } else if (missed >= 5) {
    overlay.className = 'lose';
    overlay.textContent = 'Sorry, you lose! Press the reset button to try again.';
    overlay.style.fontSize = '1.7em';
    overlay.appendChild(resetGameButton);
    overlay.style.display = 'flex';
    }
  };

  if (event.target.tagName === 'BUTTON') {
    const button = event.target;
    button.className = 'chosen';
    button.setAttribute('disabled', true);
    const letterFound = checkLetter(button);

    if (letterFound === null) {
      let li = document.querySelector('#scoreboard li:last-child')
      let ol = document.querySelector('#scoreboard ol')
      ol.removeChild(li);
      missed += 1;
    }

    checkWin();
  }
})