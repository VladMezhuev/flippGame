/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
const sampleSize = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};
/*
 *  First of all You should use MVC-like pattern to solve this task.
 *  Game maker must be customizable. For example if You pass count of cells of the gameboard // This is what we call (M)odel
 *  to input in .html file script should generate field accordingly: (2) => 2 x 2, (10) => 10 x 10 and so on. // This is what we call (C)ontroller
 *  In .html file is generated static gameboard. You must replace it with your own dynamic gameboard. // This is what we call (V)iew.
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol
 *  - add the card to a *list* of "open" cards
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol
 *    + increment the move counter and display it on the page
 *    + if all cards have matched, display a message with the final score
 */

/**
 * contance
 */

function Event(sender) {
  this._sender = sender;
  this._listeners = [];
}

Event.prototype = {
  attach: function (listener) {
    this._listeners.push(listener);
  },
  notify: function (args) {
    var index;

    for (index = 0; index < this._listeners.length; index += 1) {
      this._listeners[index](this._sender, args);
    }
  },
};
// class Counter {
//   constructor(startVal) {
//     this.count = startVal;
//   }

//   increment() {
//     return this.count++;
//   }
//   reset() {
//     return (this.count = 0);
//   }
// }

/**
 * @param {*} card -select card
 * Model
 */
const Game = {};

Game.Model = function () {
  this.icons = [];
  this.cards = [];

  this.gridChange = new Event();
  // this.findMatch = new Event();
  // this.resetMath = new Event();
  // this.stepsChange = new Event();

  // this.stepInc = new Counter(0);
  // this.gameInc = new Counter(0);
  // console.log(this.gameInc);
  // this.cardsForCompare = [];
  // this.isMathingCard = [];
  // this.needReset = [];
  // this.games = this.stepInc.count;
  // this.steps = this.gameInc.count;
  // this.bestScore = 0;
};
Game.Model.prototype = {
  createConfig: function (count) {
    // this.steps = 0;
    let unicCard = Math.pow(count, 2) / 2;
    let random = sampleSize(this.icons, unicCard);
    this.cards = random;
    random.forEach((el) => this.cards.push(el));
    this.cards = shuffle(this.cards);
    console.log(this.cards);
    this.gridChange.notify({ grid: this.cards });
  },

  getIcons: function () {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        this.icons = JSON.parse(xhr.responseText);
      }
    };
    xhr.open('GET', './js/data.json', true);
    xhr.send();
  },
  // matchCard: function (card) {
  //   this.cardsForCompare.push(card);
  //   if (this.cardsForCompare.length == 2) {
  //     setTimeout(() => {
  //       if (this.cardsForCompare[0].outerHTML == this.cardsForCompare[1].outerHTML) {
  //         this.isMathingCard.push(this.cardsForCompare[0]);
  //         this.isMathingCard.push(this.cardsForCompare[1]);
  //         this.findMatch.notify({ match: this.isMathingCard });
  //       } else {
  //         this.needReset = this.cardsForCompare;
  //         this.resetMath.notify({ val: true });
  //       }
  //       this.cardsForCompare = [];
  //     }, 1500);
  //     this.stepInc.increment();
  //     // this.steps = this.stepInc.increment()

  //     this.stepsChange.notify({ val: true });
  //   }
  // },
};

