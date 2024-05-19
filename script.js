// TIC TAC TOE
// Omeed Saberian
/* 
Original assignment was too easy, so I added an AI player that either plays randomly or uses minimax to play the best possible move.
*/

let board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]
/*
  0 = Empty
  1 = X
  2 = O
*/

let currentHumanPlayer = 1;

let boardOffsetX = 0;
let boardOffsetY = 0;

const boxSize = 100;
const boxPadding = 20;

let playerTurn = true;

let gameOver = false;
let winner = 0;

let endLine = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}

let gameMode = 0;

const scores = [
  0,
  -10,
  10
]

function setup() {
  createCanvas(windowWidth, windowHeight);
  boardOffsetX = width / 2 - 150;
  boardOffsetY = 400;
}

function draw() {
  background(255);
  textAlign(CENTER)
  textFont("Poppins")

  // Title
  push()
  fill("black")
  textSize(42)
  text("Tic Tac Toe", width / 2, 100)
  pop()

  // Difficulty Button
  push()
  textSize(18)
  fill("black")
  stroke("black")
  text("Game Mode", width / 2, 175)
  textSize(16)
  text("(Click to change)", width / 2, 200)
  noFill()
  rect(width / 2 - 120, 150, 240, 120)
  switch (gameMode) {
    case 0:
      text("Human vs. Human", width / 2, 240)
      break;
    case 1:
      text("Human vs. AI (Random)", width / 2, 240)
      break
    case 2:
      text("Human vs. AI (Impossible)", width / 2, 240)
      break;
  }
  pop()

  // Current Player Boxes
  push()
  // X Box
  stroke("black")
  if (currentHumanPlayer === 1) fill("red")
  else noFill()
  rect(width / 2 - 150, 310, 110, 50)
  // O Box
  if (currentHumanPlayer === 1) noFill()
  else fill("blue")
  rect(width / 2 + 150, 310, -110, 50)
  // X
  strokeWeight(2)
  if (currentHumanPlayer === 1) stroke("white") 
  else stroke("red")
  line(width / 2 - 80, 320, width / 2 - 110, 350)
  line(width / 2 - 80, 350, width / 2 - 110, 320)
  // O
  if (currentHumanPlayer === 1) stroke("blue") 
  else stroke("white")
  ellipse(width / 2 + 95, 335, 30)
  pop()
  

  // Board
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      push()
      strokeWeight(2)
      // Boxes
      noFill();
      stroke("black")
      rect(x * boxSize + boardOffsetX, y * boxSize + boardOffsetY, boxSize, boxSize)
      if (board[x][y] == 1) {
        // X
        stroke("red")
        line(x * boxSize + boardOffsetX + boxPadding,
          y * boxSize + boardOffsetY + boxPadding,
          x * boxSize + boardOffsetX + boxSize - boxPadding,
          y * boxSize + boardOffsetY + boxSize - boxPadding)

        line(x * boxSize + boardOffsetX + boxSize - boxPadding,
          y * boxSize + boardOffsetY + boxPadding,
          x * boxSize + boardOffsetX + boxPadding,
          y * boxSize + boardOffsetY + boxSize - boxPadding)

      } else if (board[x][y] == 2) {
        // O
        stroke("blue")
        ellipse(x * boxSize + boardOffsetX + boxSize / 2,
          y * boxSize + boardOffsetY + boxSize / 2,
          boxSize - boxPadding * 2)
      }
      pop()
    }
  }

  if (gameOver) {
    push()
    textSize(32)
    textAlign(CENTER)
    noFill();
    switch (winner) {
      case 0:
        stroke("black")
        text("Tie!", width / 2, height - 125)
        fill("black")
        break;
      case 1:
        stroke("red")
        text("X Wins!", width / 2, height - 125)

        strokeWeight(3)
        line(endLine.x1, endLine.y1, endLine.x2, endLine.y2)
        fill("red")
        ellipse(endLine.x1, endLine.y1, 10)
        ellipse(endLine.x2, endLine.y2, 10)
        break;
      case 2:
        stroke("blue")
        text("O Wins!", width / 2, height - 125)

        strokeWeight(3)
        line(endLine.x1, endLine.y1, endLine.x2, endLine.y2)
        fill("blue")
        ellipse(endLine.x1, endLine.y1, 10)
        ellipse(endLine.x2, endLine.y2, 10)
        break;
    }

    textSize(20)
    noStroke();
    text("Click anywhere to start again...", width / 2, height - 75)
    pop();
  }
  text("Made by Omeed Saberian", width / 2, height - 25)
}

function mousePressed() {

  if (gameOver) {
    resetGame();
    return;
  }

  // Click on difficulty box
  if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 &&
    mouseY > 150 && mouseY < 250) {
    currentHumanPlayer = 1;
    gameMode++;
    resetGame();
    if (gameMode > 2) gameMode = 0;
    return;
  }

  // Click on board
  let x = floor((mouseX - boardOffsetX) / boxSize);
  let y = floor((mouseY - boardOffsetY) / boxSize);

  if (x > 2 || y > 2 || x < 0 || y < 0) return;

  if (board[x][y] == 0 && playerTurn) {
    board[x][y] = currentHumanPlayer;
    playerTurn = false;

    checkWin();
    if (!gameOver && gameMode !== 0) aiTurn();
    else if (!gameOver && gameMode == 0) {
      if (currentHumanPlayer == 1) currentHumanPlayer = 2;
      else currentHumanPlayer = 1;
      playerTurn = true;
    }
  }
}

