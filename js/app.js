function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * array.length);
    [array[i], array[j]] = [array[j], array[i]];
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

class Event {
  constructor() {
    this.listeners = [];
  }
  addListener(listener) {
    this.listeners.push(listener);
  }
  trigger(params) {
    this.listeners.forEach((listener) => {
      listener(params);
    });
  }
}

class Model {
  constructor() {
    this.cards = [];
    this.icons = [];

    this.deckChange = new Event();
  }

  startConfig(count) {
    let unicCard = Math.pow(count, 2) / 2;
    let random = sampleSize(this.icons, unicCard);
    this.cards = random;
    random.forEach((el) => this.cards.push(el));
    this.cards = shuffle(this.cards);
    this.deckChange.trigger({ deck: this.cards });
  }

  async getIcons() {
    const url = './js/data.json';

    let response = await fetch(url);

    if (response.ok) {
      let data = await response.json();
      this.icons = data;
      return this.icons;
    } else {
      console.log('Error', response.status);
    }
  }
}

class View {
  constructor(model, container) {
    this._model = model;
    this._container = container;
    this.input = document.createElement('input');
    this.deck = document.createElement('ul');
    this.deck.classList.add('deck');
    this._container.append(this.deck);

    this.initialView();

    model.deckChange.addListener(() => {
      this.createDeck();
    });

    this.cards = [];
  }

  initialView() {
    this.input.setAttribute('type', 'number');
    this.input.setAttribute('placeholder', 'Only even');
    this._container.prepend(this.input);
  }

  createDeck() {
    this.deck.innerHTML = '';
    this.cards = [];
    let columnLength = Math.sqrt(this._model.cards.length);
    let width;
    let height;
    columnLength < 4
      ? (width = Math.ceil(this.deck.clientWidth / columnLength - 15))
      : (width = Math.ceil(this.deck.clientWidth / columnLength - 10));
    columnLength < 4
      ? (height = Math.ceil(this.deck.clientHeight / columnLength - 15))
      : (height = Math.ceil(this.deck.clientHeight / columnLength - 10));

    this._model.cards.forEach((el) => {
      let card = document.createElement('li');
      card.classList.add('card', 'open', 'show');
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;
      let hmtl = '';
      hmtl = `<i style="width=${width}; height=${height}" class="${el}"></i>`;
      card.innerHTML = hmtl;
      this.deck.appendChild(card);
      this.cards.push(card);
    });
  }
}

class Controller {
  constructor(model, view) {
    view.input.addEventListener('change', (e) => {
      if (e.target.value < 10) {
        let even = Math.round(e.target.value / 2) * 2;
        e.target.value = even;
        model.startConfig(even);
      } else {
        e.target.value = 10;
        model.startConfig(10);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const model = new Model();
  model.getIcons();
  const container = document.createElement('div');
  container.classList.add('container');
  document.querySelector('body').prepend(container);
  const view = new View(model, container);
  const controller = new Controller(model, view);
});
