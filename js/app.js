/*
 * Create a list that holds all of your cards
*/

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
*/

let deck = document.querySelector('.deck'); //Selects the deck from the HTML
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockID;
let matched = 0;
const Total_Pairs = 8;

shuffleDeck();

function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

deck.addEventListener('click', function(e) {
  //creates event listener for the card tiles when clicked
  e.preventDefault();
  const clickTarget = e.target;
  if (isClickValid(clickTarget)) {
    if (clockOff) {
      startClock();
      clockOff = false;
    }

    toggleCard(clickTarget);
    addToggledCards(clickTarget);

    if (toggledCards.length === 2) {
      checkCardMatch();
      addMoves();
      checkStars();
    }
  }
});

//closes modal window after completing a game
document.querySelector('.modal_cancel').addEventListener('click', function(e) {
  e.preventDefault();
  toggleModal();
});

document.querySelector('.modal_close').addEventListener('click', function(e) {
  e.preventDefault();
  toggleModal();
});

//restarts game after clicking the restart button in the score panal
document.querySelector('.restart').addEventListener('click', resetGame);

//resets game after clicking retry button in the modal window
document.querySelector('.modal_retry').addEventListener('click', retryGame);

//function to toggle cards from open/show to closed and vice-versa
function toggleCard(target) {
  target.classList.toggle('open');
  target.classList.toggle('show');
}

//function to add toggled cards to the array
function addToggledCards(target) {
  toggledCards.push(target);
}

//fuction to check if toggled cards matched
function checkCardMatch() {
  if (
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    //console.log('match!');
    toggleCard(toggledCards[0]);
    toggleCard(toggledCards[1]);
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matched++;
    if (matched === Total_Pairs) {
      gameOver();
    }
  } else {
    //console.log('no match \:\(');
    setTimeout(() => {
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 500);
  }
}

//this funtion checks the target for classes and ensures they are not already matched items, limits the selected items in the array to 2 and checks the array to ensure that it doesn't include the same target
function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, //declared variable
    temporaryValue, // undefined variable
    randomIndex; //undefined variable

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function addMoves() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

function checkStars() {
  if (moves === 16 || moves === 24) {
    removeStar();
  }
}

function removeStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

function startClock() {
  clockID = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

function stopClock() {
  clearInterval(clockID);
}

function displayTime() {
  const clock = document.querySelector('.clock');
  const seconds = time % 60;
  const minutes = Math.floor(time / 60);
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
  //console.log(clock);
}

function toggleModal() {
  let modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}

function writeStatsToModal() {
  const movesStats = document.querySelector('.modal_moves');
  const starStats = document.querySelector('.modal_stars');
  const timeStats = document.querySelector('.modal_time');
  const clockVal = document.querySelector('.clock').innerHTML;
  const stars = getStarsVal();

  movesStats.innerHTML = `Moves = ${moves}`;
  starStats.innerHTML = `Stars = ${stars}`;
  timeStats.innerHTML = `Time = ${clockVal}`;
}

function getStarsVal() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }
  }
  return starCount;
}

function retryGame() {
  resetGame();
  toggleModal();
}

function resetGame() {
  resetClock();
  resetMoves();
  resetStars();
  resetDeck();
  shuffleDeck();
}

function resetClock() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
  star = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function resetDeck() {
  const cardsToReset = Array.from(document.querySelectorAll('.deck li'));
  cardsToReset.forEach(c => {
    c.classList.remove('match');
  });
}

function gameOver() {
  stopClock();
  writeStatsToModal();
  toggleModal();
}

/*
 * set up the event listener for a card.
 * If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/