function aiTurn() {
  let possibleMoves = [];

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (board[x][y] == 0) {
        possibleMoves.push({ x: x, y: y });
      }
    }
  }

  if (gameMode === 1) {
    let randomMoveIndex = floor(random(possibleMoves.length))
    let randomMove = possibleMoves[randomMoveIndex];

    board[randomMove.x][randomMove.y] = 2;
  } else if (gameMode === 2) {
    const bestMove = getBestMove()
    board[bestMove.x][bestMove.y] = 2;
  }

  checkWin();
  playerTurn = true;
}

function checkWin(minimax = false) {
  let winner = null;
  let endLineX1 = 0;
  let endLineY1 = 0;
  let endLineX2 = 0;
  let endLineY2 = 0;

  // VVV X Wins VVV
  if (board[0][0] === 1 && board[0][1] === 1 && board[0][2] === 1) {
    winner = 1;
    endLineY2 = 2;
  }
  else if (board[1][0] === 1 && board[1][1] === 1 && board[1][2] === 1) {
    winner = 1;
    endLineX1 = 1;
    endLineY1 = 1;
    endLineY2 = 2;
  }
  else if (board[2][0] === 1 && board[2][1] === 1 && board[2][2] === 1) {
    winner = 1;
    endLineX1 = 2;
    endLineY1 = 2;
    endLineY2 = 2;
  }
  else if (board[0][0] === 1 && board[1][0] === 1 && board[2][0] === 1) {
    winner = 1;
    endLineY1 = 2;
  }
  else if (board[0][1] === 1 && board[1][1] === 1 && board[2][1] === 1) {
    winner = 1;
    endLineX2 = 1;
    endLineY1 = 2;
    endLineY2 = 1;
  }
  else if (board[0][2] === 1 && board[1][2] === 1 && board[2][2] === 1) {
    winner = 1;
    endLineX2 = 2;
    endLineY1 = 2;
    endLineY2 = 2;
  }
  else if (board[0][0] === 1 && board[1][1] === 1 && board[2][2] === 1) {
    winner = 1;
    endLineY1 = 2;
    endLineY2 = 2;
  }
  else if (board[0][2] === 1 && board[1][1] === 1 && board[2][0] === 1) {
    winner = 1;
    endLineX2 = 2;
    endLineY1 = 2;
  }
  // VVV O Wins VVV
  else if (board[0][0] === 2 && board[0][1] === 2 && board[0][2] === 2) {
    winner = 2;
    endLineY2 = 2;
  }
  else if (board[1][0] === 2 && board[1][1] === 2 && board[1][2] === 2) {
    winner = 2;
    endLineX1 = 1;
    endLineY1 = 1;
    endLineY2 = 2;
  }
  else if (board[2][0] === 2 && board[2][1] === 2 && board[2][2] === 2) {
    winner = 2;
    endLineX1 = 2;
    endLineY1 = 2;
    endLineY2 = 2;
  }
  else if (board[0][0] === 2 && board[1][0] === 2 && board[2][0] === 2) {
    winner = 2;
    endLineY1 = 2;
  }
  else if (board[0][1] === 2 && board[1][1] === 2 && board[2][1] === 2) {
    winner = 2;
    endLineX2 = 1;
    endLineY1 = 2;
    endLineY2 = 1;
  }
  else if (board[0][2] === 2 && board[1][2] === 2 && board[2][2] === 2) {
    winner = 2;
    endLineX2 = 2;
    endLineY1 = 2;
    endLineY2 = 2;
  }
  else if (board[0][0] === 2 && board[1][1] === 2 && board[2][2] === 2) {
    winner = 2;
    endLineY1 = 2;
    endLineY2 = 2;
  }
  else if (board[0][2] === 2 && board[1][1] === 2 && board[2][0] === 2) {
    winner = 2;
    endLineX2 = 2;
    endLineY1 = 2;
  }
  // VVV Tie VVV
  else if (board[0][0] != 0 && board[0][1] != 0 && board[0][2] &&
    board[1][0] != 0 && board[1][1] != 0 && board[1][2] != 0 &&
    board[2][0] != 0 && board[2][1] != 0 && board[2][2] != 0) {
    winner = 0;
  }

  if (!minimax && winner != null) endGame(winner, endLineX1, endLineX2, endLineY1, endLineY2)
  else if (minimax) return winner;
}

function endGame(winnerIndex, box1X, box1Y, box2X, box2Y) {
  gameOver = true;
  switch (winnerIndex) {
    case 0:
      winner = 0;
      break;
    case 1:
      winner = 1;
      endLine = {
        x1: box1X * boxSize + boardOffsetX + boxSize / 2,
        y1: box1Y * boxSize + boardOffsetY + boxSize / 2,
        x2: box2X * boxSize + boardOffsetX + boxSize / 2,
        y2: box2Y * boxSize + boardOffsetY + boxSize / 2
      }
      break;
    case 2:
      winner = 2;
      endLine = {
        x1: box1X * boxSize + boardOffsetX + boxSize / 2,
        y1: box1Y * boxSize + boardOffsetY + boxSize / 2,
        x2: box2X * boxSize + boardOffsetX + boxSize / 2,
        y2: box2Y * boxSize + boardOffsetY + boxSize / 2
      }
      break;
  }
}

function resetGame() {
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  gameOver = false;
  playerTurn = true;
  winner = 0;
  endLine = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (board[x][y] == 0) {
        board[x][y] = 2;
        let score = minimax(board, 0, false);
        board[x][y] = 0;

        if (score > bestScore) {
          bestScore = score;
          bestMove = { x: x, y: y };
        }
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, maximizing) {
  let result = checkWin(true);
  if (result != null) return scores[result];

  if (maximizing) {
    let bestScore = -Infinity;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[x][y] == 0) {
          board[x][y] = 2;
          let score = minimax(board, depth + 1, false);
          board[x][y] = 0;
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[x][y] == 0) {
          board[x][y] = 1;
          let score = minimax(board, depth + 1, true);
          board[x][y] = 0;
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}
