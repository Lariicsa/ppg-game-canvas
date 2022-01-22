"use strict";
import Board from "./modules/board.js";
import Powergirl from "./modules/Powergirl.js";
import Enemy from "./modules/Enemy.js";
import Laser from './modules/Laser.js'

let CANVAS = document.getElementById("canvas");
let CONTEXT = CANVAS.getContext("2d");
let end = document.querySelector(".end");
let endScore = document.querySelector(".end-score"); //ADD SCORE STYLE LIKE PPG
let up = false;
let down = false;
let shooting = false;
let life = 0;
let score = 0;
let timeBetweenEnemies = 5 * 1000;
let timeBetweenCandies = 3 * 1000;
let timeoutId = null;
let girlAngry = document.querySelector("#angry");
let girlCool = document.querySelector("#cool");
let girl1 = document.querySelector("#g1");
let girl2 = document.querySelector("#g2");
let girl3 = document.querySelector("#g3");
let girl;
let startScreen = document.querySelector(".choose");

let enemies = [];
let enemyBaseSpeed = 2;
function makeEnemy() {
  let enemyX = CANVAS.width;
  let enemySize = Math.round(Math.random() * 100) + 45;
  let enemyY =
    Math.round(Math.random() * (CANVAS.height - enemySize * 2)) + enemySize;
  let enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
  enemies.push(new Enemy(enemyX, enemyY, enemySize, enemySpeed, CONTEXT));
}

//Background
const board = new Board(CANVAS.width, CANVAS.height, CONTEXT);
//laser
const bullet = new Laser(0, 0, 100, 14, 10, CONTEXT);

function isWithin(a, b, c) {
  return a > b && a < c;
}

function isColliding(a, b) {
  let result = false;
  if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
    if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
      result = true;
    }
  }
  return result;
}

function startGame() {
  CANVAS.focus();
  timeoutId = setInterval(makeEnemy, timeBetweenEnemies, timeBetweenCandies);
  board.draw();
  setTimeout(makeEnemy, 1000);
  draw();
}

function endGame() {
  board.audio2.play();
  board.draw();
  clearInterval(timeoutId);
  erase();
  CONTEXT.font = "50px Sonsie One";
  board.draw();
  CONTEXT.fillStyle = "#213867";
  CONTEXT.fillText("Game Over.", CANVAS.width / 2 - 200, CANVAS.height / 2);
  scoreHearts(score);
}

function scoreHearts(score) {
  board.audio.currentTime = 0;
  board.audio.pause();
  end.style.display = "flex";
  endScore.innerHTML = `Your Score: ${score}`;
  if (score > 5) {
    girlCool.style.display = "flex";
  } else {
    girlAngry.style.display = "flex";
    end.classList.add("fail");
  }
}

CANVAS.addEventListener("keydown", function (event) {
  event.preventDefault();
  if (event.keyCode === 38) {
    // UP
    up = true;
  }
  if (event.keyCode === 40) {
    // DOWN
    down = true;
  }
  if (event.keyCode === 32) {
    // SPACE
    shoot();
  }
  if (event.keyCode === 13) {
    board.audio.play();
    return startGame();
  }
});

CANVAS.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 38) {
    // UP
    up = false;
  }
  if (event.keyCode === 40) {
    // DOWN
    down = false;
  }
});

function erase() {
  CONTEXT.fillRect(0, 0, 800, 400);
}

function shoot() {
  bullet.audio.play();
  if (!shooting) {
    shooting = true;
    bullet.x = girl.x + girl.l;
    bullet.y = girl.y + girl.height / 2;
  }
}

girl1.addEventListener("click", function (e) {
  girl = new Powergirl(50, CANVAS.height / 2, 150, 68, 5, 0, CONTEXT);
  startScreen.className += " hide";
});

girl2.addEventListener("click", function (e) {
  girl = new Powergirl(50, CANVAS.height / 2, 150, 68, 5, 1, CONTEXT);
  startScreen.className += " hide";
});

girl3.addEventListener("click", function (e) {
  girl = new Powergirl(50, CANVAS.height / 2, 150, 68, 5, 2, CONTEXT);
  startScreen.className += " hide";
});

//Draw all
function draw() {
  erase();
  board.draw();
  let gameOver = false;

  enemies.forEach(function (enemy) {
    enemy.draw();
    enemy.x -= enemy.s;
    if (enemy.x < 0) {
      if (life < 1) {
        gameOver = true;
      }
    }
    CONTEXT.fillStyle = "#111";
  });

  enemies.forEach(function (enemy) {
    if (isColliding(enemy, girl)) {
      enemy.draw();

      if (life < 1) {
        gameOver = true;
      }
    }
  });

  if (down) {
    girl.y += girl.s;
  }
  if (up) {
    girl.y -= girl.s;
  }

  if (girl.y < 0) {
    girl.y = 0;
  }
  if (girl.y > CANVAS.height - girl.height) {
    girl.y = CANVAS.height - girl.height;
  }

  girl.draw();

  if (shooting) {
    bullet.x += bullet.s;

    enemies.forEach(function (enemy, i) {
      enemy.draw();
      if (isColliding(bullet, enemy)) {
        enemies.splice(i, 1);
        score++;
        shooting = false;

        if (score > 3 && timeBetweenEnemies > 1000) {
          enemyBaseSpeed = 3;
          clearInterval(timeoutId);
          timeBetweenEnemies -= 600;
          timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
        } else if (score > 3 && score < 5) {
          enemyBaseSpeed = 3;
        } else if (score > 5 && score < 8) {
          enemyBaseSpeed += 4;
        }
      }
    });

    if (bullet.x > CANVAS.width) {
      shooting = false;
    }

    CONTEXT.fillStyle = "#111";
    bullet.draw();
  }

  CONTEXT.font = "24px Sonsie One";
  CONTEXT.textAlign = "left";
  CONTEXT.fillText("Score: " + score, 1, 24);

  if (gameOver) {
    endGame();
  } else {
    window.requestAnimationFrame(draw);
  }
}
