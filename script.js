'use strict';

const label = document.querySelector('h1');
const container = document.querySelector('.container');
const newGameBtn = document.querySelector('.btn-start');
const soundBtn = document.querySelector('.sound');

// Creating cell elements
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', `${i}`);
  container.appendChild(cell);
}
const cells = document.querySelectorAll('.cell');

const reservedCells = {};
// Array of the winning combinations
const winCombinations = [
  '012',
  '345',
  '678',
  '036',
  '147',
  '258',
  '048',
  '246',
];

// Saving every player's data inside arrays
const playerXData = [];
const playerOData = [];

// Variables we need to manipulate the logic
let flag = true;
let soundOn = false;
let gameOver = false;
let currentCell;
let winCombination;

// We check if player's data have set of numbers that returns one of the winning combinations. If it does, we save the winning combo for displaying it later and end the game by manipulating boolean logic
const checkForWin = function (currPlayer) {
  const str = currPlayer.join('');

  for (let i = 0; i < winCombinations.length; i++) {
    if (
      str.includes(winCombinations[i][0]) &&
      str.includes(winCombinations[i][1]) &&
      str.includes(winCombinations[i][2])
    ) {
      // Winning sound
      if (soundOn) {
        if (flag) {
          const audio = new Audio('sounds/anime-wow-sound.mp3');
          audio.play();
        }
        if (!flag) {
          const audio = new Audio('sounds/flawless-victory_sound.mp3');
          audio.play();
        }
      }

      winCombination = winCombinations[i].split('');
      return (gameOver = true);
    }
  }
};

// We highlight winning combination in UI by coloring it with a green color
const displayWinCombination = function (arr) {
  for (let el of arr) {
    document.getElementById(`${el}`).style.color = 'green';
  }
};

// We save data and then manipulate it, so we could use the function to check on winning combinations. We display the player who won if conditions allow us
const playerX = function () {
  flag = false;

  playerXData.push(currentCell);
  checkForWin(playerXData);
  if (gameOver) {
    displayWinCombination(winCombination);
    label.textContent = 'Player X epicly WON!';
  }
  currPlayer.innerHTML = 'O';
};

const playerO = function () {
  flag = true;

  playerOData.push(currentCell);
  checkForWin(playerOData);
  if (gameOver) {
    displayWinCombination(winCombination);
    label.textContent = 'Player O epicly WON!';
  }
  currPlayer.innerHTML = 'X';
};

let currPlayer = document.createElement('div');
currPlayer.classList.add('display-cell');
flag ? (currPlayer.innerHTML = 'X') : (currPlayer.innerHTML = 'O');

cells.forEach(cell =>
  cell.addEventListener('mouseenter', function () {
    // The sound if mouse covers the cell div
    if (soundOn) {
      const audio = new Audio('sounds/dry_sound.mp3');
      audio.play();
    }

    if (!cell.innerHTML) {
      cell.appendChild(currPlayer);
    }
  })
);

cells.forEach(cell =>
  cell.addEventListener('mouseleave', function () {
    if (cell.innerHTML) cell.removeChild(currPlayer);
  })
);

// We apply logic to every cell (9 in total) of the game board. Conditions allow us to switch on different players every round
cells.forEach(cell =>
  cell.addEventListener('click', function () {
    // Check if we can continue the game
    if (!gameOver) {
      // Check if current cell haven't been reserved yet
      if (!reservedCells[this.id]) {
        // Adding sound on clicking:
        if (soundOn) {
          const audio = new Audio('sounds/putdown_sound.mp3');
          audio.play();
        }

        // We get ID of the current cell and reserve it, so we couldn't manipulate it anymore. We check for the current player and display his click on cell. At the end, we return function for the current player.
        currentCell = this.id;
        reservedCells[currentCell] = 'reserved';
        if (flag) {
          cell.textContent = 'X';
          return playerX();
        }
        if (!flag) {
          cell.textContent = 'O';
          return playerO();
        }
      }
    }
  })
);

// Button that, basically, restarts the game
newGameBtn.addEventListener('click', function () {
  // We need a sound here:
  if (soundOn) {
    const audio = new Audio('sounds/pop_sound.mp3');
    audio.play();
  }

  flag = true;
  gameOver = false;
  label.textContent = 'Epic Tic Tac Toe';
  for (const prop of Object.getOwnPropertyNames(reservedCells)) {
    delete reservedCells[prop];
  }

  playerXData.length = playerOData.length = 0;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.color = '#fff';
  });

  currPlayer.innerHTML = 'X';
});

newGameBtn.addEventListener('mouseenter', function () {
  // The sound if mouse covers the cell div
  if (soundOn) {
    const audio = new Audio('sounds/dry_sound.mp3');
    audio.play();
  }
});

// Adding a sound button for user to turn on and off audio sounds

soundBtn.addEventListener('click', function () {
  let cloud;
  if (soundOn) {
    soundOn = false;
    cloud = 'mute';
  } else if (!soundOn) {
    const audio = new Audio('sounds/pop_sound.mp3');
    audio.play();
    soundOn = true;
    cloud = 'volume';
  }
  soundBtn.innerHTML = `<img src="img/${cloud}.png">`;
});
