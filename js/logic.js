const cardsList = [...document.getElementsByClassName('card')];
let flipedCard = false;
let openedCards = new Array(2);
let lockBoard = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * array.length);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function flipCard() {
  if (lockBoard) return;
  if (this === openedCards[0]) return;

  this.classList.add('show', 'open');

  if (!flipedCard) {
    flipedCard = true;
    openedCards[0] = this;
    return;
  }

  openedCards[1] = this;
  lockBoard = true;

  matchCards();
}

function unflipCards() {
  setTimeout(() => {
    openedCards[0].classList.remove('show', 'open');
    openedCards[1].classList.remove('show', 'open');

    resetBoard();
  }, 1500);
}

function matchCards() {
  let isMatch = openedCards[0].children[0].className === openedCards[1].children[0].className;
  if (isMatch) {
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  openedCards[0].removeEventListener('click', flipCard);
  openedCards[1].removeEventListener('click', flipCard);

  resetBoard();
}

function resetBoard() {
  [flipedCard, lockBoard] = [false, false];
  openedCards = [];
}

let shuffledCard = shuffle(cardsList);

shuffledCard.forEach((card) => card.addEventListener('click', flipCard));

// fetch
