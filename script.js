const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");
const title = document.getElementById("title");
const backgroundMusic = document.getElementById("backgroundMusic");

const boardSize = 10;
const gameSpeed = 200;
const squareTypes = {
  emptySquare: 0,
  sankeSquare: 1,
  foodSquare: 2,
};
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "snakeSquare"));
};

const drawSquare = (square, type) => {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);

  if (type === "emptySquare") {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};

const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");
  const [row, column] = newSquare.split("");

  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === "ArrowRight" && column == 0) ||
    (direction === "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.sankeSquare
  ) {
    gameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }
    drawSnake();
  }
};

const addFood = () => {
  score++;
  updateScore();
  createRandomFood();
};

function cerrarModal() {
  gameOverSign.style.display = "none";
  document.body.classList.remove("modal-open");
}

document
  .getElementById("gameOverCloseButton")
  .addEventListener("touchstart", cerrarModal);

const gameOver = () => {
  gameOverSign.style.display = "block";
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  clearInterval(moveInterval);
  startButton.disabled = false;
};

const setDirection = (newDirection) => {
  direction = newDirection;
};

const directionEvent = (key) => {
  switch (key.code) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
  }
};

const createRandomFood = () => {
  const randomEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, "foodSquare");
};

const updateScore = () => {
  scoreBoard.innerText = score;
};

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

const setGame = () => {
  snake = ["00", "01", "02", "03"];
  score = snake.length;
  direction = "ArrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const touchStart = (event) => {
  event.preventDefault(); // Agrega esta línea para evitar el desplazamiento predeterminado

  const touch = event.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;

  document.addEventListener(
    "touchmove",
    (moveEvent) => {
      moveEvent.preventDefault(); // Agrega esta línea para evitar el desplazamiento predeterminado

      const touchMove = moveEvent.touches[0];
      const deltaX = touchMove.clientX - startX;
      const deltaY = touchMove.clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimiento horizontal
        if (deltaX > 0) {
          directionEvent({ code: "ArrowRight" });
        } else {
          directionEvent({ code: "ArrowLeft" });
        }
      } else {
        // Movimiento vertical
        if (deltaY > 0) {
          directionEvent({ code: "ArrowDown" });
        } else {
          directionEvent({ code: "ArrowUp" });
        }
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    () => {
      document.removeEventListener("touchmove", () => {});
    },
    { passive: false }
  );
};

const startGame = () => {
  setGame();
  title.style.display = "none";
  gameOverSign.style.display = "none";
  startButton.disabled = true;
  backgroundMusic.play();
  drawSnake();
  updateScore();
  createRandomFood();
  document.addEventListener("keydown", directionEvent);
  document.addEventListener("touchstart", touchStart, { passive: false });
  moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

document.getElementById("start").addEventListener("touchstart", startGame);
startButton.addEventListener("click", startGame);