Game.View = function (model, root) {
  this._model = model;
  this._root = root;
  this.scoreRow = document.createElement('div');
  this.scoreRow.classList.add('score-panel');
  this._root.appendChild(this.scoreRow);
  this.input = document.createElement('input');
  // this.gameCounter = document.createElement('p');
  // this.stepCounter = document.createElement('p');
  // this.gameReload = document.createElement('div');

  this.initialView();

  model.gridChange.attach(() => {
    this.createGrid();
  });
  // model.findMatch.attach(() => {
  //   this.checkIsWin();
  // });
  // model.resetMath.attach(() => {
  //   this.resetSelectedCard(this._model.needReset);
  // });
  // model.stepsChange.attach(() => {
  //   this.reloadSteps();
  // });
  this.gameContent = document.createElement('div');
  this.gameContent.classList.add('wrapper');
  root.appendChild(this.gameContent);

  this.cards = [];

  // this.changeParam = new Event(this);
  // this.viewChange = new Event();
  // this.gameOver = new Event();
};
Game.View.prototype = {
  initialView: function () {
    this.input.setAttribute('type', 'number');
    this.input.setAttribute('placeholder', 'Only even');
    this.scoreRow.appendChild(this.input);
    // this.scoreRow.appendChild(this.gameCounter);
    // this.scoreRow.appendChild(this.stepCounter);
    // this.reloadCounter();
  },
  // reloadCounter: function () {
  //   let innerText = `Вы выиграли ${this._model.gameInc.count} игр(y)`;
  //   this.gameCounter.innerHTML = innerText;
  // },
  // reloadSteps: function () {
  //   let innerText = `Количество шагов: ${this._model.stepInc.count}`;
  //   this.stepCounter.innerHTML = innerText;
  // },
  createGrid: function () {
    this.gameContent.innerHTML = '';
    this.cards = [];
    let columnLength = Math.sqrt(this._model.cards.length);
    let width = this.gameContent.clientWidth / columnLength - 10;
    let height = this.gameContent.clientHeight / columnLength - 10;
    console.log(this._model.cards);
    this._model.cards.forEach((el) => {
      let wrap = document.createElement('div');
      wrap.classList.add('item-card', 'flip-container');
      wrap.style.width = `${width}px`;
      wrap.style.height = `${height}px`;
      let html = '';
      html = `
              <i class="${el}"></i>`;
      wrap.innerHTML = html;
      this.gameContent.appendChild(wrap);
      this.cards.push(wrap);
    });

    console.log(this.cards);
    // this.viewChange.notify({ val: true });
    // return this
  },
  // checkIsWin: function () {
  //   let flipCards = this.cards.filter((el) => el.classList.contains('hover'));
  //   if (flipCards.length == this.cards.length) {
  //     console.log(this._model.gameInc);
  //     this._model.gameInc.increment();

  //     this.reloadCounter();

  //     let content = `<h1 class='title'> Поздравляем! Вы победили! Ваш счет: ${this._model.stepInc.count}.  Сыграем еще? </h1>
  //                   <div class='btn-wrap'>
  //                     <a class='btn btn--reload'> Дааааа</a>
  //                     <a class='btn btn--close'> Неее </a>
  //                   </div>`;
  //     this.gameReload.classList.add('reload-overlay');
  //     this.gameReload.innerHTML = content;
  //     this._root.appendChild(this.gameReload);
  //     this.gameOver.notify({ val: true });
  //     console.log(this.gameReload);
  //   }
  // },
  // resetSelectedCard: function (cards) {
  //   cards.forEach((card) => {
  //     if (card.classList.contains('hover')) {
  //       card.classList.remove('hover');
  //     }
  //   });
  // },
};

Game.Controller = function (model, view) {
  view.input.addEventListener('change', (e) => {
    let even = Math.round(e.target.value / 2) * 2;
    e.target.value = even;
    model.createConfig(even);
  });

  // view.viewChange.attach(() => {
  //   console.log(view.cards);
  //   view.cards.forEach((card) => {
  //     card.addEventListener('click', (e) => {
  //       // console.log(model.cardsForCompare.length )
  //       if (model.cardsForCompare.length < 2) {
  //         if (!card.classList.contains('hover')) {
  //           card.classList.add('hover');
  //           model.matchCard(card);
  //         }
  //       }
  //     });
  //   });
  // });
  // view.gameOver.attach(() => {
  //   let reloadBtn = view.gameReload.getElementsByClassName('btn--reload')[0];
  //   let closeBtn = view.gameReload.getElementsByClassName('btn--close')[0];
  //   reloadBtn.addEventListener('click', (e) => {
  //     // view.reloadThisGame()
  //     model.createConfig(view.input.value);
  //     model.stepInc.reset();
  //     view.reloadSteps();
  //     // let event = new Event('click')
  //     // closeBtn.dispatchEvent(event)
  //     view._root.removeChild(view.gameReload);
  //     view.gameReload.innerHTML = '';
  //   });
  //   closeBtn.addEventListener('click', (e) => {
  //     view._root.removeChild(view.gameReload);
  //     view.gameReload.innerHTML = '';
  //   });
  // });
};

document.addEventListener('DOMContentLoaded', (e) => {
  const model = new Game.Model();
  model.getIcons();
  console.log(model.getIcons());
  let divRoot = document.createElement('div');
  divRoot.classList.add('root-container');
  document.getElementsByTagName('body')[0].prepend(divRoot);
  const view = new Game.View(model, divRoot);
  const controller = new Game.Controller(model, view);
});

{
  /*  */
}
