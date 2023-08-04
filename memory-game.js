"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 500;
const IMAGES = [
  "Assets/Jay1.png",
  "Assets/Jay2.png",
  "Assets/Jay3.png",
  "Assets/Jay4.png",
  "Assets/Jay5.png",
  "Assets/Jay6.png",
  "Assets/Jay7.png",
  "Assets/Jay8.png",
  "Assets/Jay9.png",
  "Assets/Jay10.png"
];

// const images = shuffle([...IMAGES, ...IMAGES]); // Shuffled array

// createCards(images);

const info = document.getElementById('info');
const gameBoard = document.getElementById("game");
const levels = document.getElementById('levels');
const images = shuffle(IMAGES);
let matchCount;

const easy = document.getElementById("easy");
easy.addEventListener('click', function () {
  let shuffled = shuffle([...images.slice(0, 3), ...images.slice(0, 3)]);
  createCards(shuffled);
  const easyMsg = document.getElementById('easy-msg');
  easyMsg.classList.remove('hide');
  gameBoard.classList.remove('hide');
  scoreStr.classList.remove('hide');
  info.classList.add('hide');
  levels.classList.add('hide');
  matchCount = shuffled.length;
});
const medium = document.getElementById("medium");
medium.addEventListener('click', function () {
  let shuffled = shuffle([...images.slice(0, 6), ...images.slice(0, 6)]);
  createCards(shuffled);
  const mediumMsg = document.getElementById('medium-msg');
  mediumMsg.classList.remove('hide');
  gameBoard.classList.remove('hide');
  scoreStr.classList.remove('hide');
  info.classList.add('hide');
  levels.classList.add('hide');
  matchCount = shuffled.length;
});
const hard = document.getElementById("hard");
hard.addEventListener('click', function () {
  let shuffled = shuffle([...images, ...images]);
  createCards(shuffled);
  const hardMsg = document.getElementById('hard-msg');
  hardMsg.classList.remove('hide');
  gameBoard.classList.remove('hide');
  scoreStr.classList.remove('hide');
  info.classList.add('hide');
  levels.classList.add('hide');
  matchCount = shuffled.length;
});


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(images) {
  for (let image of images) {
    // missing code here ...
    let card = document.createElement('div');
    card.classList.add(`${image}`);
    card.setAttribute("revealed", "false");
    card.addEventListener('click', handleCardClick);
    gameBoard.append(card);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  // ... you need to write this ...
  let src = card.getAttribute('class');
  card.style.backgroundImage = `url('${src}')`;
  card.style.backgroundSize = "cover";
}

/** Flip a card face-down. */

function unFlipCard(card) {
  // ... you need to write this ...
  card.style.backgroundImage = '';
}

let cardLimit = 0;
let activeCard = null;
let awaitingEndOfMove = "false";
let revealedCount = 0;
let score = 0;
const scoreStr = document.getElementById('score');
const scoreNum = document.getElementById('score-num');

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(e) {
  // ... you need to write this ...
  if (cardLimit === 2) {
    return;
  };

  if (e.target === activeCard || e.target.getAttribute("revealed") === "true") {
    return;
  }

  if (awaitingEndOfMove === "false") {
    flipCard(e.target);
    activeCard = e.target;
    awaitingEndOfMove = "true";
    cardLimit++;
  } else {
    flipCard(e.target);
    cardLimit++;

    if (e.target.getAttribute('class') === activeCard.getAttribute('class')) {
      e.target.classList.add('shake');
      activeCard.classList.add('shake');
      e.target.setAttribute("revealed", "true");
      activeCard.setAttribute("revealed", "true");
      activeCard = null;
      awaitingEndOfMove = "false";
      cardLimit = 0;
      revealedCount += 2;
      score++;
      scoreNum.textContent = score;
      if (revealedCount === matchCount) {
        const finish = document.getElementById('finish');
        const startOver = document.getElementById('start-over');
        startOver.addEventListener('click', function () {
          location.reload();
        });
        const finishMsg = document.getElementById('finish-msg');
        if (score < 1 && matchCount <= 6 || score < 3 && matchCount > 6 && matchCount <= 12 || score < 5 && matchCount > 12 && matchCount <= 20) {
          finishMsg.textContent = 'Jay doesn\'t have enough food to make it through the night...  You owe me a new cat!';
        } else {
          finishMsg.textContent = 'Huzzah!  Jay lives to see another day.';
        }
        finish.classList.remove('hide');
        finish.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      setTimeout(() => {
        unFlipCard(e.target);
        unFlipCard(activeCard);
        activeCard = null;
        awaitingEndOfMove = "false";
        cardLimit = 0;
        score--;
        if (score < 0) {
          score = 0;
        }
        scoreNum.textContent = score;
      }, FOUND_MATCH_WAIT_MSECS);
    }
  }
}
