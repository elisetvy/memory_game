"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const IMAGES = shuffle([
  "./Assets/Jay1.jpg",
  "./Assets/Jay2.jpg",
  "./Assets/Jay3.jpg",
  "./Assets/Jay4.jpg",
  "./Assets/Jay5.jpg",
  "./Assets/Jay6.jpg",
  "./Assets/Jay7.jpg",
  "./Assets/Jay8.jpg",
  "./Assets/Jay9.jpg",
  "./Assets/Jay10.jpg"
]);

const info = document.getElementById('info');
const levels = document.getElementById('levels');
const gameBoard = document.getElementById("game");
const scoreStr = document.getElementById('score');
let matchCount;

const easy = document.getElementById("easy");
easy.addEventListener('click', function () {
  let shuffled = shuffle([...IMAGES.slice(0, 3), ...IMAGES.slice(0, 3)]);
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
  let shuffled = shuffle([...IMAGES.slice(0, 6), ...IMAGES.slice(0, 6)]);
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
  let shuffled = shuffle([...IMAGES, ...IMAGES]);
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

let activeCard = null;
let moves = 0;
let revealedCount = 0;
let score = 0;
const scoreNum = document.getElementById('score-num');

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(e) {
  // ... you need to write this ...
  if (e.target === activeCard || e.target.getAttribute("revealed") === "true") {
    return;
  } else {
    moves++;
  }

  if (moves === 1) {
    flipCard(e.target);
    activeCard = e.target;
  } else if (moves === 2) {
    flipCard(e.target);

    if (e.target.getAttribute('class') === activeCard.getAttribute('class')) {
      e.target.classList.add('shake');
      activeCard.classList.add('shake');
      e.target.setAttribute("revealed", "true");
      activeCard.setAttribute("revealed", "true");
      activeCard = null;
      moves = 0;
      revealedCount += 2;
      score++;
      scoreNum.textContent = score;
      if (revealedCount === matchCount) {
        const finish = document.getElementById('finish');
        const finishMsg = document.getElementById('finish-msg');
        if (score < 1 && matchCount <= 6 || score < 3 && matchCount > 6 && matchCount <= 12 || score < 5 && matchCount > 12 && matchCount <= 20) {
          finishMsg.textContent = 'Jay doesn\'t have enough food to make it through the night...  You owe me a new cat!';
        } else {
          finishMsg.textContent = 'Huzzah!  Jay lives to see another day.';
        }
        const startOver = document.getElementById('start-over');
        startOver.addEventListener('click', function () {
          location.reload();
        });
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
        moves = 0;
        score--;
        if (score < 0) {
          score = 0;
        }
        scoreNum.textContent = score;
      }, 500);
    }
  }
}
