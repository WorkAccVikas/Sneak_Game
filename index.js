const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// let foodX = 13, foodY = 10;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let gameOver = false;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score : ${highScore}`;

const changeFoodPosition = () => {
  // Passing a random 0 - 30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = (e) => {
  // Clearing the timer and reloading the page on game over
  clearInterval(setIntervalId);
  // alert("Game Over! Press OK to replay......");

  Swal.fire({
    title: "Game Over!",
    text: "Do you want to continue",
    icon: "error",
    confirmButtonText: "OK",
    allowOutsideClick: false,
  }).then(() => {
    location.reload();
  });
};

const changeDirection = (e) => {
  // Changing velocity value based on key press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

  // Checking if the snake hti the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    // Pushing food position to snake body
    snakeBody.push([foodX, foodY]);
    // console.log(snakeBody);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerHTML = `Score : ${score}`;
    highScoreElement.innerHTML = `High Score : ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Shifting forward the values of the elements in the snake body by one
    snakeBody[i] = snakeBody[i - 1];
  }

  // Setting first element of snake body to current snake position
  snakeBody[0] = [snakeX, snakeY];

  // Updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Checking if the snake's head is out of wall, if so setting gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    console.log("Game over");
    gameOver = true;
  }
  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a div for each part of the sneak's body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
    // Checking if the snake head hit the body, if so set gameOver to true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  // htmlMarkup += `<div class="head" style="grid-area: ${snakeY}/${snakeX}"></div>`;
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
// initGame();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);
