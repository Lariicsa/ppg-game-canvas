var canvas = document.getElementById('canvas');

var context = canvas.getContext('2d');

class Board {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = './images/townsville.png'
    this.img.onload = () => {
      this.draw()
    }
    this.audio = new Audio()
    this.audio.src = './ppg-audio.mp3'
    this.audio.onload = () =>{
      this.playAudio()
    }

  }
  draw() {
    this.x--
    if (this.x < -canvas.width) {
      this.x = 0
    }
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
    context.drawImage(
      this.img,
      this.x + canvas.width,
      this.y,
      this.width,
      this.height,
    )
  }

  playAudio() {
    this.audio = true;
  }

}


class makeSquare{
  constructor(x, y, length, speed) {
    this.x= x
    this.y= y
    this.l= length
    this.s= speed
    this.img = new Image()
    this.img.src = './images/buttercup1.png'
    this.img2 = new Image()
    this.img2.src = './images/buttercup2.png'
  }

  draw() {
    //context.fillRect(this.x, this.y, this.l, this.l, this.img)
    context.drawImage(this.img, this.x, this.y, this.l, this.l)
  }
}

//Background
const board = new Board()

const ship = new makeSquare(50, canvas.height / 2 - 25, 50, 5)



var up = false;
var down = false;
var space = false;


var shooting = false;

const bullet = new makeSquare(0, 0, 10, 10)


var enemies = [];


var enemyBaseSpeed = 2;
function makeEnemy() {
  var enemyX = canvas.width;
  var enemySize = Math.round((Math.random() * 45)) + 15;
  var enemyY = Math.round(Math.random() * (canvas.height - enemySize * 2)) + enemySize;
  var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
  enemies.push(new makeSquare(enemyX, enemyY, enemySize, enemySpeed));
}


function isWithin(a, b, c) {
  return (a > b && a < c);
}


function isColliding(a, b) {
  var result = false;
  if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
    if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
      result = true;
    }
  }
  return result;
}


var score = 0;

var timeBetweenEnemies = 5 * 1000;

var timeoutId = null;


function startGame() {
  board.draw()

	// Kick off the enemy spawn interval
  timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
  // Make the first enemy
  setTimeout(makeEnemy, 1000);
  // Kick off the draw loop
  draw();
  // Stop listening for click events
  canvas.removeEventListener('click', startGame);
}

// Show the end game screen
function endGame() {
  board.draw()
	
  clearInterval(timeoutId);
  
  erase();
  context.font = '50px Sonsie One'
 
  //context.fillText('Game Over', canvas.width / 2 - 140, 200)
  context.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
}


canvas.addEventListener('keydown', function(event) {
  event.preventDefault();
  if (event.keyCode === 38) { // UP
    up = true;
  }
  if (event.keyCode === 40) { // DOWN
    down = true;
  }
  if (event.keyCode === 32) { // SPACE
    shoot();
  }
});


canvas.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 38) { // UP 
    up = false;
  }
  if (event.keyCode === 40) { // DOWN
    down = false;
  }
});


function erase() {
  
  context.fillRect(0, 0, 800, 400);
}


function shoot() {
  if (!shooting) {
    shooting = true;
    bullet.x = ship.x + ship.l;
    bullet.y = ship.y + ship.l / 2;
  }
}


function draw() {
  erase();

  board.draw()
  var gameOver = false;

  enemies.forEach(function(enemy) {
    enemy.x -= enemy.s;
    if (enemy.x < 0) {
      gameOver = true;
    }
    context.fillStyle = '#00FF00';
    enemy.draw();
  });

  enemies.forEach(function(enemy, i) {
    if (isColliding(enemy, ship)) {
      gameOver = true;
    }
  });

  if (down) {
    ship.y += ship.s;
  }
  if (up) {
    ship.y -= ship.s;
  }
 
  if (ship.y < 0) {
    ship.y = 0;
  }
  if (ship.y > canvas.height - ship.l) {
    ship.y = canvas.height - ship.l;
  }

  ship.draw();
 
  if (shooting) {
   
    bullet.x += bullet.s;

    enemies.forEach(function(enemy, i) {
      if (isColliding(bullet, enemy)) {
        enemies.splice(i, 1);
        score++;
        shooting = false;

        if (score % 10 === 0 && timeBetweenEnemies > 1000) {
          clearInterval(timeoutId);
          timeBetweenEnemies -= 1000;
          timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
        } else if (score % 5 === 0) {
          enemyBaseSpeed += 1;
        }
      }
    });
   
    if (bullet.x > canvas.width) {
      shooting = false;
    }
  
    context.fillStyle = '#0000FF';
    bullet.draw();
  }
 

  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText('Score: ' + score, 1, 25)

  if (gameOver) {
    endGame();
  } else {
    window.requestAnimationFrame(draw);
  }
}

 canvas.focus();


startGame()